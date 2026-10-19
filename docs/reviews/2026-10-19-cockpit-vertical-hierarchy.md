# Revisión — Jerarquía vertical del cockpit (incremento F1, GC-010/#8)

Fecha: 2026-10-19. Autor: OpenCode + Big Pickle. Estado: **entregado para revisión AI PM (PR #68)**. Sin merge ni deploy.

Alcance: incremento **parcial** de GC-010/#8 definido en [prompt 007](../../prompts/007-cockpit-vertical-hierarchy.md). Compacta el contenido provisional, mueve diagnósticos técnicos a detalles y valida que los instrumentos esenciales y la barra de accesos sigan visibles al abrir paneles en vertical. **No** cierra F1, GC-010 ni los flujos de Hangar/misiones/debrief.

Base: `main` en `040a45f` (define el prompt). Rama: `feature/cockpit-vertical-hierarchy`. Sin cambios de versiones de dependencias.

## Decisiones de jerarquía

1. **Instrumentos persistentes fuera del área desplazable.** La barra superior y el área del vehículo quedan fuera de `main`; la barra de accesos también. Un panel abierto no puede empujarlos fuera de vista.
2. **Área del vehículo = instrumento, no bloque decorativo.** Se retiró el bloque ilustrativo del scooter (desplazaba instrumentos y mapa). Quedan: velocidad dominante (`—` + `km/h` + «Sin lectura», nunca `0`), batería secundaria («Sin registrar») y un resumen de avisos reconocible que separa «Avisos de app» de «Diagnóstico».
3. **Barra superior compacta en lenguaje de usuario.** Hora + conectividad breve («En línea (navegador)» / «Sin conexión (navegador)» / «Sin comprobar»). El inventario de APIs y sus explicaciones salieron de la vista de conducción.
4. **«Estado del sistema» dentro del panel Aplicaciones.** Reúne Geolocation, Bluetooth y Wake Lock con la distinción **API presente / API ausente / sin comprobar**, la función marcada como **inactiva**, y la aclaración de que presencia de API ≠ permiso, conexión real ni pantalla bloqueada activa, y que la conectividad es lo *informado* por el navegador.
5. **Región flexible mapa/panel con desplazamiento propio.** El mapa conserva espacio reconocible cuando no hay panel («Sin ruta» + «Mapa sin configurar», sin textos de proveedor/GC). Con panel abierto el mapa se reduce a una franja discreta y el detalle se desplaza **dentro de su región**; al enfocar «Cerrar» no se desplazan fuera de vista los instrumentos.
6. **Área táctil ≥44×44 CSS px** en los cuatro accesos (medido: 91×44 cada uno). Panel no modal: foco a «Cerrar» al abrir, Escape cierra, cambio entre accesos y devolución de foco al acceso que lo abrió.
7. **Vehículo con tres magnitudes diferenciadas** en su panel: «Porcentaje de batería» (Sin registrar), «Autonomía estimada» (Datos insuficientes) y «Predicción del viaje» (Datos insuficientes), sin combinarlas en un único indicador. Aviso de app («sin avisos») separado del «Diagnóstico del scooter: no disponible».

Sin datos de demo de alertas, sin motor de alertas, sin sensores, sin ubicación, sin Bluetooth, sin wake lock activo, sin IndexedDB, sin backend, sin mapas reales y sin dependencias nuevas.

## Archivos modificados

- `src/features/cockpit/cockpit.tsx`: nueva composición vertical; instrumentos persistentes fuera de `main`.
- `src/features/cockpit/top-bar.tsx`: barra compacta (hora + conectividad).
- `src/features/cockpit/vehicle-area.tsx`: instrumentos persistentes (velocidad/batería/avisos).
- `src/features/cockpit/map-region.tsx`: variante compacta y textos reducidos.
- `src/features/cockpit/context-panel.tsx`: detalle con desplazamiento interno, «Estado del sistema» y detalle de vehículo.
- `src/features/cockpit/bottom-bar.tsx`: área táctil mínima 44×44.
- `src/features/cockpit/use-client-capabilities.ts`: etiquetas de presencia y conectividad.

## Evidencia automatizada

Ejecutada sobre el head de esta rama:

| Comando | Resultado |
|---|---|
| `npm run typecheck` | sin errores |
| `npx biome check` | 15 archivos, sin hallazgos |
| `npm run build` | compilado (Next.js 16.4.2, Turbopack), rutas `/` y `/_not-found` |
| `node --test experiments/iphone-capability-probe-tests/probe.test.mjs` | 15/15 |
| `npx next start` + `GET /` | HTTP 200 |

## Evidencia interactiva (Firefox headless + geckodriver)

Harness efímero `/tmp/opencode/wd-check-007.mjs` (no versionado). **102/102 PASS**.

- **Viewports**: 390×844 y 390×660 CSS px (innerHeight real medido 844 y 660).
- **Estados**: cerrado y cada uno de los cuatro paneles abiertos (Navegación, Vehículo, Misiones, Aplicaciones).
- **Comprobado por estado**: sin overflow horizontal; velocidad «—/Sin lectura»; barra superior con hora + red y sin inventario de APIs; resumen de avisos reconocible; batería «Sin registrar» sin `%` ficticio; instrumentos persistentes visibles sobre la barra; barra de accesos dentro de la ventana; panel sin solapar la barra; foco en «Cerrar»; `aria-expanded` coherente; detalle con desplazamiento propio; cierre con el mismo acceso.
- **Contenido**: «Estado del sistema» con inventario de APIs y funciones inactivas; aclaración presencia ≠ permiso/conexión; tres magnitudes de energía diferenciadas; aviso de app separado del diagnóstico del scooter; sin datos de demo.
- **Foco**: Escape cierra y devuelve foco al acceso; «Cerrar» cierra y devuelve foco.

Medidas resumidas (px):

| Métrica | 390×844 | 390×660 |
|---|---|---|
| Área del vehículo (alto) | 92 (top 53, bottom 145) | 92 (top 53, bottom 145) |
| Barra inferior | 390×57, top 787 | 390×57, top 591 |
| Mapa cerrado (alto) | 626 | 430 |
| Panel abierto (bottom) | 779 (barra top 787) | 583 (barra top 591) |
| Detalle — alto cliente | 513 | 317 |
| Detalle — alto contenido (Vehículo) | 513 (no requiere scroll) | 383 (scroll interno: 317) |
| Accesos (cada uno) | 91×44 | 91×44 |

Capturas sintéticas (sin datos personales, recortadas a 390 px de ancho):

- [Cerrado, 390×844](assets/2026-10-19-cockpit-vertical-hierarchy/390x844-cerrado.png)
- [Panel Vehículo, 390×844](assets/2026-10-19-cockpit-vertical-hierarchy/390x844-panel-vehiculo.png)
- [Panel Vehículo, altura corta 390×660](assets/2026-10-19-cockpit-vertical-hierarchy/390x660-panel-vehiculo-altura-corta.png)
- [Panel Aplicaciones — Estado del sistema, 390×844](assets/2026-10-19-cockpit-vertical-hierarchy/390x844-panel-aplicaciones-estado-sistema.png)

## Limitaciones

- Firefox headless en Linux no baja de ~500 px de ancho: el caso 390 px se emula constriñendo el documento a 390 px (misma rama de layout móvil). **No es Safari físico** ni sustituye la prueba en iPhone 11.
- La conectividad mostrada es lo informado por el navegador, no una comprobación de acceso real a Internet.
- El zoom de texto no se probó con un factor exacto; el detalle del panel tiene desplazamiento interno y `main` permite desplazamiento, priorizando acceso sobre «sin scroll».
- Sin datos reales de sensores: velocidad, batería, autonomía y predicción permanecen «Sin lectura»/«Datos insuficientes».

## Siguiente paso

Revisión del AI PM sobre este incremento. Pendientes de F1 (no incluidos): flujos de Hangar/misiones/debrief, wireframes parado/en marcha, iconos definitivos y validación en Safari físico.
