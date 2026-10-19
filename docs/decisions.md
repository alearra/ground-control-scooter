# Decisiones

Fecha: 2026-10-19.

| ID | Decisión | Estado |
|---|---|---|
| D-001 | Webapp personal para Xiaomi 6 Ultra; cockpit Tesla, misiones SpaceX/aviación, datos Xiaomi | Aceptado; sin implementación |
| D-002 | Repo público alearra/ground-control-scooter y desarrollo build in public | Aprobado por Alejandro |
| D-003 | OpenCode + Big Pickle principal; Cursor sólo si es necesario | Aprobado |
| D-004 | ChatGPT como AI Product Manager: prompts, priorización y seguimiento en GitHub | Aprobado |
| D-005 | Stack ALESAM adaptable; velocidad de desarrollo y pocas dependencias | Aprobado |
| D-006 | Prompts basados en i-have-adhd | Aprobado |
| D-007 | Roadmap completo 0–100 organizado en diez fases | Conservado del plan fundacional |
| D-008 | Este repo contiene la fuente canónica pública de producto, roadmap y documentación técnica | Consolidación documental |

Pendientes: nombre/alias definitivos, stack efectivo, teléfono de uso, método de integración, mapas, licencia, presupuesto y fechas. No se presume empresa titular ni comercialización. La mención «0 a 10» se interpreta como las diez fases del roadmap completo ya solicitado; no se recorta el alcance a F0.

Referencias: [workflow](development-workflow.md), [roadmap](roadmap.md) e [investigación Xiaomi](xiaomi-integration.md).

## Revisión de producto — 2026-10-19

| ID | Decisión | Estado |
|---|---|---|
| D-009 | Orden visual, coherencia de interacción y evolución por software como resultados del cockpit | Requisito de Alejandro |
| D-010 | Cinco regiones: vehículo, mapa, barra inferior, barra superior y paneles superpuestos | Requisito; distribución vertical a validar en F1 |
| D-011 | Velocidad, límite de vía, energía, potencia/regeneración, avisos y asistencias con fuente/estado verificables | Requisito condicionado por datos disponibles |
| D-012 | Separar batería %, autonomía indicada y predicción energética del viaje | Requisito de Alejandro |
| D-013 | Cámara y percepción de vehículos/elementos a futuro | Dirección futura solicitada; alcance técnico y fase por definir |
| D-014 | Pausar arquitectura mientras se revisa el producto | Superada el 2026-10-19: Alejandro autorizó pasar a arquitectura tras aceptar la actualización |

[Detalle canónico del cockpit](cockpit-experience.md). Se amplían GC-010/012/022/041/050/053 sin cerrar tareas ni prometer integración disponible. Teléfono, orientación y datos básicos del scooter ya fueron aportados; capacidades técnicas siguen limitadas a evidencia de la sonda. Climatización es referencia automotriz; no se implementa un control inexistente del scooter.

## Inicio de arquitectura — 2026-10-19

Alejandro aceptó la actualización del producto y autorizó avanzar a arquitectura. PR #65 integrado como b12836d. Propuesta inicial del AI PM en [ADR-0001](adr/0001-local-first-web-cockpit.md), **superada** por la decisión explícita Next.js de Alejandro en ADR-0002. Se conservan datos locales y adaptadores; persistencia/MapLibre por etapas. [RULES.md](../RULES.md) documenta excepciones al stack ALESAM.

No se considera cerrado GC-006: proveedor de mapas, costos y vía Xiaomi siguen pendientes. No se implementó scaffold en esta revisión. Ninguna decisión técnica convierte las limitaciones de la sonda en capacidades disponibles.

## Framework aprobado — 2026-10-19

| ID | Decisión | Estado |
|---|---|---|
| D-015 | Next.js App Router por uniformidad con ALESAM y evolución cercana hacia plataforma con backend | Aprobada explícitamente por Alejandro |

[ADR-0002](adr/0002-nextjs-platform.md) sustituye ADR-0001 en la elección de framework. Next.js 16.x, TypeScript, Tailwind v4; backend progresivo con Route Handlers/servicios. Sonda permanece en Pages; la app usará hosting apto para runtime Next.js. No se crean servicios ni infraestructura en esta actualización documental.
