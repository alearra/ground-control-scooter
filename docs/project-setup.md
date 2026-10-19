# GitHub Project — estado configurado

Fecha: 2026-10-19. Estado: **creado y verificado**. Ejecutado con OpenCode + Big Pickle (gh 2.102.0, cuenta alearra con scope `project`).

## Datos reales

- URL: https://github.com/users/alearra/projects/6
- Número: 6. Tipo: GitHub Projects moderno del usuario, visibilidad pública.
- ID: `PVT_kwHOBc9u684BnyKE`.
- Enlazado al repositorio alearra/ground-control-scooter (1 repositorio vinculado).
- Título: Ground Control — Roadmap 0–100.

## Campos configurados

- Status (selección): Backlog, Ready, In progress, Review, Blocked, Done.
- Phase (selección): F0–F9.
- Priority (selección): P0, P1, P2 (clasificación inicial: F0=P0, F1–F9=P1, ver abajo).
- GC ID (texto): GC-001…GC-096.
- Evidence (texto/enlace).
- Campos del sistema: Title, Assignees, Labels, Linked pull requests, Milestone, Repository, Reviewers, Parent issue, Sub-issues progress, Created, Updated, Closed.

## Importación y clasificación

- 60 items importados desde las issues reales del repositorio (#1–#60); sin draft items ni issues nuevas.
- Verificación: 60 números únicos, 60 IDs de item únicos, sin faltantes ni duplicados.
- Status: 59 en Backlog y #7/GC-007 en Done. Issue #7 cerrada; las demás siguen abiertas.
- #7 con Evidence: https://github.com/alearra/ground-control-scooter/commit/0eb9aebc51333869df376df8f5ca11b3ce8c22b9
- Phase y GC ID tomados del título y del marcador `ground-control:GC-XXX phase:FY` del cuerpo; los 60 coinciden con su issue.
- Prioridad inicial por fase validada por el AI PM: F0=P0 (7 items), F1–F9=P1 (53 items). Revisar al cerrar F0; no implica orden definitivo entre todas las tareas.

## Vistas

La API/CLI de Projects no permite crear ni modificar vistas. Solo existe la vista por defecto «View 1» (tabla). Pendiente de UI:

1. Board agrupado por Status.
2. Tabla Roadmap agrupada por Phase.
3. Vista Current phase filtrada a `phase:F0`.

## Cierre de trabajo

El AI PM actualiza estados con evidencia durante las sesiones. Issue cerrada por criterios cumplidos → Done; reabierta → revisar estado. No existe sincronización automática hasta configurarla y probarla.

## Ejecución mediante OpenCode

Alejandro autorizó esta alternativa el 2026-10-19. Se ejecutó [prompts/001-github-project-setup.md](../prompts/001-github-project-setup.md) en OpenCode + Big Pickle: comprobación de acceso, reutilización del Project existente, importación deduplicada, campos/estados, verificación y handoff. No se registran tokens en el repo. Las vistas propuestas quedan pendientes de UI.

## Revisión AI Product Manager

[Revisión del 2026-10-19](reviews/2026-10-19-project-setup.md): sin bloqueos documentales; prioridades iniciales validadas. Inspección visual parcial del tablero y auditoría de 60 items reportada por OpenCode, no repetida por API por el AI PM. Las vistas pendientes no bloquean GC-001/002.
