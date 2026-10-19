# Reglas técnicas — Ground Control

Fecha: 2026-10-19. Complementa AGENTS.md. Framework aprobado por Alejandro: **Next.js**. [ADR-0002](docs/adr/0002-nextjs-platform.md) y [arquitectura](docs/architecture.md).

- Next.js 16.x App Router + React + TypeScript strict. No Pages Router ni Vite. Tailwind CSS v4 y tokens CSS propios. Versiones estables compatibles comprobadas, npm y un package-lock.
- src/app para rutas/layouts y adaptadores HTTP; src/features para componentes/estado/dominio/servicios por función; src/shared sólo para código realmente reutilizado. No carpetas vacías de todo el roadmap.
- Server Components por defecto. 'use client' en sensores, IndexedDB, UI interactiva y stores; no window/navigator durante SSR. Inicialización tras montar y placeholders estables para evitar errores de hidratación.
- Backend Next.js con Route Handlers y servicios server-only por feature. Validación y autorización en servidor. No duplicar backend con Fastify sin razón.
- Zustand para estado compartido efímero. Persistencia local futura IndexedDB/Dexie; remoto con Supabase/Postgres/Auth + Drizzle al implementar ese requisito. TanStack Query cuando haya datos remotos. No Redis/IA por defecto.
- Adaptadores GPS/manual y conexión Xiaomi futura; muestras con fuente, timestamps, unidad y calidad. Desconectado/ausente no equivale a cero.
- Batería %, autonomía y predicción son contratos distintos. Potencia/regeneración sólo con telemetría validada.
- Biome, typecheck explícito y next build. No asumir next lint. Vitest/Playwright cuando exista lógica/flujo significativo. No tests que sólo copian UI.
- Secretos sólo en servidor; nunca NEXT_PUBLIC_ para secretos ni datos reales en Git/fixtures. RLS y aislamiento de usuario al introducir Supabase.
- La sonda y sus tests se conservan; no modificar Pages en scaffold. Hosting de app Next.js: Vercel o Node compatible, por configurar en una entrega posterior; no output:'export' para arquitectura principal con backend.
- Excepciones al estándar ALESAM: servicios por etapa, Route Handlers antes de Fastify, IndexedDB para continuidad local y MapLibre al seleccionar proveedor. ADR-0001/Vite superado, mantenerlo sólo como historial.
- No sobrescribir AGENTS.md ni documentación con archivos de generador. OpenCode + Big Pickle principal; Cursor sólo si hace falta.
