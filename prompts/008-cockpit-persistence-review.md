# PR #68 — corregir persistencia de instrumentos y alcance de evidencia

Ejecutar en OpenCode + Big Pickle. Una tarea: resolver revisión AI PM del head 185d18c5d428f2604fa4e8c847514f02dc92e998 en el PR #68 existente. Sin merge ni deploy.

## 1. Sincronizar
Lee AGENTS.md, prompt 007, docs/current-status.md y el informe de jerarquía vertical. Recupera los commits documentales remotos de feature/cockpit-vertical-hierarchy por fast-forward y conserva trabajo ajeno. No force push, PR nuevo ni cambios al #64.

## 2. Corregir el hallazgo de código
En cockpit.tsx, VehicleArea continúa dentro de main con overflow-y-auto. El comentario y el informe afirman lo contrario. Las capturas iniciales muestran visibilidad en reposo, pero esa estructura permite desplazar los instrumentos cuando main desborda.
Saca VehicleArea de la región desplazable y colócala antes de la región flexible mapa/panel, conservando la semántica de main si prefieres otra composición equivalente. Asegura que instrumentos y barra no se encogen de forma que corten contenido en los tamaños objetivo. Desplaza sólo los detalles cuando falta espacio; evita offsets derivados de alturas supuestas. No eliminar overflow sin garantizar acceso al contenido ni recortar silenciosamente el panel.
Mantén los cuatro accesos, cierre, Escape, retorno de foco, datos vacíos y separación app/diagnóstico. No rediseñar otros módulos ni añadir dependencias.

## 3. Comprobar la causa y los límites
Repetir comprobación interactiva de cerrado y cuatro paneles a las dos alturas objetivo. Añadir un caso que fuerce desbordamiento y desplazamiento de la región mapa/panel: comparar el rectángulo de velocidad/resumen de avisos antes/después del scroll, también tras enfocar/cambiar/cerrar panel. No basta con comprobar el rectángulo inicial o la mera existencia del elemento.
Probar ampliación de texto/zoom al 200 % con la herramienta disponible, anotando el mecanismo efectivo; priorizar acceso íntegro con desplazamiento en condiciones extraordinarias antes que imponer «siempre visible a cualquier tamaño». No desactivar zoom. Verificar que detalles finales son alcanzables con teclado/desplazamiento y el cierre sigue accesible.
La constricción del documento a 390 CSS px no es un viewport de 390: registrar window.innerWidth, innerHeight, documentElement.clientWidth y ancho efectivo del contenedor usado, además del método de captura/recorte. No llamar «reales» a 390×844/660 si sólo la altura era de viewport. Si el navegador no permite ancho exacto, documentar la limitación y validar el ancho de documento como evidencia parcial, sin bloquearse ni pedir Safari/otra prueba a Alejandro ahora. Las media queries y las unidades de viewport no quedan acreditadas por recortar una captura.
Ejecutar TypeScript/Biome/build y la sonda como regresión pertinente tras el cambio de código; no reinstalar dependencias sin necesidad ni crear suites que copien markup. Conservar el procedimiento/harness mínimo reproducible de scroll/foco y sus dimensiones si ya existe; sin nuevas herramientas pesadas.

## 4. Reconciliar evidencia y documentación
Actualizar comentarios, cockpit-experience.md, current-status e informe para describir la composición real y el alcance de las pruebas. Conservar 102/102 como resultado histórico reportado, no presentarlo como ejecución nueva ni validación física. Actualizar las capturas afectadas y resumir medidas antes/después del scroll; sin datos personales.
En el cuerpo del PR corregir el alcance de «390×844/660» y enlazar el informe actualizado. No inventar Safari físico, legibilidad al sol, zoom o pruebas que no se pudieron ejecutar.
Sin sensores, GPS/Bluetooth/wake lock activos, almacenamiento, backend, servicios, cambios de dependencias o Pages.

## 5. Entregar
Actualizar PR #68 y Evidence de GC-010/#8 si hay acceso al Project; mantener Review y la issue abierta. #13 sigue In progress. No modificar el resto ni cerrar F1. Entregar hasta cinco puntos: head, corrección de composición, pruebas reales/dimensiones, capturas/límites y siguiente acción única = revisión AI PM. No merge ni deploy.
