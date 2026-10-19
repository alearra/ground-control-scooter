/* Harness de simulación para la sonda de capacidades (GC-004).
 *
 * Ejecuta experiments/iphone-capability-probe/app.js en un DOM/APIs falsos con
 * node:vm y node:test. NO es una prueba de Safari ni del iPhone: solo valida la
 * lógica de estados, concurrencia y exportación con APIs simuladas.
 *
 * Uso: node --test experiments/iphone-capability-probe-tests/probe.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const here = dirname(fileURLToPath(import.meta.url));
const PROBE_DIR = join(here, "..", "iphone-capability-probe");
const APP_SRC = readFileSync(join(PROBE_DIR, "app.js"), "utf8");
const HTML_SRC = readFileSync(join(PROBE_DIR, "index.html"), "utf8");
const WORKFLOW_SRC = readFileSync(join(here, "..", "..", ".github", "workflows", "pages.yml"), "utf8");

const IDS = [
  "ctx-date", "ctx-secure", "ctx-origin", "ctx-ua",
  "api-geolocation", "api-bluetooth", "api-wakeLock", "bluetooth-note",
  "gps-start", "gps-stop", "gps-state", "gps-count", "gps-dropped",
  "gps-accuracy", "gps-age", "gps-speed", "gps-accuracy-agg",
  "wake-on", "wake-off", "wake-state", "wake-count",
  "event-list", "export-btn", "reset-btn"
];

function makeEl(tag) {
  return {
    tagName: tag || "div",
    dataset: {},
    textContent: "",
    innerHTML: "",
    disabled: false,
    href: "",
    download: "",
    children: [],
    listeners: {},
    addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); },
    removeEventListener() {},
    click() { (this.listeners.click || []).forEach((fn) => fn({ type: "click" })); },
    appendChild(child) { this.children.push(child); return child; },
    removeChild() {},
    emit(type, ev) { (this.listeners[type] || []).forEach((fn) => fn(ev || {})); }
  };
}

function makeGeolocation() {
  const watches = new Map();
  let next = 0;
  return {
    watchCount: 0,
    clearCount: 0,
    lastOk: null,
    lastErr: null,
    lastOptions: null,
    watchPosition(ok, err, options) {
      next += 1;
      this.watchCount += 1;
      this.lastOk = ok;
      this.lastErr = err;
      this.lastOptions = options;
      watches.set(next, { ok, err });
      return next;
    },
    clearWatch(id) { this.clearCount += 1; watches.delete(id); },
    activeCount() { return watches.size; },
    emit(position) { [...watches.values()].forEach((w) => w.ok(position)); },
    fail(error) { [...watches.values()].forEach((w) => w.err(error)); }
  };
}

function makeSentinel() {
  const s = {
    released: false,
    releaseCalls: 0,
    listeners: [],
    addEventListener(type, fn) { if (type === "release") s.listeners.push(fn); },
    release() { s.released = true; s.releaseCalls += 1; return Promise.resolve(); },
    fireRelease() { s.listeners.forEach((fn) => fn({})); }
  };
  return s;
}

function makeWakeLock() {
  const pending = [];
  return {
    requestCount: 0,
    pendingCount() { return pending.length; },
    request() {
      this.requestCount += 1;
      let resolve;
      let reject;
      const p = new Promise((res, rej) => { resolve = res; reject = rej; });
      pending.push({ resolve, reject, p });
      return p;
    },
    resolveNext(sentinel) { const d = pending.shift(); d.resolve(sentinel); return d; },
    rejectNext(err) { const d = pending.shift(); d.reject(err); return d; }
  };
}

function createEnv(opts = {}) {
  const { geolocation = true, wakeLock = true, bluetooth = true, secure = true } = opts;
  const elements = {};
  IDS.forEach((id) => { elements[id] = makeEl("div"); });

  const domListeners = {};
  const created = [];
  const document = {
    visibilityState: "visible",
    body: makeEl("body"),
    getElementById: (id) => elements[id] || null,
    createElement: (tag) => { const e = makeEl(tag); created.push(e); return e; },
    createDocumentFragment: () => makeEl("#fragment"),
    addEventListener: (type, fn) => { (domListeners[type] ||= []).push(fn); },
    emit: (type, ev) => { (domListeners[type] || []).forEach((fn) => fn(ev || {})); },
    _created: created
  };

  const winListeners = {};
  const timers = new Map();
  let timerId = 0;
  const window = {
    isSecureContext: secure,
    setInterval: (fn) => { timerId += 1; timers.set(timerId, fn); return timerId; },
    clearInterval: (id) => timers.delete(id),
    setTimeout: (fn) => { timerId += 1; timers.set(timerId, fn); return timerId; },
    clearTimeout: (id) => timers.delete(id),
    addEventListener: (type, fn) => { (winListeners[type] ||= []).push(fn); },
    emit: (type, ev) => { (winListeners[type] || []).forEach((fn) => fn(ev || {})); }
  };

  const navigator = { userAgent: "Mozilla/5.0 (iPhone) Safari/604.1" };
  const geo = makeGeolocation();
  const wake = makeWakeLock();
  if (geolocation) navigator.geolocation = geo;
  if (wakeLock) navigator.wakeLock = wake;
  if (bluetooth) navigator.bluetooth = {};

  const location = { protocol: secure ? "https:" : "http:", origin: "https://example.test" };

  const urlStore = new Map();
  let urlId = 0;
  const URL = {
    createObjectURL(blob) { urlId += 1; const u = "blob:" + urlId; urlStore.set(u, blob); return u; },
    revokeObjectURL() {}
  };
  class Blob {
    constructor(parts, options) { this.parts = parts; this.type = options && options.type; }
  }

  const clock = { now: 1_000_000 };
  const RealDate = Date;
  function SandboxDate(...args) { return new RealDate(...args); }
  SandboxDate.now = () => clock.now;
  SandboxDate.prototype = RealDate.prototype;

  const sandbox = {
    window, document, navigator, location, URL, Blob,
    console, Promise, Date: SandboxDate,
    Math, JSON, isFinite, Number, String, Object, Array, Error
  };
  vm.createContext(sandbox);
  vm.runInContext(APP_SRC, sandbox, { filename: "app.js" });

  return { elements, document, window, navigator, geo, wake, clock, urlStore };
}

async function flush() {
  for (let i = 0; i < 10; i += 1) await Promise.resolve();
}

function readExport(env) {
  env.elements["export-btn"].click();
  const anchors = env.document._created.filter((a) => a.tagName === "a" && a.download);
  assert.ok(anchors.length >= 1, "no se creó el enlace de exportación");
  const anchor = anchors[anchors.length - 1];
  const blob = env.urlStore.get(anchor.href);
  assert.ok(blob, "no se encontró el blob exportado");
  return JSON.parse(blob.parts.join(""));
}

function position(overrides = {}) {
  const { timestamp = 1000, accuracy = 5, speed = null, ...rest } = overrides;
  return { timestamp, coords: { accuracy, speed }, ...rest };
}

// ---- GPS ----

test("GPS: permiso denegado conserva denied en UI y JSON y limpia recursos", async () => {
  const env = createEnv();
  env.elements["gps-start"].click();
  assert.equal(env.geo.watchCount, 1);
  env.geo.fail({ code: 1 });
  await flush();

  assert.equal(env.elements["gps-state"].textContent, "Permiso denegado");
  assert.equal(env.elements["gps-state"].dataset.state, "err");
  assert.equal(env.geo.clearCount, 1);
  assert.equal(env.geo.activeCount(), 0);
  assert.equal(env.elements["gps-start"].disabled, false);
  assert.equal(env.elements["gps-stop"].disabled, true);

  const out = readExport(env);
  assert.equal(out.geolocation.state, "denied");
  assert.equal(out.geolocation.error_counts["1"], 1);
});

test("GPS: error recuperable observable y una muestra válida vuelve a running", async () => {
  const env = createEnv();
  env.elements["gps-start"].click();
  env.geo.fail({ code: 3 });
  await flush();
  assert.equal(env.geo.activeCount(), 1, "el watch sigue activo en error recuperable");
  assert.equal(env.elements["gps-state"].dataset.state, "warn");

  env.clock.now = 1000;
  env.geo.emit(position({ timestamp: 900, accuracy: 8 }));
  await flush();
  assert.equal(env.elements["gps-state"].dataset.state, "ok");

  const out = readExport(env);
  assert.equal(out.geolocation.state, "running");
  assert.equal(out.geolocation.samples, 1);
  assert.equal(out.geolocation.error_counts["3"], 1);
});

test("GPS: callback tardío tras detener no cambia la sesión", async () => {
  const env = createEnv();
  env.elements["gps-start"].click();
  const lateOk = env.geo.lastOk;
  const lateErr = env.geo.lastErr;
  env.elements["gps-stop"].click();

  lateOk(position({ timestamp: 5000, accuracy: 9 }));
  lateErr({ code: 3 });
  await flush();

  const out = readExport(env);
  assert.equal(out.geolocation.samples, 0);
  assert.equal(out.geolocation.state, "stopped");
});

test("GPS: callback tardío tras reset no contamina la sesión nueva", async () => {
  const env = createEnv();
  env.elements["gps-start"].click();
  const lateOk = env.geo.lastOk;
  env.elements["reset-btn"].click();

  lateOk(position({ timestamp: 7000, accuracy: 4 }));
  await flush();

  const out = readExport(env);
  assert.equal(out.geolocation.samples, 0);
  assert.equal(out.geolocation.state, "idle");
});

// ---- Wake Lock ----

test("Wake: dos clics concurrentes no crean adquisiciones duplicadas", async () => {
  const env = createEnv();
  env.elements["wake-on"].click();
  env.elements["wake-on"].click();
  assert.equal(env.wake.requestCount, 1);
  assert.equal(env.wake.pendingCount(), 1);

  env.wake.resolveNext(makeSentinel());
  await flush();
  const out = readExport(env);
  assert.equal(out.wake_lock.grants, 1);
  assert.equal(out.wake_lock.state, "active");
});

test("Wake: reset con adquisición pendiente libera el sentinel tardío sin activar", async () => {
  const env = createEnv();
  env.elements["wake-on"].click();
  env.elements["reset-btn"].click();

  const late = makeSentinel();
  env.wake.resolveNext(late);
  await flush();

  assert.equal(late.released, true);
  late.fireRelease();
  await flush();

  const out = readExport(env);
  assert.equal(out.wake_lock.grants, 0);
  assert.equal(out.wake_lock.state, "idle");
  assert.equal(out.wake_lock.system_releases, 0);
  assert.equal(env.elements["wake-state"].textContent, "Prueba sin iniciar");
});

test("Wake: liberar antes de resolver no activa ni cuenta liberación manual", async () => {
  const env = createEnv();
  env.elements["wake-on"].click();
  env.elements["wake-off"].click();

  const late = makeSentinel();
  env.wake.resolveNext(late);
  await flush();

  assert.equal(late.released, true);
  const out = readExport(env);
  assert.equal(out.wake_lock.grants, 0);
  assert.equal(out.wake_lock.manual_releases, 0);
  assert.equal(out.wake_lock.state, "idle");
});

test("Wake: readquiere al volver visible solo si el usuario quiere", async () => {
  const env = createEnv();
  env.elements["wake-on"].click();
  const s1 = makeSentinel();
  env.wake.resolveNext(s1);
  await flush();

  // El sistema libera el sentinel mientras la página está oculta.
  s1.fireRelease();
  await flush();

  env.document.visibilityState = "hidden";
  env.document.emit("visibilitychange");
  env.document.visibilityState = "visible";
  env.document.emit("visibilitychange");
  await flush();
  assert.equal(env.wake.requestCount, 2, "readquiere al volver visible con intención activa");

  const s2 = makeSentinel();
  env.wake.resolveNext(s2);
  await flush();

  env.elements["wake-off"].click();
  env.document.visibilityState = "hidden";
  env.document.emit("visibilitychange");
  env.document.visibilityState = "visible";
  env.document.emit("visibilitychange");
  await flush();
  assert.equal(env.wake.requestCount, 2, "no readquiere si el usuario liberó");
});

test("Wake: liberación del sistema se cuenta una vez y sentinel viejo no limpia el nuevo", async () => {
  const env = createEnv();
  env.elements["wake-on"].click();
  const s1 = makeSentinel();
  env.wake.resolveNext(s1);
  await flush();

  s1.fireRelease();
  await flush();
  let out = readExport(env);
  assert.equal(out.wake_lock.system_releases, 1);
  assert.equal(out.wake_lock.state, "released");

  env.document.visibilityState = "hidden";
  env.document.emit("visibilitychange");
  env.document.visibilityState = "visible";
  env.document.emit("visibilitychange");
  await flush();
  const s2 = makeSentinel();
  env.wake.resolveNext(s2);
  await flush();

  s1.fireRelease();
  await flush();
  out = readExport(env);
  assert.equal(out.wake_lock.system_releases, 1, "un sentinel obsoleto no altera contadores");

  s2.fireRelease();
  await flush();
  out = readExport(env);
  assert.equal(out.wake_lock.system_releases, 2);
  assert.equal(out.wake_lock.grants, 2);
});

test("Wake: liberación manual se cuenta una vez, sin doble conteo por evento release", async () => {
  const env = createEnv();
  env.elements["wake-on"].click();
  const s1 = makeSentinel();
  env.wake.resolveNext(s1);
  await flush();

  env.elements["wake-off"].click();
  s1.fireRelease();
  await flush();

  const out = readExport(env);
  assert.equal(out.wake_lock.manual_releases, 1);
  assert.equal(out.wake_lock.system_releases, 0);
  assert.equal(out.wake_lock.state, "idle");
});

test("Wake: una resolución obsoleta no libera la guardia pending de la sesión nueva", async () => {
  const env = createEnv();
  env.elements["wake-on"].click(); // solicitud A (queda pendiente)
  env.elements["reset-btn"].click(); // invalida A

  env.elements["wake-on"].click(); // solicitud B
  assert.equal(env.wake.requestCount, 2);

  const lateA = makeSentinel();
  env.wake.resolveNext(lateA); // resuelve A (obsoleta)
  await flush();
  assert.equal(lateA.released, true);

  env.elements["wake-on"].click(); // no debe crear una tercera solicitud
  assert.equal(env.wake.requestCount, 2, "la guardia pending sigue vigente");

  const sentinelB = makeSentinel();
  env.wake.resolveNext(sentinelB);
  await flush();

  const out = readExport(env);
  assert.equal(out.wake_lock.grants, 1);
  assert.equal(out.wake_lock.state, "active");
});

// ---- Exportación ----

test("Export: separa captura y recepción, agrega intervalos y no incluye datos sensibles", async () => {
  const env = createEnv();
  env.elements["gps-start"].click();

  env.clock.now = 100;
  env.geo.emit(position({ timestamp: 1000, accuracy: 10, speed: 1.5 }));
  env.clock.now = 200;
  env.geo.emit(position({ timestamp: 3000, accuracy: 6 }));
  env.clock.now = 400;
  env.geo.emit(position({ timestamp: 6000, accuracy: 4 }));
  await flush();

  const out = readExport(env);
  assert.equal(out.geolocation.samples, 3);
  assert.equal(out.geolocation.capture.first_at, 1000);
  assert.equal(out.geolocation.capture.last_at, 6000);
  assert.equal(out.geolocation.capture.span_ms, 5000);
  assert.equal(out.geolocation.reception.first_at, 100);
  assert.equal(out.geolocation.reception.last_at, 400);
  assert.equal(out.geolocation.reception.span_ms, 300);
  assert.equal(out.geolocation.capture_intervals_ms.count, 2);
  assert.equal(out.geolocation.capture_intervals_ms.min, 2000);
  assert.equal(out.geolocation.capture_intervals_ms.max, 3000);
  assert.equal(out.geolocation.reception_intervals_ms.count, 2);
  assert.equal(out.geolocation.reception_intervals_ms.min, 100);
  assert.equal(out.geolocation.reception_intervals_ms.max, 200);
  assert.equal(out.geolocation.speed_available, true);

  const text = JSON.stringify(out);
  for (const forbidden of ["latitude", "longitude", "altitude", "coords", "Safari/604"]) {
    assert.ok(!text.includes(forbidden), `la exportación no debe incluir «${forbidden}»`);
  }
  assert.ok(out.browser_hint.length > 0, "incluye pista de navegador acotada");
});

test("Export: limita el registro y cuenta muestras descartadas", async () => {
  const env = createEnv();
  env.elements["gps-start"].click();
  for (let i = 0; i < 125; i += 1) {
    env.clock.now = 100 + i;
    env.geo.emit(position({ timestamp: 1000 + i, accuracy: 5 }));
  }
  await flush();

  const out = readExport(env);
  assert.equal(out.geolocation.samples, 125);
  assert.equal(out.geolocation.samples_log.length, 120);
  assert.equal(out.geolocation.dropped_samples, 5);
});

// ---- Interfaz sin APIs ----

test("Interfaz sin APIs: marca ausencia y no falla al pulsar", async () => {
  const env = createEnv({ geolocation: false, wakeLock: false, bluetooth: false });
  assert.equal(env.elements["api-geolocation"].textContent, "API ausente");
  assert.equal(env.elements["api-bluetooth"].textContent, "API ausente");
  assert.equal(env.elements["api-wakeLock"].textContent, "API ausente");

  env.elements["gps-start"].click();
  assert.equal(env.elements["gps-state"].textContent, "Geolocation no disponible");
  env.elements["wake-on"].click();
  assert.equal(env.elements["wake-state"].textContent, "Wake Lock no disponible");
});

// ---- Estructura ----

test("Estructura: recursos, ids y workflow de carpeta única", () => {
  assert.match(HTML_SRC, /href="styles\.css"/);
  assert.match(HTML_SRC, /src="app\.js"/);
  for (const id of IDS) assert.ok(HTML_SRC.includes(`id="${id}"`), `falta id="${id}" en index.html`);

  assert.match(WORKFLOW_SRC, /path: experiments\/iphone-capability-probe\n/);
  assert.ok(!/path: \./.test(WORKFLOW_SRC), "no debe publicar la raíz del repositorio");
  assert.ok(!/pull_request/.test(WORKFLOW_SRC), "no debe desplegar desde pull_request");
  assert.match(WORKFLOW_SRC, /pages: write/);
  assert.match(WORKFLOW_SRC, /id-token: write/);
  assert.match(WORKFLOW_SRC, /name: github-pages/);

  const guards = WORKFLOW_SRC.match(/if: github\.ref == 'refs\/heads\/main'/g) || [];
  assert.equal(guards.length, 2, "build y deploy deben exigir github.ref == refs/heads/main");
});
