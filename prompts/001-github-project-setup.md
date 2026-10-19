# Crear o completar el GitHub Project de Ground Control

Ejecuta esta tarea de gestión en el repositorio alearra/ground-control-scooter usando OpenCode con Big Pickle. No desarrolles la aplicación ni instales su stack. Usa GitHub CLI y, si hace falta, GraphQL mediante gh api graphql.

Estado conocido al 2026-10-19: repo público build in public, 60 issues GC (#1–#60), #7/GC-007 cerrada con evidencia documental y 59 abiertas. GitHub Project todavía no confirmado. El navegador del AI PM no tiene sesión iniciada; esto no indica el estado de autenticación en tu máquina.

## 1. Inspección y acceso

Lee AGENTS.md, docs/current-status.md, docs/project-setup.md y docs/backlog.md. Confirma el remote y evita modificar cambios locales ajenos. Comprueba gh --version, gh auth status y el usuario autenticado con gh api user --jq .login, sin imprimir credenciales.

La cuenta debe tener acceso de escritura al repo y permiso Projects del propietario alearra. Verifica acceso con una lectura, no sólo con el nombre de cuenta. Si falta gh o autenticación, devuelve el comando apropiado y un único siguiente paso para que Alejandro lo resuelva localmente. No pidas tokens por chat ni cambies scopes silenciosamente. Si falta scope project, indica gh auth refresh -h github.com -s project y espera a que Alejandro complete la autorización local.

Consulta gh project --help y la ayuda de cada subcomando antes de construir llamadas. Para GraphQL, verifica el esquema y documentación vigente; no inventes campos ni mutaciones. Referencias oficiales: https://cli.github.com/manual/gh_project y https://docs.github.com/en/graphql/reference/projects.

## 2. Crear o reutilizar el Project

Busca todos los Projects accesibles de alearra con paginación. Identifica uno llamado «Ground Control — Roadmap 0–100» y revisa si ya está vinculado al repo. Si hay uno inequívoco, reutilízalo; si hay varios candidatos, pregunta una vez cuál usar. Si no hay ninguno, créalo.

Propietario: alearra. GitHub Projects moderno, visibilidad pública, enlazado al repositorio alearra/ground-control-scooter. Guarda el ID, número y URL devueltos por GitHub; nunca construyas un ID por suposición. No cambies visibilidad de otros Projects.

Inspecciona campos existentes. Configura Status con Backlog, Ready, In progress, Review, Blocked y Done; Phase como selección F0–F9; Priority como P0/P1/P2; GC ID y Evidence como texto. Reutiliza campos equivalentes. Si se reutiliza un tablero, conserva opciones y valores preexistentes ajenos: no borres campos/opciones ni reinicialices trabajo existente para imponer esta configuración.

## 3. Importar y clasificar las tareas existentes

Obtén las issues abiertas y cerradas del repositorio con paginación y compáralas con docs/backlog.md. Importa las 60 tareas GC existentes mediante sus URLs; no uses draft items ni crees issues nuevas. Lee todos los items del Project y deduplica por repositorio + issue URL/node ID. El comando de referencia para importar es gh project item-add; no lo confundas con item-create.

Extrae Phase y GC ID del título [F0][GC-001] y de los marcadores del cuerpo. Escribe los campos correspondientes usando IDs reales consultados. Para items nuevos: #7/GC-007 en Done y Evidence con https://github.com/alearra/ground-control-scooter/commit/0eb9aebc51333869df376df8f5ca11b3ce8c22b9; las otras 59 en Backlog si no hay evidencia posterior de avance. Prioridad inicial propuesta: F0=P0, F1–F9=P1; documenta que es provisional.

En una repetición, preserva estados y prioridades ya gestionados. Revisa las diferencias contra Issues antes de corregirlos; no sobrescribas un In progress, Review o Blocked legítimo. No cierres ni reabras issues desde esta tarea.

## 4. Vistas y verificación

Objetivo de vistas: Board por Status; Roadmap en tabla agrupada por Phase; Current phase filtrada a F0. Configura únicamente lo que permita una interfaz soportada. Si CLI/API no admite creación o modificación de vistas, conserva el Project y sus items ya creados y deja instrucciones concretas de UI para esas vistas. No declares que están listas sin verificarlas.

Vuelve a consultar el Project y todas sus páginas. Compara el conjunto de GC IDs del backlog con los items: 60 únicos, cada uno vinculado a su issue correcta, Phase/GC ID correctos, #7 Done y ninguna tarea perdida o duplicada. Si hay actividad posterior o diferencias, informa lo observado en lugar de forzar el conteo histórico. Reejecutar debe reutilizar el Project y añadir cero duplicados.

## 5. Documentación y handoff

En una rama chore/github-project-setup, actualiza README.md, docs/project-setup.md y docs/current-status.md con URL/ID/número reales, estado comprobado, conteos, vistas disponibles y pendientes. No marques desarrollo de la aplicación como iniciado ni borres documentación de hardware. Guarda sólo datos no sensibles y usa archivos para cuerpos Markdown largos.

Prepara un commit y un PR documental si el acceso lo permite; no hagas merge automáticamente. Si una etapa queda bloqueada, preserva lo completado y documenta exactamente qué falta.

Salida final: resultado primero; hasta cinco puntos con enlace del Project, conteo por estado/fase, verificaciones realizadas, commit/PR y un único siguiente paso. Distingue comandos ejecutados de instrucciones pendientes. No avances al inventario GC-001/002 ni al desarrollo en esta sesión.
