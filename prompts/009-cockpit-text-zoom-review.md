# PR #68 — legibilidad y acceso al ampliar texto

OpenCode + Big Pickle. Resolver únicamente el caso de texto ampliado del PR #68; la persistencia normal está corregida y se acepta. Head revisado: abcd78f8bb7b017ad44b602ede715635f081c821. Sin merge/deploy ni nuevas funciones.

## 1. Recuperar revisión
Sincroniza feature/cockpit-vertical-hierarchy por fast-forward conservando trabajo ajeno. Lee AGENTS.md, prompt 008 e informe de jerarquía vertical. Reutiliza PR #68 y GC-010/#8; no crear otro PR ni cerrar issues.

## 2. Corregir el caso demostrado
La captura zoom200-panel-vehiculo.png muestra los cuatro textos de navegación superpuestos en la barra. El ancho mínimo de 44px por control no garantiza que quepa su etiqueta. Permite envolver etiquetas, adapta distribución/altura según el contenido o una solución equivalente manteniendo nombres completos, áreas táctiles y cuatro accesos identificables. No ocultar etiquetas sólo por falta de espacio, no achicar texto para anular la ampliación, ni truncar nombres hasta hacerlos ambiguos.
El informe declara vehículo hasta y=520, barra desde y=552 y Cerrar entre y=492 y 580: no acredita un cierre completamente visible y libre de solapamiento. Verifica acceso real a cierre y detalles.
Mantén instrumentos persistentes a tamaño normal en las dos alturas objetivo y el scroll forzado ya validado. Con texto al 200%, si los elementos persistentes agotan el alto, usa una degradación explícita con desplazamiento de página/contenido que permita alcanzar todos los controles y detalles. No mantener a la fuerza un main sin espacio útil ni prometer instrumentos fijos en cualquier altura/zoom. El criterio extraordinario es contenido y controles alcanzables sin solapamiento, no todo visible a la vez.
Sin sensores, datos reales/demo, servicios, dependencias o cambios de Pages.

## 3. Validar el comportamiento, no sólo rectángulos
En documento de 390 CSS px, alturas de viewport 844/660: cerrado y cada panel a tamaño normal; conserva foco/Escape/retorno y persistencia tras scroll.
Al 200% con mecanismo documentado: comprobar etiquetas que no se superponen entre sí ni invaden otro botón, barra y cierre accionables con teclado/puntero, detalles completos alcanzables al desplazar. Detectar intersecciones/clipping y accesibilidad efectiva: que un bounding rect exista o el foco se asigne no implica visibilidad/uso. Si hay que desplazar para alcanzar un control, verificarlo en la posición de interacción.
Capturar al menos navegación al 200% sin superposición y panel Vehículo realmente abierto al 200%, con cierre y último detalle alcanzables (capturas separadas si requieren distinta posición de scroll). No presentar una captura con panel cerrado como evidencia del panel abierto.
Registrar innerWidth/innerHeight/clientWidth y ancho constreñido. Seguir diferenciando escala rem de zoom nativo y Safari físico. Mantener los 91 checks como históricos del head abcd78f; describir comprobaciones nuevas y límites sin convertirlas en validación física.
Typecheck, Biome, build y verificaciones interactivas pertinentes al cambio; repetir sonda sólo si se toca o surge una regresión justificada. Sin instalar frameworks adicionales.

## 4. Documentar
Actualizar informe/current-status con el hallazgo visible y resolución, más capturas nuevas sintéticas sin datos privados. Separar criterios a tamaño normal de comportamiento accesible al 200%. Reconciliar el cuerpo del PR. No afirmar «ningún elemento excede contenedor» como equivalente a ausencia de superposición.

## 5. Entregar
Mantener GC-010 Review con Evidence de head real; #8/#13 abiertas y #13 In progress. Hasta cinco puntos: head, cambio, pruebas/dimensiones, capturas/límites, siguiente acción = revisión AI PM. No merge ni deploy ni otra fase.
