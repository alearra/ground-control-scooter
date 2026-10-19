# Plantilla de prompt para OpenCode + Big Pickle

## Acción
Resuelve únicamente [GC-ID / issue URL]: [objetivo].

## Estado y contexto mínimo
Lee AGENTS.md, docs/current-status.md y [documentos de esta tarea]. Estado real: [estado]. Dependencias: [evidencia/enlaces].

## Alcance
[Archivos o módulo que se puede modificar]. Fuera de alcance: [límites concretos]. Respeta el stack efectivo registrado; si falta una decisión, señala el bloqueo sin inventarla.

## Trabajo
1. Inspecciona los archivos y confirma los criterios.
2. Implementa/investiga sólo el objetivo.
3. Ejecuta verificaciones relevantes y prepara un cambio revisable.

## Aceptación
[Criterios observables específicos de la issue; separar hardware de simulación].

## Salida
Primera línea: resultado o bloqueo. Hasta cinco puntos: commit/PR, cambios, verificaciones, pendientes, siguiente acción única. No cierres la issue ni avances de fase sin revisión del AI PM. No uses Cursor ni cambies de modelo automáticamente.
