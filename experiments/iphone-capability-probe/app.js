/* Sonda de capacidades F0 (GC-004) — experimento temporal.
 * Sin dependencias, sin red, sin almacenamiento persistente.
 * No almacena coordenadas, rutas ni altitud.
 *
 * Correcciones de la revisión AI PM (prompt 003):
 * - GPS: limpieza de recursos separada del estado final; denied se conserva;
 *   errores recuperables vuelven a running; callbacks obsoletos se descartan por generación.
 * - Wake Lock: adquisición unificada con guardia pending y generación de sesión;
 *   sentinels obsoletos se liberan sin activar; release valida identidad.
 * - Evidencia: tiempos de captura y recepción separados, acotados y sin datos personales.
 */
(function () {
  "use strict";

  var DECLARED_DEVICE = {
    model: "iPhone 11",
    os: "27.0.1",
    browser: "Safari",
    note: "declarado por Alejandro; la sonda no verifica versiones"
  };

  var GEO_ERROR_NAMES = {
    1: "Permiso denegado",
    2: "Posición no disponible",
    3: "Tiempo de espera agotado"
  };

  var MAX_SAMPLE_LOG = 120;

  var el = {
    ctxDate: document.getElementById("ctx-date"),
    ctxSecure: document.getElementById("ctx-secure"),
    ctxOrigin: document.getElementById("ctx-origin"),
    ctxUa: document.getElementById("ctx-ua"),
    apiGeo: document.getElementById("api-geolocation"),
    apiBt: document.getElementById("api-bluetooth"),
    apiWake: document.getElementById("api-wakeLock"),
    bluetoothNote: document.getElementById("bluetooth-note"),
    gpsStart: document.getElementById("gps-start"),
    gpsStop: document.getElementById("gps-stop"),
    gpsState: document.getElementById("gps-state"),
    gpsCount: document.getElementById("gps-count"),
    gpsDropped: document.getElementById("gps-dropped"),
    gpsAccuracy: document.getElementById("gps-accuracy"),
    gpsAge: document.getElementById("gps-age"),
    gpsSpeed: document.getElementById("gps-speed"),
    gpsAccuracyAgg: document.getElementById("gps-accuracy-agg"),
    wakeOn: document.getElementById("wake-on"),
    wakeOff: document.getElementById("wake-off"),
    wakeState: document.getElementById("wake-state"),
    wakeCount: document.getElementById("wake-count"),
    eventList: document.getElementById("event-list"),
    exportBtn: document.getElementById("export-btn"),
    resetBtn: document.getElementById("reset-btn")
  };

  var hasGeo = typeof navigator !== "undefined" && "geolocation" in navigator;
  var hasBt = typeof navigator !== "undefined" && "bluetooth" in navigator;
  var hasWake = typeof navigator !== "undefined" && "wakeLock" in navigator;

  var session = null;

  // GPS: generación de sesión y recursos activos.
  var gpsGen = 0;
  var watchId = null;
  var ageTimer = null;
  var prevCapture = null;
  var prevReception = null;

  // Wake Lock: generación de intención, guardia pending y sentinel actual.
  var wakeGen = 0;
  var wakePending = false;
  var wakeSentinel = null;
  var userWantsWakeLock = false;

  function freshSession() {
    return {
      schema: "ground-control/iphone-capability-probe/v1",
      opened_at: new Date().toISOString(),
      declared_device: DECLARED_DEVICE,
      secure_context: !!window.isSecureContext,
      protocol: location.protocol,
      browser_hint: browserHint(navigator.userAgent),
      apis: {
        geolocation: hasGeo,
        bluetooth: hasBt,
        wake_lock: hasWake
      },
      geolocation: {
        state: "idle",
        samples: 0,
        dropped_samples: 0,
        error_counts: {},
        speed_samples: 0,
        accuracy: { last: null, min: null, max: null, sum: 0, count: 0 },
        capture_first_at: null,
        capture_last_at: null,
        reception_first_at: null,
        reception_last_at: null,
        capture_intervals_ms: { count: 0, sum: 0, min: null, max: null },
        reception_intervals_ms: { count: 0, sum: 0, min: null, max: null },
        receptions_while_hidden: 0,
        samples_log: []
      },
      wake_lock: {
        state: "idle",
        grants: 0,
        manual_releases: 0,
        system_releases: 0,
        error_counts: {}
      },
      timeline: []
    };
  }

  function browserHint(ua) {
    if (!ua) return "desconocido";
    if (/CriOS/.test(ua)) return "Chrome en iOS (pista)";
    if (/FxiOS/.test(ua)) return "Firefox en iOS (pista)";
    if (/EdgiOS/.test(ua)) return "Edge en iOS (pista)";
    if (/Safari/.test(ua)) return "Safari (pista, sin versión)";
    return "otro (pista)";
  }

  function setBadge(node, state, text) {
    if (!node) return;
    node.dataset.state = state;
    node.textContent = text;
  }

  function setState(node, state, text) {
    if (!node) return;
    node.dataset.state = state;
    node.textContent = text;
  }

  function logEvent(type) {
    session.timeline.push({ type: type, at: new Date().toISOString() });
    renderTimeline();
  }

  function renderTimeline() {
    if (!el.eventList) return;
    if (!session.timeline.length) {
      el.eventList.innerHTML = '<li class="event-list__empty">Sin eventos todavía.</li>';
      return;
    }
    var frag = document.createDocumentFragment();
    session.timeline.slice(-40).forEach(function (entry) {
      var li = document.createElement("li");
      li.textContent = entry.at + "  ·  " + entry.type;
      frag.appendChild(li);
    });
    el.eventList.innerHTML = "";
    el.eventList.appendChild(frag);
  }

  function renderContext() {
    el.ctxDate.textContent = session.opened_at;
    el.ctxSecure.textContent = session.secure_context
      ? "Sí (" + session.protocol + ")"
      : "No — algunas APIs pueden faltar";
    el.ctxSecure.dataset.state = session.secure_context ? "ok" : "warn";
    el.ctxOrigin.textContent = location.origin;
    el.ctxUa.textContent = session.browser_hint;
  }

  function renderApis() {
    setBadge(el.apiGeo, hasGeo ? "ok" : "err", hasGeo ? "API presente" : "API ausente");
    setBadge(el.apiBt, hasBt ? "ok" : "warn", hasBt ? "API presente" : "API ausente");
    setBadge(el.apiWake, hasWake ? "ok" : "warn", hasWake ? "API presente" : "API ausente");
    if (el.bluetoothNote) {
      el.bluetoothNote.textContent = hasBt
        ? "Solo se detecta la API. No se empareja ni se leen servicios GATT."
        : "Ausencia de API es un resultado válido; no diagnostica el hardware del scooter. Esta sonda no empareja ni lee servicios GATT.";
    }
  }

  function formatAge(lastMs) {
    if (!lastMs) return "—";
    var diff = Date.now() - lastMs;
    if (diff < 0) diff = 0;
    if (diff < 1000) return "menos de 1 s";
    if (diff < 60000) return Math.round(diff / 1000) + " s";
    return Math.round(diff / 60000) + " min";
  }

  function renderGps() {
    var g = session.geolocation;
    el.gpsCount.textContent = String(g.samples);
    if (el.gpsDropped) el.gpsDropped.textContent = String(g.dropped_samples);
    el.gpsAccuracy.textContent = g.accuracy.last == null
      ? "—"
      : g.accuracy.last.toFixed(1) + " m";
    el.gpsAge.textContent = formatAge(g.capture_last_at || g.reception_last_at);
    el.gpsSpeed.textContent = g.speed_samples > 0
      ? g.speed_samples + " muestra(s) con velocidad"
      : "No disponible";
    if (g.accuracy.count > 0) {
      var avg = g.accuracy.sum / g.accuracy.count;
      el.gpsAccuracyAgg.textContent =
        g.accuracy.min.toFixed(1) + " / " + avg.toFixed(1) + " / " + g.accuracy.max.toFixed(1) + " m";
    } else {
      el.gpsAccuracyAgg.textContent = "—";
    }
  }

  function setGpsButtons(running) {
    if (el.gpsStart) el.gpsStart.disabled = running;
    if (el.gpsStop) el.gpsStop.disabled = !running;
  }

  function stopAgeTimer() {
    if (ageTimer !== null) {
      window.clearInterval(ageTimer);
      ageTimer = null;
    }
  }

  function startAgeTimer() {
    stopAgeTimer();
    ageTimer = window.setInterval(function () {
      if (el.gpsAge) el.gpsAge.textContent = formatAge(session.geolocation.capture_last_at || session.geolocation.reception_last_at);
    }, 1000);
  }

  // Limpieza de recursos GPS, independiente del estado final que decida el llamador.
  function stopGpsResources() {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
    stopAgeTimer();
  }

  function pushInterval(agg, current, prev) {
    if (current == null || prev == null) return agg;
    var delta = current - prev;
    if (delta < 0) return agg;
    agg.count += 1;
    agg.sum += delta;
    agg.min = agg.min == null ? delta : Math.min(agg.min, delta);
    agg.max = agg.max == null ? delta : Math.max(agg.max, delta);
    return agg;
  }

  function onPosition(gen, position) {
    if (gen !== gpsGen) return; // callback obsoleto tras detener/reiniciar
    var g = session.geolocation;
    var coords = position.coords || {};
    var accuracy = coords.accuracy;
    var speed = coords.speed;
    var capture = typeof position.timestamp === "number" && isFinite(position.timestamp) && position.timestamp > 0
      ? position.timestamp
      : null;
    var reception = Date.now();

    g.samples += 1;

    if (typeof accuracy === "number" && isFinite(accuracy)) {
      g.accuracy.last = accuracy;
      g.accuracy.min = g.accuracy.min == null ? accuracy : Math.min(g.accuracy.min, accuracy);
      g.accuracy.max = g.accuracy.max == null ? accuracy : Math.max(g.accuracy.max, accuracy);
      g.accuracy.sum += accuracy;
      g.accuracy.count += 1;
    }
    if (typeof speed === "number" && isFinite(speed)) {
      g.speed_samples += 1;
    }

    if (capture != null) {
      if (g.capture_first_at == null) g.capture_first_at = capture;
      g.capture_last_at = capture;
      pushInterval(g.capture_intervals_ms, capture, prevCapture);
      prevCapture = capture;
    }
    if (g.reception_first_at == null) g.reception_first_at = reception;
    g.reception_last_at = reception;
    pushInterval(g.reception_intervals_ms, reception, prevReception);
    prevReception = reception;

    if (document.visibilityState !== "visible") {
      g.receptions_while_hidden += 1;
    }

    if (g.samples_log.length >= MAX_SAMPLE_LOG) {
      g.dropped_samples += 1;
    } else {
      g.samples_log.push({ c: capture, r: reception, v: document.visibilityState });
    }

    // Una muestra válida recupera el estado running tras un error recuperable.
    g.state = "running";
    setState(el.gpsState, "ok", "Resultado observado: recibiendo muestras");
    renderGps();
  }

  function onGeoError(gen, error) {
    if (gen !== gpsGen) return; // callback obsoleto
    var code = error && error.code ? error.code : 0;
    var label = GEO_ERROR_NAMES[code] || "Error desconocido";
    var g = session.geolocation;
    g.error_counts[code] = (g.error_counts[code] || 0) + 1;

    if (code === 1) {
      // Denegación: limpiar recursos pero conservar el estado denied en UI y JSON.
      g.state = "denied";
      gpsGen += 1; // invalida cualquier callback posterior
      stopGpsResources();
      setState(el.gpsState, "err", "Permiso denegado");
      setGpsButtons(false);
      renderGps();
      return;
    }

    // Errores recuperables: observables, el watch sigue activo.
    g.state = code === 3 ? "timeout" : "error";
    setState(el.gpsState, "warn", "Resultado observado: " + label);
    renderGps();
  }

  function startGps() {
    if (!hasGeo) {
      session.geolocation.state = "unavailable";
      setState(el.gpsState, "err", "Geolocation no disponible");
      return;
    }
    if (watchId !== null) return;

    gpsGen += 1;
    var gen = gpsGen;
    prevCapture = null;
    prevReception = null;
    session.geolocation.state = "running";
    setState(el.gpsState, "idle", "Prueba en curso");
    logEvent("gps_start");

    try {
      watchId = navigator.geolocation.watchPosition(
        function (position) { onPosition(gen, position); },
        function (error) { onGeoError(gen, error); },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
      );
    } catch (err) {
      session.geolocation.state = "error";
      setState(el.gpsState, "err", "Error al iniciar: " + (err && err.name ? err.name : "desconocido"));
      return;
    }

    setGpsButtons(true);
    startAgeTimer();
  }

  function stopGps(log) {
    gpsGen += 1; // descarta callbacks pendientes
    stopGpsResources();
    session.geolocation.state = "stopped";
    setState(el.gpsState, "idle", "Prueba detenida");
    setGpsButtons(false);
    if (log !== false) logEvent("gps_stop");
    renderGps();
  }

  // ------- Wake Lock -------

  function releaseQuietly(sentinel) {
    if (!sentinel || typeof sentinel.release !== "function") return;
    try {
      Promise.resolve(sentinel.release()).catch(function () { /* sin acción */ });
    } catch (err) {
      /* sin acción */
    }
  }

  function recordWakeError(err) {
    var name = err && err.name ? err.name : "desconocido";
    session.wake_lock.error_counts[name] = (session.wake_lock.error_counts[name] || 0) + 1;
    session.wake_lock.state = "error";
    setState(el.wakeState, "err", "Error al activar: " + name);
    if (el.wakeOn) el.wakeOn.disabled = false;
    if (el.wakeOff) el.wakeOff.disabled = true;
  }

  function onSentinelRelease(sentinel, gen) {
    if (wakeSentinel !== sentinel) return; // sentinel obsoleto: no tocar el actual
    if (gen !== wakeGen) return;
    wakeSentinel = null;
    wakePending = false;
    if (userWantsWakeLock) {
      session.wake_lock.system_releases += 1;
      session.wake_lock.state = "released";
      setState(el.wakeState, "warn", "Liberado por el sistema");
      if (el.wakeOn) el.wakeOn.disabled = false;
      if (el.wakeOff) el.wakeOff.disabled = true;
    } else {
      session.wake_lock.state = "idle";
    }
  }

  function acquireWakeLock(reason) {
    if (!hasWake) {
      session.wake_lock.state = "unavailable";
      setState(el.wakeState, "err", "Wake Lock no disponible");
      return;
    }
    if (wakePending || wakeSentinel) return; // evita adquisiciones duplicadas

    userWantsWakeLock = true;
    wakePending = true;
    if (el.wakeOn) el.wakeOn.disabled = true;

    var gen = wakeGen;
    var request;
    try {
      request = navigator.wakeLock.request("screen");
    } catch (err) {
      if (gen === wakeGen) {
        wakePending = false;
        recordWakeError(err);
      }
      return;
    }

    Promise.resolve(request).then(function (sentinel) {
      if (gen !== wakeGen || !userWantsWakeLock) {
        // Resolución tardía de una sesión/intención anterior: liberar sin activar
        // y sin tocar el estado pending de una sesión nueva.
        releaseQuietly(sentinel);
        return;
      }
      wakePending = false;
      wakeSentinel = sentinel;
      session.wake_lock.grants += 1;
      session.wake_lock.state = "active";
      setState(
        el.wakeState,
        "ok",
        reason === "return"
          ? "Resultado observado: pantalla activa (readquirida)"
          : "Resultado observado: pantalla activa"
      );
      if (el.wakeOn) el.wakeOn.disabled = true;
      if (el.wakeOff) el.wakeOff.disabled = false;
      if (el.wakeCount) el.wakeCount.textContent = String(session.wake_lock.grants);
      logEvent(reason === "return" ? "wake_on_return" : "wake_on");

      if (typeof sentinel.addEventListener === "function") {
        sentinel.addEventListener("release", function () {
          onSentinelRelease(sentinel, gen);
        });
      }
    }).catch(function (err) {
      if (gen !== wakeGen) return; // no contaminar una sesión nueva
      wakePending = false;
      recordWakeError(err);
    });
  }

  function releaseWakeLock(manual) {
    userWantsWakeLock = false;
    wakeGen += 1; // invalida adquisiciones pendientes
    wakePending = false;

    var hadSentinel = false;
    if (wakeSentinel) {
      hadSentinel = true;
      var sentinel = wakeSentinel;
      wakeSentinel = null; // limpiar antes: su evento release verá un sentinel obsoleto
      releaseQuietly(sentinel);
    }

    if (manual) {
      if (hadSentinel) session.wake_lock.manual_releases += 1;
      logEvent("wake_off");
    }

    session.wake_lock.state = "idle";
    setState(el.wakeState, "idle", "Prueba sin iniciar");
    if (el.wakeOn) el.wakeOn.disabled = false;
    if (el.wakeOff) el.wakeOff.disabled = true;
  }

  function onVisibilityChange() {
    logEvent("visibility:" + document.visibilityState);
    // Readquisición solo si el usuario la dejó activa y no hay adquisición en curso.
    if (
      document.visibilityState === "visible" &&
      userWantsWakeLock &&
      !wakeSentinel &&
      !wakePending &&
      hasWake
    ) {
      acquireWakeLock("return");
    }
  }

  // ------- Exportación -------

  function summarizeIntervals(agg) {
    return {
      count: agg.count,
      min: agg.min,
      max: agg.max,
      avg: agg.count > 0 ? agg.sum / agg.count : null
    };
  }

  function buildExport() {
    var g = session.geolocation;
    return {
      schema: session.schema,
      generated_at: new Date().toISOString(),
      opened_at: session.opened_at,
      declared_device: session.declared_device,
      secure_context: session.secure_context,
      protocol: session.protocol,
      browser_hint: session.browser_hint,
      apis: session.apis,
      geolocation: {
        state: g.state,
        samples: g.samples,
        dropped_samples: g.dropped_samples,
        error_counts: g.error_counts,
        speed_samples: g.speed_samples,
        speed_available: g.speed_samples > 0,
        accuracy_m: {
          last: g.accuracy.last,
          min: g.accuracy.min,
          max: g.accuracy.max,
          avg: g.accuracy.count > 0 ? g.accuracy.sum / g.accuracy.count : null
        },
        capture: {
          first_at: g.capture_first_at,
          last_at: g.capture_last_at,
          span_ms: g.capture_first_at != null && g.capture_last_at != null
            ? g.capture_last_at - g.capture_first_at
            : null
        },
        reception: {
          first_at: g.reception_first_at,
          last_at: g.reception_last_at,
          span_ms: g.reception_first_at != null && g.reception_last_at != null
            ? g.reception_last_at - g.reception_first_at
            : null
        },
        capture_intervals_ms: summarizeIntervals(g.capture_intervals_ms),
        reception_intervals_ms: summarizeIntervals(g.reception_intervals_ms),
        receptions_while_hidden: g.receptions_while_hidden,
        samples_log: g.samples_log
      },
      wake_lock: {
        state: session.wake_lock.state,
        grants: session.wake_lock.grants,
        manual_releases: session.wake_lock.manual_releases,
        system_releases: session.wake_lock.system_releases,
        error_counts: session.wake_lock.error_counts
      },
      timeline: session.timeline
    };
  }

  function exportJson() {
    var blob = new Blob([JSON.stringify(buildExport(), null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var stamp = new Date().toISOString().replace(/[:.]/g, "-");
    var link = document.createElement("a");
    link.href = url;
    link.download = "iphone-probe-" + stamp + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function resetSession() {
    gpsGen += 1;
    stopGpsResources();
    releaseWakeLock(false); // invalida pendientes y limpia sesión anterior
    session = freshSession();
    watchId = null;
    prevCapture = null;
    prevReception = null;
    stopAgeTimer();
    setGpsButtons(false);
    if (el.wakeOn) el.wakeOn.disabled = false;
    if (el.wakeOff) el.wakeOff.disabled = true;
    if (el.wakeCount) el.wakeCount.textContent = "0";
    setState(el.gpsState, "idle", "Prueba sin iniciar");
    setState(el.wakeState, "idle", "Prueba sin iniciar");
    renderContext();
    renderApis();
    renderGps();
    renderTimeline();
  }

  function bind() {
    if (el.gpsStart) el.gpsStart.addEventListener("click", startGps);
    if (el.gpsStop) el.gpsStop.addEventListener("click", function () { stopGps(true); });
    if (el.wakeOn) el.wakeOn.addEventListener("click", function () { acquireWakeLock("manual"); });
    if (el.wakeOff) el.wakeOff.addEventListener("click", function () { releaseWakeLock(true); });
    if (el.exportBtn) el.exportBtn.addEventListener("click", exportJson);
    if (el.resetBtn) el.resetBtn.addEventListener("click", resetSession);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", function () { logEvent("pagehide"); });
    window.addEventListener("pageshow", function () { logEvent("pageshow"); });
    window.addEventListener("beforeunload", function () { stopAgeTimer(); });
  }

  session = freshSession();
  renderContext();
  renderApis();
  renderGps();
  renderTimeline();
  bind();
})();
