# ADR-0001 — Cockpit web local-first con adaptadores

Fecha: 2026-10-19. Estado: **superado por ADR-0002** el 2026-10-19. Se conserva como historial de la propuesta React/Vite; no implementarla. El enfoque de datos locales y adaptadores permanece vigente, el framework elegido es Next.js.

## Contexto

Alejandro autorizó pasar a arquitectura tras incorporar requisitos del cockpit (#65 integrado). iPhone 11/Safari vertical; GPS y Wake Lock observados, Web Bluetooth ausente en la prueba. Quiere desarrollo ágil con OpenCode + Big Pickle y stack habitual adaptable.

## Decisión

React + Vite + TypeScript strict; Tailwind v4; Zustand cuando se comparte estado. IndexedDB/Dexie para persistencia en su etapa. MapLibre para render cuando haya proveedor. Web estática primero, PWA después. Adaptadores de teléfono/manual y contrato para futura telemetría; dominio independiente de React y conexión.

## Alternativas

| Opción | Evaluación |
|---|---|
| Next.js fullstack desde el inicio | Válido, pero este cockpit personal no necesita SSR/SEO ni backend inicial; más superficie operativa |
| App nativa completa desde cero | Da acceso a capacidades nativas, pero añade herramientas/distribución y no resuelve sola protocolo Xiaomi |
| SPA local-first preparada para adaptadores | Elegida: útil en primer plano y permite evaluar native bridge sin reemplazar dominio/UI |
| Vanilla para toda la app | Apropiado para la sonda; composición de cockpit, paneles y estados justifica React en producto |

## Consecuencias

Menos servicios iniciales; privacidad y funcionamiento local. Backend/sync no incluidos. Borrado del navegador/origen puede perder datos; requiere backup/origen y recuperación. PWA no garantiza background/BLE. La integración Xiaomi sigue pendiente de una vía real; posible Capacitor se valida con otro ADR. Proveedor de mapas y costos abiertos: GC-006 no completada.

## Excepciones al stack habitual

Vite sustituye Next.js para esta interfaz. No Supabase/Fastify/Redis/IA/TanStack Query por defecto. Mantener TypeScript, features, Tailwind, Biome y pruebas por riesgo. Dependencias por necesidad y versiones compatibles fijadas en lockfile. Detalles: [architecture.md](../architecture.md).


## Sustitución

Alejandro eligió explícitamente Next.js para priorizar uniformidad con ALESAM y evolución cercana a plataforma con backend. [ADR-0002](0002-nextjs-platform.md) es la decisión vigente. La comparación previa y el stack Vite de este ADR son históricos.
