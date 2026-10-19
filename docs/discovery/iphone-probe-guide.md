# Guía de la sonda de capacidades iPhone — GC-004

Fecha: 2026-10-19. Estado: **publicada, sin ejecutar**. Esta sonda es la que aporta
evidencia a GC-004 (y solo disponibilidad web a GC-003). No cierra ninguna issue por sí sola.

Carpeta publicada: [`experiments/iphone-capability-probe/`](../../experiments/iphone-capability-probe/),
que es la **raíz del artefacto** desplegado.

## 0. Estado del despliegue

- URL HTTPS verificada: <https://alearra.github.io/ground-control-scooter/>
- Integración: PR #63 (squash `80db320`) en `main`; deploy `github-pages` con `environment_url` el anterior.
- Run: [actions/runs/39308518283](https://github.com/alearra/ground-control-scooter/actions/runs/39308518283) (build y deploy en `success`).
- Comprobado por HTTP: `/`, `/app.js` y `/styles.css` responden 200; HTTPS forzado (301 desde `http://`); `/docs/…`, `/prompts/…` y las pruebas responden 404 (solo se publica la carpeta de la sonda).
- La prueba física en el iPhone 11 sigue **pendiente**; no se declara ninguna capacidad.

## 1. Publicar por HTTPS

La sonda necesita un **contexto seguro (HTTPS)**. Abrirla con `http://` sobre una IP
local no sirve: el navegador no expone Geolocation ni Wake Lock en contexto inseguro.
No se desactiva la seguridad del navegador para probar.

La publicación se acota a esta carpeta con [`.github/workflows/pages.yml`](../../.github/workflows/pages.yml):

1. Integrar el PR de la sonda en `main` (revisión del AI PM) y habilitar Pages con
   *Source: GitHub Actions* en Settings → Pages.
2. El workflow empaqueta **solo** `experiments/iphone-capability-probe` con
   `actions/upload-pages-artifact` y despliega con `actions/deploy-pages`. No publica la
   raíz del repositorio, `docs` ni archivos de pruebas.
3. El workflow corre **solo** con push a `main` o ejecución manual sobre `main`; los jobs
   `build` y `deploy` exigen además `github.ref == 'refs/heads/main'`, así que un `workflow_dispatch`
   sobre otra rama no publica. Nunca despliega código de un PR.
4. La URL real es la salida `page_url` del paso de despliegue. **No se inventa** ni se
   asume una ruta `/experiments`: como esa carpeta es la raíz del artefacto, la URL es la
   del sitio publicado, sin subruta.
5. Anotar la URL observada y la fecha en la evidencia.

> Pages quedó activado con *Source: GitHub Actions* (`build_type: workflow`) y el sitio ya
> desplegado; ver la sección 0 para la URL y el run.

## 2. Protocolo de prueba

Prueba condiciones **por separado**, en este orden, con el scooter **detenido**. Cada caso
guía es de ~30 s; el caso de primer plano, de ~60 s. Son instrucciones, no resultados ya obtenidos.

1. **Contexto**: confirmar «Contexto seguro (HTTPS)» = *Sí*. Si no, detener: la prueba no es válida.
2. **Detección de APIs**: anotar el estado de las tres APIs (presente/ausente).
3. **Primer plano (60 s)**: *Iniciar GPS*, conceder permiso y dejar correr sin salir de la app. Observar muestras, precisión y antigüedad.
4. **Cambio a otra app (30 s)**: con GPS activo, cambiar de app ~30 s y volver. Anotar los eventos de visibilidad y si llegaron muestras al volver.
5. **Bloqueo de pantalla (30 s)**: activar la pantalla activa, bloquear el teléfono ~30 s y desbloquear. Anotar el estado del Wake Lock y los eventos.
6. **Exportar**: *Exportar JSON sanitizado* y compartir ese archivo, no capturas con datos personales.

## 3. Cómo leer los resultados

- **API presente** no significa que la función esté concedida: el permiso o el sistema pueden denegarla.
- **API ausente** es un resultado válido y suficiente; no se instalan polyfills ni extensiones.
- La **pista de navegador** no confirma la versión exacta de Safari/iOS. La versión declarada
  (iOS 27.0.1) se mantiene como *declarada, sin verificar*.
- El export separa **captura** (`position.timestamp`) de **recepción** (`Date.now`) y agrega
  intervalos. Un **hueco** en la entrega de muestras, por sí solo, **no** demuestra que la
  página estuviera suspendida ni que dejara de capturarse: solo muestra un intervalo de entregas
  observadas. La evidencia permite describir entregas e intervalos; **no** promete captura en
  segundo plano.
- **Velocidad** puede ser nula o no informada; se registra como «No disponible», nunca como cero.
- **Wake Lock** mantiene la pantalla encendida mientras la página está visible; **no** garantiza
  ejecución con la pantalla bloqueada.

## 4. Evidencia y sanitización

El JSON exportado contiene solo: presencia de APIs, códigos de error, contadores, precisión
agregada, tiempos de captura/recepción (primer/último, intervalos agregados), visibilidad
asociada al registro acotado de muestras y eventos. **No** incluye coordenadas, rutas, altitud,
user agent completo ni identificadores del scooter. Antes de adjuntar capturas, recortar la barra
de estado y cualquier dato personal.

## 5. Verificación en local (simulación)

El harness con `node:vm` valida estados, concurrencia y exportación con APIs falsas:

```sh
node --check experiments/iphone-capability-probe/app.js
node --test experiments/iphone-capability-probe-tests/probe.test.mjs
```

Es **simulación**, no prueba de Safari ni del iPhone. La prueba física sigue pendiente.

## 6. Criterios para cerrar GC-004

- [ ] URL HTTPS observada (salida del deploy) y fecha registradas.
- [ ] Resultado observado por API (Geolocation, Bluetooth, Wake Lock).
- [ ] Resultado del caso de primer plano (muestras y precisión).
- [ ] Resultado del cambio a otra app (eventos y si llegaron muestras al volver).
- [ ] Resultado del bloqueo de pantalla (estado del Wake Lock y eventos).
- [ ] JSON sanitizado adjunto en la issue.
- [ ] Revisión del AI PM antes de marcar Done.

Cualquier capacidad sin evidencia queda como **Desconocido** en la
[matriz de capacidades](capability-matrix.md).
