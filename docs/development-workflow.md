# Workflow — AI Product Manager + OpenCode

Fecha: 2026-10-19. Decisión de Alejandro: OpenCode con Big Pickle como herramienta principal; Cursor sólo cuando haga falta. Proyecto build in public. El estándar ALESAM se adapta para un desarrollo ágil.

## Responsabilidades

| Rol | Responsabilidad |
|---|---|
| Alejandro | Decisiones de producto, ejecución local, pruebas de hardware y aceptación de experiencia |
| ChatGPT / AI PM | Mantener backlog, dependencias, prioridades, prompts, revisión de resultados y estados |
| OpenCode + Big Pickle | Implementar la tarea acotada, verificar y entregar evidencia |
| Cursor | Resolver un bloqueo concreto cuando resulte necesario; registrar causa y resultado |

El AI PM hace seguimiento al recibir avances o retomar sesiones. No se ha configurado monitoreo automático ni una automatización recurrente.

## Ciclo por tarea

1. AI PM lee estado real, elige una issue desbloqueada y entrega un prompt acotado con definición de terminado.
2. Alejandro ejecuta el prompt en OpenCode con Big Pickle y una rama de trabajo.
3. OpenCode implementa o investiga, corre comprobaciones relevantes y entrega el handoff.
4. Alejandro comparte enlace PR/commit o salida completa. AI PM revisa diff y evidencia, detecta faltantes y prepara corrección si hace falta.
5. AI PM cierra sólo lo verificado, actualiza el tablero cuando tenga acceso y entrega una única siguiente tarea.

## Estados

Backlog: tarea registrada. Ready: dependencias resueltas y prompt listo. In progress: ejecución realmente iniciada. Review: resultado entregado con evidencia. Blocked: falta acceso, decisión o prueba física; registrar qué destraba. Done: criterios satisfechos y evidencia revisada.

Estos nombres son diseño del tablero, no estados que ya existan en GitHub Project. Issues conservan open/closed. El estado detallado debe mantenerse en Project cuando exista; mientras tanto, usar la tabla current-status y notas en la issue.

## Definición de terminado

Resultado dentro de alcance, comprobaciones pertinentes documentadas, PR/commit o informe revisable, límites conocidos y documentación relevante actualizada. No cerrar por «funciona» sin evidencia. Un criterio físico no se satisface con mocks.

## Cómo se usan los prompts

[Plantilla](../prompts/TEMPLATE.md) y [primera sesión](../prompts/000-discovery.md). Cada prompt contiene un objetivo, contexto mínimo, alcance, criterios y salida esperada. Evitar cargar todos los documentos en cada turno. Dividir tareas demasiado grandes antes de implementarlas.

Ante error: ubicarlo, identificar causa, corregir de forma acotada y repetir la comprobación relevante. Tras tres intentos fallidos con la misma suposición, detener la iteración y devolver un diagnóstico al AI PM. Cursor se evalúa con ese diagnóstico o por una capacidad necesaria de la que OpenCode carezca.

## Stack proporcional

Fuente: [STACK ESTÁNDAR ALESAM 2026](https://github.com/alearra/STACK-EST-NDAR-ALESAM-2026-AI-Fullstack). La instrucción actual de Alejandro permite adaptarlo: rapidez y agilidad primero. Adoptar TypeScript estricto y estructura por feature; elegir el resto después de conocer restricciones. No iniciar servicios de IA, Redis, auth o backend por defecto.

## Formato de respuesta

Inspirado en [i-have-adhd](https://github.com/ayghri/i-have-adhd): acción/resultado primero, listas numeradas cortas, estado explícito, cero tangentes y una sola siguiente acción. Las listas largas viven en documentación/backlog. No inventar tiempos o progreso.

## Registro de evidencia

Para cada entrega: issue, commit/PR, comandos ejecutados y salida resumida, prueba física si aplica, pendientes y siguiente acción. No publicar telemetría identificable ni credenciales como prueba.
