# Corregir PR #63 antes de publicar la sonda

Ejecuta en OpenCode + Big Pickle. Objetivo único: corregir y verificar el PR #63; no construir cockpit, puente nativo o app final. Ya está autorizado el trabajo reversible descrito; no pidas otra confirmación para empezar.

## 1. Sincronización

git fetch y revisión de árbol local antes de cambiar de rama. Trabaja sobre feature/f0-iphone-capability-probe e incorpora los commits remotos del AI PM sin descartar cambios. Lee AGENTS.md, docs/reviews/2026-10-19-iphone-probe.md y el diff de #63. Conserva el PR existente. No force push ni nuevas issues.

## 2. Corregir estados y concurrencia

En app.js:
- Separar limpieza de watch/timer GPS de la decisión del estado final. onGeoError(code=1) debe conservar denied en UI y JSON; timeout/unavailable deben ser observables. Una muestra válida después de error recuperable restablece running. Tras detener/reset no aceptar callbacks obsoletos.
- Unificar adquisición Wake Lock normal y por retorno. Evitar solicitudes duplicadas con estado pending. Identificar cada sesión/intención con token o generación; si se reinicia/libera mientras una promesa está pendiente, liberar el sentinel que llegue tarde sin activarlo ni alterar sesión nueva.
- Los listeners release validan identidad del sentinel antes de limpiar el actual; registrar liberaciones del sistema y manuales sin doble contar. Tras reset, ningún callback de una sesión anterior modifica estado/contadores/eventos actuales.
- No bloquear manualmente la pantalla ni solicitar Bluetooth: la sonda detecta presencia de la API únicamente.

## 3. Evidencia de tiempos

Guardar en memoria, de forma acotada, tiempos de captura (position.timestamp válido) y recepción (Date.now), intervalos y visibilidad asociada. Exportar sólo metadata sanitizada; nunca coordenadas, rutas, altitud, identificadores o UA completo. Limitar tamaño con contador de muestras descartadas si hace falta. No afirmar que el intervalo de callbacks es el intervalo de captura. Corregir guía: un hueco GPS por sí solo no prueba suspensión de la página ni falta de captura; la evidencia permite observar entregas e intervalos, sin prometer segundo plano.

Separar pruebas de primer plano, cambio a otra app y bloqueo de pantalla en el protocolo. Mantener casos 60s primer plano y 30s por condición como guía, no como resultados ejecutados.

## 4. Pages y verificaciones

Reemplazar el fallback de publicar raíz: únicamente se publicará experiments/iphone-capability-probe. Añadir un workflow GitHub Pages con upload-pages-artifact cuyo path sea exactamente esa carpeta, sin repo raíz, docs, exports ni archivos de pruebas. Elegir versiones vigentes de acciones consultando docs oficiales, permisos mínimos pages/write e id-token/write sólo donde corresponde, contents/read, environment github-pages y concurrencia. Desplegar sólo desde main o dispatch sobre main; nunca código de PR con permisos de deployment. No cambiar políticas de protección ni conceder nuevos scopes automáticamente.

Fuentes: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages y https://github.com/actions/upload-pages-artifact. Documentar URL como output real del deploy, sin inventarla y sin asumir ruta /experiments cuando esa carpeta es raíz del artefacto. No activar ni desplegar todavía: primero devolver el PR corregido para revisar.

Verificaciones acotadas con Node/herramientas existentes, sin framework nuevo:
1. Permiso GPS denegado conserva denied; error recuperable seguido de posición vuelve a running; callback tardío tras parar/reset no cambia sesión.
2. Wake request pendiente seguido de reset/liberar: resolución tardía se libera y no activa pantalla ni contamina contadores. Dos clics o eventos concurrentes no crean adquisiciones duplicadas.
3. Retorno readquiere sólo si el usuario quiere; liberación del sistema se cuenta una vez; callbacks anteriores no limpian un sentinel nuevo.
4. Exportación registra intervalos sintéticos conocidos y separa captura/recepción, sin datos sensibles; límites de tamaño funcionan.
5. Sintaxis, IDs/recursos, interfaz sin APIs, sin red desde el cliente y workflow con artefacto de carpeta única.

Reportar comandos y resultados reales. Si no hay navegador local disponible, usar un harness VM con DOM/APIs falsos y decir que es simulación; no afirmar prueba Safari/iPhone. Ningún test simula soporte real Xiaomi.

## 5. Entrega

Actualizar README de experimento, guía y current-status para reflejar correcciones, revisión pendiente y prueba física pendiente. Actualizar PR #63 con hallazgos resueltos y pruebas. Mantener GC-003/004 abiertas y estados del Project fieles a evidencia. No marcar Done por sintaxis aprobada.

No mergear ni publicar aún. Devolver hasta cinco puntos: PR/commit, correcciones, pruebas, pendientes y una siguiente acción: revisión AI PM. No solicitar al usuario datos del inventario que ya están registrados.
