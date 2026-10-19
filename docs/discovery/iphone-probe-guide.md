# Guía de la sonda de capacidades iPhone — GC-004

Fecha: 2026-10-19. Estado: **preparada, sin ejecutar**. Esta sonda es la que aporta
evidencia a GC-004 (y solo disponibilidad web a GC-003). No cierra ninguna issue por sí sola.

Carpeta: [`experiments/iphone-capability-probe/`](../../experiments/iphone-capability-probe/).

## 1. Publicar por HTTPS

La sonda necesita un **contexto seguro (HTTPS)**. Abrirla con `http://` sobre una IP
local no sirve: el navegador no expone Geolocation ni Wake Lock en contexto inseguro.
No se debe desactivar la seguridad del navegador para probar.

Opción recomendada (sin servicios pagos): publicar **solo esta carpeta** con GitHub Pages.

1. Integrar primero el PR de la sonda en `main` (revisión del AI PM).
2. En GitHub → *Settings* → *Pages*, elegir la rama `main` y, si la interfaz lo permite,
   la carpeta `/experiments/iphone-capability-probe` como raíz de publicación.
3. Si Pages no admite una subcarpeta como raíz, publicar desde la raíz del repositorio y
   abrir la URL completa de la carpeta.
4. Abrir en el iPhone 11 la URL `https://<usuario>.github.io/<repo>/experiments/iphone-capability-probe/`.
5. Anotar la URL usada y la fecha en la evidencia.

> Pages es una decisión de infraestructura; habilitarlo requiere revisión del AI PM.
> Alternativa sin publicar: servidor HTTPS local con certificado de desarrollo, solo si
> Alejandro lo pide expresamente.

## 2. Protocolo de prueba

Ejecutar en el orden indicado, con el scooter **detenido** y sin manipularlo durante la prueba.

1. **Contexto**: confirmar que «Contexto seguro (HTTPS)» muestra *Sí*. Si no, no seguir: la prueba no es válida.
2. **Detección de APIs**: anotar el estado de las tres APIs (presente/ausente).
3. **GPS**: pulsar *Iniciar GPS*, conceder el permiso y dejar correr 30–60 s. Observar muestras, precisión y antigüedad.
4. **Pantalla activa**: pulsar *Activar pantalla activa* y comprobar que la pantalla no se apaga sola.
5. **Segundo plano**: cambiar de app o bloquear la pantalla ~30 s y volver. Observar la lista de eventos y la antigüedad de la última muestra GPS.
6. **Exportar**: pulsar *Exportar JSON sanitizado* y compartir ese archivo, no capturas con datos personales.

## 3. Cómo leer los resultados

- **API presente** no significa que la función esté concedida: el permiso o el sistema pueden denegarla.
- **API ausente** es un resultado válido y suficiente; no se instalan polyfills ni extensiones.
- La **pista de navegador** no confirma la versión exacta de Safari/iOS. La versión declarada
  (iOS 27.0.1) se mantiene como *declarada, sin verificar*.
- Un **intervalo grande** entre muestras GPS después de volver de segundo plano no implica
  captura continua: solo indica que la página estuvo pausada.
- **Velocidad** puede ser nula o no informada; se registra como «No disponible», nunca como cero.
- **Wake Lock** mantiene la pantalla encendida mientras la página está visible; **no** garantiza
  ejecución con la pantalla bloqueada.

## 4. Evidencia y sanitización

El JSON exportado contiene solo: presencia de APIs, códigos de error, contadores, precisión
agregada y tiempos. **No** incluye coordenadas, rutas, user agent completo ni identificadores
del scooter. Antes de adjuntar cualquier captura, recortar la barra de estado y cualquier dato personal.

## 5. Criterios para cerrar GC-004

- [ ] URL HTTPS usada y fecha registradas.
- [ ] Resultado observado por API (Geolocation, Bluetooth, Wake Lock).
- [ ] Resultado de GPS en primer plano (muestras y precisión).
- [ ] Resultado de pantalla activa (concedido / denegado / liberado).
- [ ] Resultado del retorno desde segundo plano (eventos y si el reloj de GPS se detuvo).
- [ ] JSON sanitizado adjunto en la issue.
- [ ] Revisión del AI PM antes de marcar Done.

Cualquier capacidad sin evidencia queda como **Desconocido** en la
[matriz de capacidades](capability-matrix.md).
