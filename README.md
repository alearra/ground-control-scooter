# Ground Control

**El cockpit inteligente de mi scooter.** Experiencia de conducción inspirada en Tesla, con preparación de misiones y bitácora inspiradas en aviación y SpaceX.

Proyecto personal **build in public** de Alejandro Arra para un Xiaomi Electric Scooter 6 Ultra. Estado: planificación y validación de hardware; todavía sin aplicación implementada. Ground Control y Rover 01 son nombres de trabajo.

## Empieza aquí

- [Producto y experiencia](docs/product-definition.md).
- [Roadmap completo 0–100, diez fases](docs/roadmap.md).
- [Backlog de tareas](docs/backlog.md) · [Issues](https://github.com/alearra/ground-control-scooter/issues).
- [Workflow de desarrollo y AI Product Manager](docs/development-workflow.md).
- [Primera sesión de OpenCode](prompts/000-discovery.md).

## Cómo lo construimos

OpenCode con **Big Pickle** como modelo principal, según la elección de Alejandro. Cursor sólo cuando sea necesario. ChatGPT actúa como AI Product Manager: prioriza, redacta prompts, revisa evidencia y mantiene tareas y estados al retomar el proyecto.

Se toma el [stack ALESAM](https://github.com/alearra/STACK-EST-NDAR-ALESAM-2026-AI-Fullstack) como referencia adaptable. El stack efectivo se decidirá tras validar plataforma y Xiaomi; el objetivo es desarrollar rápido con pocas dependencias. No hay comandos de instalación o ejecución de app todavía.

## Estado real

La integración de datos Xiaomi es un requisito, **no una capacidad ya demostrada**. [Investigación y prueba](docs/xiaomi-integration.md). Un valor manual, simulado o antiguo nunca se presenta como telemetría en vivo.

El repositorio público, el roadmap y los issues no publican ubicaciones personales, claves ni datos de cuenta. El código público no implica que el historial de viajes sea público. [Política build in public](docs/build-in-public.md).

## GitHub Project

Configuración preparada en [project-setup.md](docs/project-setup.md). **Pendiente de creación**: la conexión GitHub disponible para esta sesión no expone operaciones Projects. No existe aún URL de tablero verificada. Los issues sí son tareas reales del repositorio.

Proyecto independiente, sin afiliación con Xiaomi, Tesla o SpaceX. Licencia del código propio pendiente de elección; no se asigna una licencia de terceros al proyecto.
