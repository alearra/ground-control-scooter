# Revisión — base Next.js y sincronización del Project

Fecha: 2026-10-19. Revisión del AI PM sobre el PR #67 (head revisado `8d123dd`), ejecutada en OpenCode + Big Pickle según [prompt 006](../../prompts/006-foundation-review-project-sync.md). Alcance: corregir tres observaciones acotadas, reconciliar el Project #6 y documentar. Sin merge, sin deploy, sin cerrar tareas.

## Observaciones del AI PM y correcciones

1. **`top-bar.tsx` — presencia de API parecía función activa.** Se pasó de «GPS disponible» en verde a etiquetas explícitas «API presente / API ausente / sin comprobar», siempre en tono neutro, más un indicador «Funciones: inactivas». La conectividad se rotula como «el navegador informa en línea / sin conexión», no como comprobación de acceso a Internet. Las APIs siguen sin iniciarse.
2. **`vehicle-area.tsx` — «Avisos: sin alertas» insinuaba diagnóstico del scooter.** Ahora hay un bloque «Avisos y diagnóstico» con dos orígenes separados: «Avisos de la aplicación: sin avisos» y «Diagnóstico del scooter: no disponible (sin lectura)», con la aclaración de que la ausencia de avisos de app no diagnostica el vehículo.
3. **`context-panel.tsx` — el panel superpuesto cubría la barra inferior.** El panel dejó de ser `fixed bottom-0 z-50`; ahora vive en el flujo, dentro de `main`, y reserva espacio real (el mapa se reduce) sin altura de barra supuesta. Se conservan cierre con botón, cierre con Escape, cambio de panel y devolución de foco al acceso. No es modal ni oculta instrumentos.

Además se actualizó el cuerpo de la issue #8, que enlazaba una rama antigua (`docs/cockpit-product-update`) y afirmaba «Arquitectura pausada»: ahora enlaza `blob/main/docs/cockpit-experience.md` y aclara que la arquitectura Next.js quedó definida (ADR-0002). Se conservaron objetivo, criterios y marcadores (`GC-010 phase:F1`).

## Verificación ejecutada (esta entrega, por OpenCode)

- `npm ci` — OK, 0 vulnerabilidades.
- `npm run typecheck` (`tsc --noEmit`) — OK.
- `npm run lint` (`biome check`) — OK, 15 archivos.
- `npm run build` (`next build`) — OK; `/` y `/_not-found` prerenderizadas.
- `node --test experiments/iphone-capability-probe-tests/probe.test.mjs` — 15/15 pass (sonda intacta).
- Arranque `next start` + HTTP 200.
- **Verificación interactiva real en Firefox 157 headless vía geckodriver 0.37.1** (script efímero fuera del repo): **33/33 comprobaciones**. Cubre: cinco regiones; sin overflow horizontal; barra inferior dentro de la ventana; apertura de Navegación con foco en «Cerrar»; `aria-expanded`; panel **por encima** de la barra inferior sin solaparla; área del vehículo visible con panel abierto; mapa con alto > 0; cambio de panel; cierre con Escape y devolución de foco; cierre con botón; y a 390 px de ancho emulado (cerrado y abierto) y altura corta (barra inferior visible y contenido desplazable).

### Límites de la prueba

- Firefox headless en Linux no baja de ~500 px de ancho; el caso 390 px se verificó constriñendo el documento a 390 px (misma rama de layout móvil). **No es Safari físico del iPhone 11.**
- El AI PM no repitió la prueba interactiva ni la de sonda; la evidencia de sonda sigue siendo reportada por OpenCode.
- Las capturas quedaron fuera del repo (temporales); no se publican export crudos, serie, MAC ni coordenadas.

## Project #6 — antes / después

Se reutilizaron los items existentes (identificados por issue y GC ID), conservando Phase/Priority/GC ID. Sólo se cambiaron diferencias reales y se agregó Evidence.

| Issue | GC-ID | Antes | Después | Evidence (resumen) |
|---|---|---|---|---|
| #1 | GC-001 | Backlog | Review | Inventario declarado; sonda PR #63 |
| #2 | GC-002 | Backlog | Review | Inventario declarado; sin verificar |
| #3 | GC-003 | Backlog | Backlog (sin cambio) | Integración/protocolo Xiaomi no soportados |
| #4 | GC-004 | Blocked | Review | Evidencia parcial; pantalla bloqueada NO validada |
| #5 | GC-005 | Backlog | In progress | Next.js elegido; PWA vs puente nativo abierto |
| #6 | GC-006 | Backlog | In progress | Stack elegido; mapas/costos/alcance pendientes |
| #7 | GC-007 | Done | Done (sin cambio) | — |
| #8 | GC-010 | Backlog | In progress | Cockpit provisional PR #67; faltan flujos |
| #13 | GC-020 | Backlog | Review | Alcance parcial; PWA pendiente |

No se creó otro Project ni se duplicaron items/issues.

## Pendientes y límites honestos

- Sin prueba en Safari físico del iPhone 11: el cockpit provisional no está validado como experiencia de conducción.
- GC-001/002/003/004/005/006/010/020 siguen **abiertas**; este trabajo no cierra ninguna tarea.
- La app todavía no tiene despliegue runtime; Pages sigue sirviendo únicamente la sonda y no se modificó.
- `docs/cockpit-experience.md` (en main) conserva una línea final («La arquitectura sigue en pausa…») que quedó superada por ADR-0002; se deja señalada para conciliación del AI PM, fuera del alcance de este prompt.
- PR #64 (documental de la sonda) sigue abierto, sin revivir sus textos.
