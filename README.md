# Ground Control

**El cockpit inteligente de mi scooter.** Experiencia de conducción inspirada en Tesla, con preparación de misiones y bitácora inspiradas en aviación y SpaceX.

Proyecto personal **build in public** de Alejandro Arra para un Xiaomi Electric Scooter 6 Ultra. Estado: validación de hardware en curso y primera base provisional del cockpit. Todavía no hay telemetría real ni integración Xiaomi. Ground Control y Rover 01 son nombres de trabajo.

## Empieza aquí

- [Producto y experiencia](docs/product-definition.md).
- [Roadmap completo 0–100, diez fases](docs/roadmap.md).
- [Backlog de tareas](docs/backlog.md) · [Issues](https://github.com/alearra/ground-control-scooter/issues).
- [Workflow de desarrollo y AI Product Manager](docs/development-workflow.md).
- [Primera sesión de OpenCode](prompts/000-discovery.md).

## Cómo lo construimos

OpenCode con **Big Pickle** como modelo principal, según la elección de Alejandro. Cursor sólo cuando sea necesario. ChatGPT actúa como AI Product Manager: prioriza, redacta prompts, revisa evidencia y mantiene tareas y estados al retomar el proyecto.

Se toma el [stack ALESAM](https://github.com/alearra/STACK-EST-NDAR-ALESAM-2026-AI-Fullstack) como referencia adaptable. Alejandro eligió **Next.js** como base del producto; el resto de servicios se incorpora sólo cuando una necesidad real lo exija. Las decisiones viven en [ADR-0002](docs/adr/0002-nextjs-platform.md) y [RULES](RULES.md).

## Stack y comandos

- **Next.js 16.x** (App Router) + **React 19** + **TypeScript strict**.
- **Tailwind CSS v4** para estilos y **Biome** para lint/formato.
- Requiere **Node.js ≥ 20.9** y npm.

```bash
npm ci        # instala dependencias desde package-lock.json
npm run dev   # entorno de desarrollo (next dev)
npm run build # build de producción (next build)
npm run start # sirve el build de producción (next start)
npm run typecheck # tsc --noEmit
npm run lint  # biome check
```

La base actual sólo monta el layout provisional del cockpit con datos vacíos: **no** inicia GPS, no pide ubicación ni Bluetooth y no guarda coordenadas. La sonda de capacidades del iPhone sigue publicada aparte en [alearra.github.io/ground-control-scooter](https://alearra.github.io/ground-control-scooter/) (código en [`experiments/iphone-capability-probe`](experiments/iphone-capability-probe)).

## Estado real

La integración de datos Xiaomi es un requisito, **no una capacidad ya demostrada**. [Investigación y prueba](docs/xiaomi-integration.md). Un valor manual, simulado o antiguo nunca se presenta como telemetría en vivo.

El repositorio público, el roadmap y los issues no publican ubicaciones personales, claves ni datos de cuenta. El código público no implica que el historial de viajes sea público. [Política build in public](docs/build-in-public.md).

## GitHub Project

[Ground Control — Roadmap 0–100](https://github.com/users/alearra/projects/6), público y enlazado a este repositorio. Contiene las 60 issues GC (#1–#60): #7/GC-007 en Done con evidencia y 59 en Backlog. Detalle y vistas pendientes en [project-setup.md](docs/project-setup.md).

Los issues son tareas reales del repositorio; el tablero refleja su estado. Quedan pendientes de UI las vistas Board por Status, Roadmap por Phase y Current phase (F0).

Proyecto independiente, sin afiliación con Xiaomi, Tesla o SpaceX. Licencia del código propio pendiente de elección; no se asigna una licencia de terceros al proyecto.
