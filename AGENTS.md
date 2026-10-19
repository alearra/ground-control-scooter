# Ground Control — instrucciones de trabajo

Actualización: 2026-10-19.

## Inicio de sesión

Leer README.md, docs/current-status.md, la issue activa y docs/development-workflow.md. Cargar sólo los documentos relacionados con esa tarea. El roadmap canónico está en docs/roadmap.md; el estado de tareas vive en Issues y, cuando exista, GitHub Project. No consultar repositorios privados para trabajar en este repo.

## Roles y herramientas

Alejandro decide objetivos, valida experiencia y hace pruebas de hardware. ChatGPT es AI Product Manager: priorización, prompts, criterios de aceptación, revisión y seguimiento. OpenCode + Big Pickle implementa; Cursor se usa si hace falta y se registra el motivo. No cambiar modelo o herramienta por iniciativa propia. No inventar IDs de modelo, versiones ni disponibilidad gratuita.

Una tarea activa por sesión. Una rama y un PR por cambio coherente. No desarrollar el roadmap completo desde un único prompt. Sin subagentes salvo instrucción explícita de Alejandro.

## Referencias y stack

El estándar ALESAM es una referencia, no una lista obligatoria de dependencias. Mantener TypeScript estricto, organización por feature, claridad y herramientas proporcionales. Elegir framework, backend, almacenamiento y mapas con evidencia de F0. Documentar selección y excepciones en RULES.md/ADR. No instalar Redis, Supabase, IA o un backend sin necesidad identificada.

## Ejecución

Respetar alcance del prompt y la issue. Antes de editar, identificar archivos y criterios. Cambiar sólo lo necesario y ejecutar las verificaciones relevantes. Nunca reportar como ejecutado algo no probado; separar simulación, prueba automatizada y prueba física. No generar tests que sólo copian la implementación.

La integración Xiaomi empieza con lectura validada del 6 Ultra. No copiar UUIDs, escalas o tablas de otros modelos sin prueba. No cambios de firmware, velocidad, bloqueo o control en movimiento. Las escrituras de transporte para autenticación no son controles del vehículo.

## Comunicación inspirada en i-have-adhd

Fuente: https://github.com/ayghri/i-have-adhd/blob/main/skills/i-have-adhd/SKILL.md (consultada 2026-10-19). Estas son adaptaciones originales del proyecto, no una copia instalada del plugin.

Primera línea: resultado o acción. Pasos numerados, una acción por paso. Máximo cinco elementos visibles por grupo, sin perder requisitos. Indicar estado, bloqueo concreto y una siguiente acción de menos de dos minutos. Sin preámbulos ni tangentes. Estimar en minutos sólo con base suficiente; decir incertidumbre si no la hay. Esta preferencia no implica un diagnóstico de Alejandro.

## Datos y publicación

Repo público. No subir secretos, Xiaomi keys, tokens, MAC, números de serie, domicilios, rutas reales ni exportaciones crudas. Usar fixtures sintéticos explícitos. Sanitizar imágenes/logs. Evitar instalar plugins globales o editar configuración ajena al proyecto sin solicitud. No añadir una licencia sin decisión del propietario.

## Handoff y cierre

Entregar issue, rama/commit/PR, archivos, cambios, comandos y resultados, limitaciones y una siguiente acción. Implementación no equivale a Done. El AI PM revisa evidencia antes del cierre; hardware sin probar queda Blocked o pendiente de validación. Sin accesos al Project, informar esa limitación. Nunca inventar estados o URLs.
