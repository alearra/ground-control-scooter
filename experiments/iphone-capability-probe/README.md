# Sonda de capacidades iPhone (F0 · GC-004)

Experimento temporal para que Alejandro abra esta carpeta por HTTPS en el iPhone 11
y observe capacidades básicas del navegador. **No es el cockpit** ni la app de
producción, y no forma parte del stack final.

## Qué mide

- Contexto: HTTPS, origen, fecha de apertura y pista de navegador (sin afirmar versión de iOS/Safari).
- Detección de APIs: `navigator.geolocation`, `navigator.bluetooth`, `navigator.wakeLock`.
- GPS en primer plano: muestras, precisión (mín/media/máx) y antigüedad de la última muestra.
- Pantalla activa: solicitud y liberación de Wake Lock.
- Retorno desde segundo plano: eventos `visibilitychange`, `pagehide` y `pageshow` con marcas de tiempo.

La exportación separa **tiempo de captura** (`position.timestamp`) de **tiempo de recepción** (`Date.now`)
y conserva intervalos agregados, para observar entregas sin confundir el intervalo de callbacks con el
de captura. El registro de muestras está acotado y cuenta las descartadas.

## Qué **no** hace

- No lee el scooter, no empareja Bluetooth y no pide claves.
- No muestra ni guarda coordenadas, rutas, altitud ni velocidad puntual como control.
- No envía datos a ninguna red y no usa analítica.
- No usa `localStorage` ni almacenamiento persistente.
- No registra un service worker.
- No afirma soporte del Xiaomi 6 Ultra.

## Excepción documentada

HTML, CSS y JavaScript vanilla, sin framework ni dependencias. La sonda es un
experimento de un solo uso; el stack de la aplicación se decide en F0 con la
evidencia que produzca esta sonda. La excepción se registra aquí y no obliga al
stack final.

## Cómo verificar en local

Sintaxis y ausencia de red desde el cliente:

```sh
node --check experiments/iphone-capability-probe/app.js
grep -nE "fetch\(|XMLHttpRequest|WebSocket|EventSource|https?://" \
  experiments/iphone-capability-probe/*.js experiments/iphone-capability-probe/*.html
```

Harness de simulación (DOM y APIs falsos con `node:vm`, sin dependencias). **No** es una
prueba de Safari ni del iPhone; solo valida lógica de estados, concurrencia y exportación:

```sh
node --test experiments/iphone-capability-probe-tests/probe.test.mjs
```

Guía de apertura y protocolo de prueba: [`docs/discovery/iphone-probe-guide.md`](../../docs/discovery/iphone-probe-guide.md).
Publicación por GitHub Pages: [`.github/workflows/pages.yml`](../../.github/workflows/pages.yml), que empaqueta
únicamente esta carpeta como raíz del artefacto.
