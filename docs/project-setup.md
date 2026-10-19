# GitHub Project — configuración preparada

Fecha: 2026-10-19. Estado: **pendiente de creación**. La conexión GitHub actual permite Issues y contenidos, pero no expone operaciones GitHub Projects. No hay URL o ID de Project confirmado.

## Especificación

- Propietario: alearra. Tipo: GitHub Projects moderno del usuario, enlazado a alearra/ground-control-scooter.
- Título: Ground Control — Roadmap 0–100. Visibilidad: pública, coherente con build in public.
- Incluir todas las issues GC del backlog; deduplicar por URL. No generar nuevas issues para importar.
- Status: Backlog, Ready, In progress, Review, Blocked, Done. Valor inicial: Backlog.
- Campos propuestos: Phase (F0–F9), Priority (P0/P1/P2), GC ID y Evidence (texto/enlace).

## Vistas propuestas

Board por Status; tabla Roadmap agrupada por Phase; vista Current phase filtrada F0. Mantener todas las tareas accesibles, pero ejecutar una por vez.

El campo Phase se obtiene del título [F0]…[F9]. GC ID se obtiene de [GC-001]…[GC-096]. Dependencias y aceptación ya están en los cuerpos de las issues.

## Importación y revisión

Crear el Project sólo si no existe uno equivalente; verificar propietario/repositorio. Enlazar al repo. Configurar estados, importar las issues existentes y comprobar el total contra docs/backlog.md. Sin evidencia de trabajo iniciado, dejarlas en Backlog.

Al terminar, guardar URL/ID reales aquí y en README/current-status. La creación puede hacerse por navegador autorizado o por CLI autenticada con permisos Projects; no se dispone de CLI autenticada en esta sesión. No registrar tokens en el repo.

## Cierre de trabajo

El AI PM actualiza estados con evidencia durante las sesiones. Issue cerrada por criterios cumplidos → Done; reabierta → revisar estado. No existe sincronización automática hasta configurarla y probarla.
