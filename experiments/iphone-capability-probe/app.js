/* Sonda de capacidades F0 (GC-004) — experimento temporal.
 * Sin dependencias, sin red, sin almacenamiento persistente.
 * No almacena coordenadas, rutas ni altitud.
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
  var watchId = null;
  var ageTimer = null;
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
        error_counts: {},
        speed_samples: 0,
        accuracy: { last: null, min: null, max: null, sum: 0, count: 0 },
        first_sample_at: null,
        last_sample_at: null
      },
      wake_lock: {
        state: "idle",
        grants: 0,
        releases: 0,
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
    var entry = { type: type, at: new Date().toISOString() };
    session.timeline.push(entry);
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
    setBadge(
      el.apiGeo,
      hasGeo ? "ok" : "err",
      hasGeo ? "API presente" : "API ausente"
    );
    setBadge(
      el.apiBt,
      hasBt ? "ok" : "warn",
      hasBt ? "API presente" : "API ausente"
    );
    setBadge(
      el.apiWake,
      hasWake ? "ok" : "warn",
      hasWake ? "API presente" : "API ausente"
    );
    if (el.bluetoothNote) {
      el.bluetoothNote.textContent = hasBt
        ? "Solo se detecta la API. No se empareja ni se leen servicios GATT."
        : "Ausencia de API es un resultado válido; no diagnostica el hardware del scooter. Esta sonda no empareja ni lee servicios GATT.";
    }
  }

  function renderGps() {
    var g = session.geolocation;
    el.gpsCount.textContent = String(g.samples);
    el.gpsAccuracy.textContent = g.accuracy.last == null
      ? "—"
      : g.accuracy.last.toFixed(1) + " m";
    el.gpsAge.textContent = formatAge(g.last_sample_at);
    el.gpsSpeed.textContent = g.speed_samples > 0
      ? g.speed_samples + " muestra(s) con velocidad"
      : "No disponible";
    if (g.accuracy.count > 0) {
      var avg = g.accuracy.sum / g.accuracy.count;
      el.gpsAccuracyAgg.textContent =
        g.accuracy.min.toFixed(1) + " / " +
        avg.toFixed(1) + " / " +
        g.accuracy.max.toFixed(1) + " m";
    } else {
      el.gpsAccuracyAgg.textContent = "—";
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

  function startAgeTimer() {
    stopAgeTimer();
    ageTimer = window.setInterval(function () {
      if (el.gpsAge) {
        el.gpsAge.textContent = formatAge(session.geolocation.last_sample_at);
      }
    }, 1000);
  }

  function stopAgeTimer() {
    if (ageTimer !== null) {
      window.clearInterval(ageTimer);
      ageTimer = null;
    }
  }

  function onPosition(position) {
    var g = session.geolocation;
    var accuracy = position.coords.accuracy;
    var speed = position.coords.speed;
    var at = position.timestamp || Date.now();

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
    if (g.first_sample_at == null) g.first_sample_at = at;
    g.last_sample_at = at;

    setState(el.gpsState, "ok", "Resultado observado: recibiendo muestras");
    renderGps();
  }

  function onGeoError(error) {
    var code = error && error.code ? error.code : 0;
    var label = GEO_ERROR_NAMES[code] || "Error desconocido";
    var g = session.geolocation;
    g.error_counts[code] = (g.error_counts[code] || 0) + 1;

    if (code === 1) {
      g.state = "denied";
      setState(el.gpsState, "err", "Permiso denegado");
      stopGps(false);
      return;
    }
    g.state = "error";
    setState(el.gpsState, "warn", "Error: " + label);
    renderGps();
  }

  function startGps() {
    if (!hasGeo) {
      session.geolocation.state = "unavailable";
      setState(el.gpsState, "err", "Geolocation no disponible");
      return;
    }
    if (watchId !== null) return;

    session.geolocation.state = "running";
    setState(el.gpsState, "idle", "Prueba en curso");
    logEvent("gps_start");

    try {
      watchId = navigator.geolocation.watchPosition(onPosition, onGeoError, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000
      });
    } catch (err) {
      session.geolocation.state = "error";
      setState(el.gpsState, "err", "Error al iniciar: " + (err && err.name ? err.name : "desconocido"));
      return;
    }

    el.gpsStart.disabled = true;
    el.gpsStop.disabled = false;
    startAgeTimer();
  }

  function stopGps(log) {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
    stopAgeTimer();
    session.geolocation.state = "stopped";
    setState(el.gpsState, "idle", "Prueba detenida");
    el.gpsStart.disabled = false;
    el.gpsStop.disabled = true;
    if (log !== false) logEvent("gps_stop");
    renderGps();
  }

  function requestWakeLock() {
    if (!hasWake) {
      session.wake_lock.state = "unavailable";
      setState(el.wakeState, "err", "Wake Lock no disponible");
      return;
    }
    if (wakeSentinel) return;
    userWantsWakeLock = true;
    navigator.wakeLock.request("screen").then(function (sentinel) {
      wakeSentinel = sentinel;
      session.wake_lock.grants += 1;
      session.wake_lock.state = "active";
      setState(el.wakeState, "ok", "Resultado observado: pantalla activa");
      el.wakeOn.disabled = true;
      el.wakeOff.disabled = false;
      el.wakeCount.textContent = String(session.wake_lock.grants);
      logEvent("wake_on");
      sentinel.addEventListener("release", function () {
        wakeSentinel = null;
        if (userWantsWakeLock) {
          session.wake_lock.state = "released";
          setState(el.wakeState, "warn", "Liberado por el sistema o por la página");
        } else {
          session.wake_lock.state = "idle";
          setState(el.wakeState, "idle", "Prueba sin iniciar");
        }
        el.wakeOn.disabled = false;
        el.wakeOff.disabled = true;
      });
    }).catch(function (err) {
      var name = err && err.name ? err.name : "desconocido";
      session.wake_lock.error_counts[name] = (session.wake_lock.error_counts[name] || 0) + 1;
      session.wake_lock.state = "error";
      setState(el.wakeState, "err", "Error al activar: " + name);
    });
  }

  function releaseWakeLock(manual) {
    userWantsWakeLock = false;
    if (wakeSentinel) {
      var sentinel = wakeSentinel;
      wakeSentinel = null;
      sentinel.release().then(function () {
        session.wake_lock.releases += 1;
      }).catch(function () {
        /* el release del sistema no requiere acción */
      });
    }
    if (manual !== false) logEvent("wake_off");
    session.wake_lock.state = "idle";
    setState(el.wakeState, "idle", "Prueba sin iniciar");
    el.wakeOn.disabled = false;
    el.wakeOff.disabled = true;
  }

  function onVisibilityChange() {
    logEvent("visibility:" + document.visibilityState);
    // Reintento único solo al volver a visible y si el usuario dejó la función activa.
    if (document.visibilityState === "visible" && userWantsWakeLock && !wakeSentinel && hasWake) {
      navigator.wakeLock.request("screen").then(function (sentinel) {
        wakeSentinel = sentinel;
        session.wake_lock.grants += 1;
        session.wake_lock.state = "active";
        setState(el.wakeState, "ok", "Resultado observado: pantalla activa (readquirida)");
        el.wakeCount.textContent = String(session.wake_lock.grants);
        sentinel.addEventListener("release", function () {
          wakeSentinel = null;
          if (userWantsWakeLock) {
            session.wake_lock.state = "released";
            setState(el.wakeState, "warn", "Liberado por el sistema o por la página");
          }
          el.wakeOn.disabled = false;
          el.wakeOff.disabled = true;
        });
      }).catch(function (err) {
        var name = err && err.name ? err.name : "desconocido";
        session.wake_lock.error_counts[name] = (session.wake_lock.error_counts[name] || 0) + 1;
        session.wake_lock.state = "error";
        setState(el.wakeState, "warn", "No se pudo readquirir: " + name);
      });
    }
  }

  function buildExport() {
    var g = session.geolocation;
    var avg = g.accuracy.count > 0 ? g.accuracy.sum / g.accuracy.count : null;
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
        error_counts: g.error_counts,
        speed_samples: g.speed_samples,
        speed_available: g.speed_samples > 0,
        accuracy_m: {
          last: g.accuracy.last,
          min: g.accuracy.min,
          max: g.accuracy.max,
          avg: avg
        },
        first_to_last_ms:
          g.first_sample_at != null && g.last_sample_at != null
            ? g.last_sample_at - g.first_sample_at
            : null
      },
      wake_lock: session.wake_lock,
      timeline: session.timeline
    };
  }

  function exportJson() {
    var data = JSON.stringify(buildExport(), null, 2);
    var blob = new Blob([data], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var stamp = new Date().toISOString().replace(/[:.]/g, "-");
    var link = document.createElement("a");
    link.href = url;
    link.download = "iphone-probe-" + stamp + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  function resetSession() {
    if (watchId !== null) stopGps(false);
    releaseWakeLock(false);
    session = freshSession();
    watchId = null;
    wakeSentinel = null;
    userWantsWakeLock = false;
    stopAgeTimer();
    el.gpsStart.disabled = false;
    el.gpsStop.disabled = true;
    el.wakeOn.disabled = false;
    el.wakeOff.disabled = true;
    el.wakeCount.textContent = "0";
    setState(el.gpsState, "idle", "Prueba sin iniciar");
    setState(el.wakeState, "idle", "Prueba sin iniciar");
    renderContext();
    renderApis();
    renderGps();
    renderTimeline();
  }

  function bind() {
    el.gpsStart.addEventListener("click", startGps);
    el.gpsStop.addEventListener("click", function () {
      stopGps(true);
    });
    el.wakeOn.addEventListener("click", requestWakeLock);
    el.wakeOff.addEventListener("click", function () {
      releaseWakeLock(true);
    });
    el.exportBtn.addEventListener("click", exportJson);
    el.resetBtn.addEventListener("click", resetSession);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", function () {
      logEvent("pagehide");
    });
    window.addEventListener("pageshow", function () {
      logEvent("pageshow");
    });
    window.addEventListener("beforeunload", function () {
      stopAgeTimer();
    });
  }

  session = freshSession();
  renderContext();
  renderApis();
  renderGps();
  renderTimeline();
  bind();
})();
