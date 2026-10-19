# Reglas técnicas — Ground Control

Fecha: 2026-10-19. Complementa AGENTS.md. [ADR-0001](docs/adr/0001-local-first-web-cockpit.md) y [arquitectura](docs/architecture.md).

- React + Vite + TypeScript strict para el cockpit; Tailwind CSS v4, tokens CSS semánticos. Versiones estables compatibles comprobadas al instalar; npm y un package-lock.
- Organización por feature; shared sólo para código realmente reutilizado. No crear carpetas vacías de todo el roadmap.
- UI compartida efímera con Zustand; dominio/testigos no llaman a hardware directamente. Fuente persistida futura IndexedDB/Dexie, no localStorage como DB de viajes.
- Adaptadores para GPS/manual y conexión Xiaomi futura; datos con fuente, timestamps, unidad y calidad. Ausente/desconectado nunca se convierte a cero.
- Batería %, autonomía y predicción son contratos diferentes. Potencia/regeneración sólo con telemetría validada.
- Biome y typecheck explícito más build; Vitest/Playwright al existir lógica/flujo significativo. No instalar herramientas para simular cobertura.
- La sonda y sus tests permanecen intactos; ningún scaffold/despliegue reemplaza Pages automáticamente.
- Excepciones al estándar ALESAM: Vite sustituye Next.js; backend, Supabase, Redis e IA aplazados por ausencia de necesidad inicial. TanStack Query al aparecer estado remoto real; MapLibre al elegir proveedor. Sin Capacitor hasta validación de la vía nativa.
- Sin secretos privados en variables VITE_* ni datos reales en fixtures/Git; bundle de producción sólo assets.
- No perder cambios locales ni archivos de documentación al inicializar el proyecto. OpenCode + Big Pickle principal, Cursor sólo si hace falta.
