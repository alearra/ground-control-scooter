# ADR-0002 — Next.js App Router para uniformidad y evolución de plataforma

Fecha: 2026-10-19. Estado: **aceptado por Alejandro**. Sustituye el framework React/Vite propuesto en ADR-0001.

## Decisión del usuario

«Vamos con nextjs, priorizamos uniformidad con ALESAM y una evolución cercana hacia una plataforma con backend».

## Decisión técnica

Next.js 16.x App Router + React + TypeScript strict. Server Components por defecto; Client Components para cockpit, sensores y estado interactivo. Backend con Route Handlers delgados y servicios por feature. Tailwind v4/Biome y estructura features/shared/app coherentes con ALESAM.

Zustand para UI/sesión, IndexedDB/Dexie para continuidad local cuando se implemente. Supabase/Auth/Postgres/Storage y Drizzle para la futura persistencia/sincronización remota; TanStack Query al existir estado remoto. Redis/IA/Fastify no se instalan por defecto; Fastify requiere justificar un servicio separado.

## Despliegue y consecuencias

Sonda existente continúa en Pages. La app tendrá runtime Next.js en Vercel o servidor Node compatible, origen dedicado y evaluación de costos antes de provisionar. No convertir el backend en export estático para forzar Pages. Scaffold no crea recursos ni reemplaza la sonda.

Mantener adaptadores hardware/dominio y límites de dato observado. Next.js no habilita Web Bluetooth de Safari ni resuelve el protocolo Xiaomi. Native bridge sigue bajo investigación.

## Tradeoff aceptado

Más convenciones y límites cliente/servidor que en una SPA, a cambio de uniformidad con el stack conocido y backend integrado preparado para crecimiento. No se afirma mejor rendimiento por elegir framework.

[Arquitectura vigente](../architecture.md) · [RULES](../../RULES.md).
