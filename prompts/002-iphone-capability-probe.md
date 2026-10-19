# F0 — integrar inventario y preparar sonda de capacidades iPhone

Ejecuta esta tarea en OpenCode + Big Pickle. Está autorizado avanzar; no pidas confirmación para lecturas, cambios reversibles, resolver conflictos documentales o las comprobaciones descritas. Cursor sólo si hace falta y se documenta la causa.

Objetivo: dejar una sonda pequeña que Alejandro pueda abrir por HTTPS en el iPhone 11 para observar GPS, APIs y comportamiento de pantalla. No crear todavía el cockpit ni elegir stack final. Trabajo principal: GC-004; GC-003 sólo recibe evidencia de disponibilidad web, no lectura del scooter.

## 1. Recuperar e integrar el inventario

Lee AGENTS.md, docs/current-status.md, PR #62 actualizado y sus archivos de discovery. git fetch primero; conserva cambios ajenos. Datos canónicos declarados: Apple iPhone 11, iOS 27.0.1 (no verificado independientemente), Safari (versión exacta pendiente), soporte existente y orientación vertical, Xiaomi Home V11.8.204 / Argentina, Xiaomi 6 Ultra, código DDHBC01xb, firmware 2.7.1_0112.0066. No incluir serie, MAC ni cuenta.

El AI PM revisó el inventario y autoriza integrar su documentación si la revisión final no muestra problemas. PR #62 aparecía con mergeable=false en la última consulta: comprueba el estado real y resuelve conflictos sobre docs/device-discovery incorporando main, sin force push. Fusiona semánticamente current-status: conserva hechos actuales, datos recibidos y pendientes; no uses ours/theirs para reemplazar archivos enteros. Revisa el diff completo y ausencia de identificadores privados. Actualiza la descripción del PR para dejar de pedir datos ya recibidos.

Si queda limpio, haz squash merge #62 y sincroniza main. Si ya se integró, no repitas. Si aparece un conflicto de código inesperado, informa el bloqueo. No cierres issues de hardware por integrar documentos. GC-002 tiene datos mínimos declarados suficientes para revisión documental; su integración no prueba BLE. GC-001 conserva versión de navegador pendiente. El AI PM revisará cierres con la evidencia.

## 2. Crear sólo la sonda temporal

Nueva rama feature/f0-iphone-capability-probe desde main actualizado. Archivos en experiments/iphone-capability-probe/ y guía corta en docs/discovery/iphone-probe-guide.md. HTML/CSS/JavaScript vanilla sin framework ni dependencias es una excepción acotada al experimento; documentarla en su README. No determina el stack final ni crea una app de producción.

Pantalla en español, vertical, controles grandes y sin mapas/servicios externos. Mostrar contexto seguro, fecha de prueba y detección de geolocation, navigator.bluetooth y wakeLock. Diferenciar «API presente», «permiso denegado», «prueba sin iniciar», «error» y «resultado observado». Mostrar user agent sólo como pista: no afirmar versión exacta de Safari/iOS a partir de él. No cambiar el iOS declarado por una versión inferida.

Bluetooth: detectar presencia de API solamente. No solicitar emparejamiento ni leer/escribir servicios GATT, no pedir claves, no instalar polyfills, browsers o extensiones. Ausencia de API es un resultado válido y no diagnostica el hardware del scooter.

GPS: botón iniciar/parar watchPosition con consentimiento al tocar; limpiar watch y recursos al parar/salir. Mostrar localmente precisión, antigüedad de última muestra y velocidad si existe. No mostrar ni almacenar coordenadas, rutas o altitud. Si speed es null, mostrar no disponible; no convertirlo a cero ni derivar velocidades de muestras ruidosas. Mantener sólo contadores y tiempos necesarios en memoria.

Wake lock: botón activar/liberar si existe; gestionar rechazo, release y visibilitychange sin bucles de reintento. Sólo readquirir cuando la página vuelva a visible y el usuario haya dejado activa esa función. Mostrar que no equivale a ejecución garantizada con pantalla bloqueada.

Registrar eventos de visibilidad/pagehide/pageshow y timestamps en memoria. Tras volver de segundo plano, distinguir la pausa de ejecución JavaScript del intervalo entre timestamps GPS; no concluir que hubo captura continua sólo porque apareció una muestra al regresar.

## 3. Ensayo y privacidad

Preparar pruebas manuales en el teléfono, sin ejecutarlas ficticiamente: primer plano durante 60 segundos; otra app durante 30 segundos y regreso; bloqueo de pantalla durante 30 segundos y regreso; activar/liberar wake lock y repetir retorno. Pruebas detenido o caminando, sin manipular pantalla mientras conduce.

Informe JSON sanitizado por acción explícita: sólo presencia de APIs, errores/códigos, contadores, precisión agregada, intervalos y estados. Sin coordenadas, trayectos, user agent completo ni identificadores del scooter. No red, analítica, envío automático, almacenamiento persistente ni publicación de resultados del teléfono. Reiniciar borra sesión en memoria. No crear service worker por ahora: primero medir Safari en primer plano, luego evaluar instalación PWA por separado.

Documentar cómo abrir por HTTPS. HTTP sobre la IP local de la computadora no es suficiente para APIs de contexto seguro en el iPhone; no proponer desactivar seguridad del navegador.

## 4. Comprobaciones y entrega

Verifica sintaxis, controles y recursos localmente. Usa herramientas de navegador ya disponibles si las hay; no instales un stack de testing pesado sólo para la sonda. Comprueba que no hay peticiones de red/telemetría, coordenadas en la exportación ni errores al faltar APIs. Distingue escritorio de iPhone real. No cierres GC-003/004 sin pruebas físicas.

Abre PR vinculado a #4/GC-004 con diff, comandos/resultados y pasos para revisar. Incluye instrucciones o un workflow acotado para publicar únicamente esta carpeta en GitHub Pages por HTTPS después de revisar/integrar ese PR; no habilites servicios pagos ni cambies políticas de seguridad. Si hay ya un hosting/preview HTTPS apto, reutilízalo sin exponer información privada. No inventes URL ni afirmes despliegue si no se realizó.

No hagas merge automático del nuevo PR de código experimental: entregar para revisión del AI PM. La integración de #62 documental sí está autorizada arriba.

## 5. Investigación y handoff

Consulta fuentes primarias vigentes:
- https://github.com/mdn/browser-compat-data/blob/main/api/Navigator.json (bluetooth: Safari no soportado; Safari iOS hereda esa entrada en la consulta del AI PM).
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API
- https://developer.chrome.com/docs/capabilities/bluetooth
- https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition
- https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API

La disponibilidad de API del teléfono, la autenticación Xiaomi y la lectura correcta de propiedades del 6 Ultra son problemas distintos. Cambiar de navegador en iPhone no se presume solución BLE. No implementar puente nativo todavía ni copiar código con licencia no comercial.

Salida: resultado primero y hasta cinco puntos: PR/commit, qué prueba la sonda, verificaciones ejecutadas, bloqueos reales y una siguiente acción. El resultado esperado de esta sesión es una sonda revisable; no una integración Xiaomi completada ni arquitectura cerrada.
