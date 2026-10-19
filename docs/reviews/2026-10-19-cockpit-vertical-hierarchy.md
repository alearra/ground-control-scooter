# Revisión — Jerarquía vertical del cockpit (incremento F1, GC-010/#8)

Fecha: 2026-10-19. Autor: OpenCode + Big Pickle. Estado: **corregido y entregado para revisión AI PM (PR #68)**. Sin merge ni deploy.

Alcance: incremento **parcial** de GC-010/#8 definido en [prompt 007](../../prompts/007-cockpit-vertical-hierarchy.md) y corregido según [prompt 008](../../prompts/008-cockpit-persistence-review.md). Compacta el contenido provisional, mueve diagnósticos técnicos a detalles y valida que los instrumentos esenciales y la barra de accesos sigan visibles al abrir paneles y al desplazar la región flexible. **No** cierra F1, GC-010 ni los flujos de Hangar/misiones/debrief.

Base: `main` en `040a45f`. Rama: `feature/cockpit-vertical-hierarchy`. Sin cambios de versiones de dependencias.

## Corrección tras la revisión AI PM (head 185d18c)

El hallazgo era correcto: en la entrega anterior `VehicleArea` seguía **dentro** de `main`, que tiene `overflow-y-auto`; el comentario y este informe afirmaban lo contrario. Corregido:

1. `VehicleArea` se movió **fuera de `main`**, como hermano entre la barra superior y la región flexible. `main` contiene sólo mapa/panel.
2. `TopBar` y `VehicleArea` llevan `shrink-0`: no se encogen ni recortan en los tamaños objetivo.
3. El panel contextual ya no usa `overflow-hidden` ni `min-h-0`; tiene `min-h-56` (14 rem). Si no cabe, `main` desborda y **se desplaza** en vez de recortar el panel en silencio.
4. Los textos pequeños pasaron de `text-[11px]` (px absolutos) a `text-xs` (rem), para que respeten la ampliación de texto.
5. El ancho mínimo de los accesos es `min-w-[44px]` absoluto; la altura `min-h-11` sigue creciendo con el texto. Así el área táctil no genera desborde horizontal a 200 %.

## Composición real

```
[ barra superior ]            fuera de main, shrink-0
[ instrumentos del vehículo ] fuera de main, shrink-0
[ main: mapa/panel ]          única región desplazable (overflow-y-auto)
[ barra de accesos ]          fuera de main, shrink-0
```

Así, abrir un panel, enfocar «Cerrar» o desplazar `main` **no puede mover** velocidad, resumen de avisos ni barra de accesos.

## Decisiones de jerarquía

1. **Instrumentos persistentes fuera del área desplazable.** Barra superior e instrumentos del vehículo son hermanos de `main`, no hijos.
2. **Área del vehículo = instrumento, no bloque decorativo.** Se retiró el bloque ilustrativo. Quedan: velocidad dominante (`—` + `km/h` + «Sin lectura», nunca `0`), batería secundaria («Sin registrar») y resumen de avisos que separa «Avisos de app» de «Diagnóstico».
3. **Barra superior compacta.** Hora + conectividad breve. El inventario de APIs y sus explicaciones salieron de la vista de conducción.
4. **«Estado del sistema» dentro del panel Aplicaciones.** Geolocation, Bluetooth y Wake Lock con API presente/ausente/sin comprobar, función **inactiva**, y aclaración de que presencia de API ≠ permiso, conexión real ni pantalla bloqueada activa; la conectividad es lo *informado* por el navegador.
5. **Región flexible mapa/panel con desplazamiento propio.** El mapa conserva espacio reconocible sin panel. Con panel abierto se reduce a una franja discreta y el detalle se desplaza **dentro de su región**; si el conjunto no cabe, `main` se desplaza y el panel no se recorta.
6. **Accesos ≥44×44 CSS px** (medido 91×44 a tamaño normal). Panel no modal: foco a «Cerrar» al abrir, Escape cierra, cambio entre accesos y devolución de foco.
7. **Tres magnitudes de energía diferenciadas** en el panel Vehículo: «Porcentaje de batería» (Sin registrar), «Autonomía estimada» y «Predicción del viaje» (Datos insuficientes). Aviso de app separado del «Diagnóstico del scooter: no disponible».

Sin datos de demo de alertas, sin sensores, sin ubicación, sin Bluetooth, sin wake lock activo, sin IndexedDB, sin backend, sin mapas reales y sin dependencias nuevas.

## Archivos modificados

- `src/features/cockpit/cockpit.tsx`: `VehicleArea` fuera de `main`; composición corregida.
- `src/features/cockpit/vehicle-area.tsx`: `shrink-0` y textos rem.
- `src/features/cockpit/top-bar.tsx`: `shrink-0`.
- `src/features/cockpit/context-panel.tsx`: `min-h-56` sin `overflow-hidden` (sin recorte silencioso) y textos rem.
- `src/features/cockpit/bottom-bar.tsx`: `min-w-[44px]` absoluto.
- `src/features/cockpit/map-region.tsx`, `use-client-capabilities.ts`: textos/labels ya descritos.

## Evidencia automatizada

Ejecutada sobre el head corregido:

| Comando | Resultado |
|---|---|
| `npm run typecheck` | sin errores |
| `npx biome check` | 15 archivos, sin hallazgos |
| `npm run build` | compilado (Next.js 16.4.2, Turbopack), rutas `/` y `/_not-found` |
| `node --test experiments/iphone-capability-probe-tests/probe.test.mjs` | 15/15 |
| `npx next start` + `GET /` | HTTP 200 |

## Evidencia interactiva (Firefox headless + geckodriver)

Harness efímero `/tmp/opencode/wd-check-008.mjs` (no versionado), **91/91 PASS** en esta ejecución.

**Alcance real del ancho (no es un viewport de 390 px):**

| Dato | Valor |
|---|---|
| `window.innerWidth` | 500 |
| `window.innerHeight` | 844 y 660 (altura de viewport real) |
| `documentElement.clientWidth` | 500 (layout viewport) |
| `body` / `main` ancho efectivo | 390 (`bodyClientWidth` = `mainRectWidth` = 390) |
| `main.scrollWidth` | 390 |
| Método | `html`/`body` con `width:390px`; captura de 500 px recortada a 390 con PIL |

La altura sí es de viewport; el ancho es **documento constreñido**. Esto no acredita media queries ni unidades de viewport de 390 px (ver limitaciones).

**Estados probados:** cerrado y los cuatro paneles, a altura 844 y 660. En todos: `VehicleArea` fuera de `main`, instrumentos visibles sobre la barra, barra dentro de la ventana, panel sin solapar la barra, foco en «Cerrar», detalle con `overflow-y:auto`, sin desborde horizontal del contenido.

Medidas:

| Métrica | Altura 844 | Altura 660 |
|---|---|---|
| Instrumentos del vehículo | top 45, bottom 137 | top 45, bottom 137 |
| Barra inferior | top 787, h 57 | top 603, h 57 |
| Detalle — alto cliente | 521 | 337 |
| Detalle — alto contenido (Vehículo) | 521 (sin scroll) | 384 (scroll interno) |
| Accesos | 91×44 cada uno | 91×44 cada uno |

**Persistencia con scroll forzado** (altura de viewport reducida a 300 para que `main` desborde):

- `main`: alto cliente 106, alto contenido 282 → desborda.
- `scrollTop` tras llevar al fondo: 176 (máximo 176) → se desplazó de verdad.
- Rectángulo de velocidad, resumen de avisos e instrumentos del vehículo: **idéntico antes y después** (top 45 / bottom 137, left 0 / right 390).
- Tras enfocar «Cerrar», cambiar de panel y cerrar: instrumentos idénticos; foco devuelto al acceso.

**Zoom de texto al 200 %** (mecanismo: `document.documentElement.style.fontSize = '200%'`, escala unidades rem; no es el zoom nativo de Firefox ni Safari):

- Vehículo fuera de `main` y visible (top 179 / bottom 520; barra top 552).
- «Cerrar» visible y enfocado (top 492 / bottom 580).
- Último detalle alcanzable con desplazamiento (`main.scrollTop` 566, detalle `body.scrollTop` 843; texto «Los tres datos de energía…» visible entre 287 y 511 de 660).
- Ningún elemento excede el contenedor de 390 px; `main.scrollWidth` 390/390. `body.scrollWidth` mide 402 (390 + 12 de scrollbar), no contenido desbordado.
- Escape cierra y devuelve foco.

**Nota histórica:** el 102/102 de la entrega anterior corresponde al head `185d18c` y se conserva como resultado reportado; **no** se re-ejecutó ni se presenta como validación nueva. La ejecución de esta corrección es 91/91.

## Capturas sintéticas (sin datos personales, recortadas a 390 px)

- [Cerrado, altura 844](assets/2026-10-19-cockpit-vertical-hierarchy/390x844-cerrado.png)
- [Panel Vehículo, altura 844](assets/2026-10-19-cockpit-vertical-hierarchy/390x844-panel-vehiculo.png)
- [Altura forzada 300, panel Vehículo desplazado (instrumentos fijos)](assets/2026-10-19-cockpit-vertical-hierarchy/altura-corta-panel-vehiculo-scroll.png)
- [Zoom de texto 200 %, panel Vehículo](assets/2026-10-19-cockpit-vertical-hierarchy/zoom200-panel-vehiculo.png)

## Limitaciones

- Firefox headless en Linux no permite un viewport de 390 px de ancho: el ancho es documento constreñido (390) y la altura sí es de viewport. **No es Safari físico** ni sustituye la prueba en iPhone 11.
- El zoom al 200 % se emula con `font-size` raíz; mide escalado rem, no el zoom de texto nativo. Los tamaños en px absolutos no escalan con este mecanismo (se migraron los textos pequeños a rem).
- La conectividad mostrada es lo informado por el navegador, no una comprobación de acceso real a Internet.
- Sin datos reales de sensores: velocidad, batería, autonomía y predicción permanecen «Sin lectura»/«Datos insuficientes».

## Siguiente paso

Revisión del AI PM sobre este incremento corregido (PR #68). Pendientes de F1 (no incluidos): flujos de Hangar/misiones/debrief, wireframes parado/en marcha, iconos definitivos y validación en Safari físico.

## Revisión AI PM — head abcd78f

Persistencia resuelta: VehicleArea es hermano de main, instrumentos sin shrink y panel sin recorte silencioso. El AI PM reprodujo TypeScript, Biome y build del código actualizado: correctos. Revisó las capturas de scroll forzado y ampliación; no repitió los 91 checks interactivos ni la sonda.

**Cambios requeridos: ampliación de texto.** La captura zoom200-panel-vehiculo.png muestra etiquetas de los cuatro accesos superpuestas y no muestra el contenido del panel Vehículo abierto. Las medidas reportadas de Cerrar (y=492–580) y barra (desde y=552) tampoco acreditan un control completamente visible sin interferencias. Estar enfocado no prueba visibilidad ni que el control sea accionable. El ancho de documento y escala rem están correctamente diferenciados de viewport y zoom nativo.

Corrección delimitada en [prompt 009](../../prompts/009-cockpit-text-zoom-review.md): etiquetas legibles, controles/detalles alcanzables al 200% y evidencia del panel abierto; permitir desplazamiento de página como degradación accesible cuando no queda altura. No exige todos los instrumentos fijos a cualquier ampliación. Sin merge/deploy ni nuevas pruebas físicas solicitadas a Alejandro. GC-010 permanece Review.
