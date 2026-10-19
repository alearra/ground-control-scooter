# Primera base Next.js — Ground Control

Ejecuta en OpenCode + Big Pickle. **Versión vigente: Next.js**, elegida explícitamente por Alejandro para uniformidad con ALESAM y evolución cercana a plataforma con backend. La propuesta Vite/ADR-0001 está superada. No ejecutes instrucciones anteriores de scaffold Vite.

Objetivo único: base Next.js App Router y layout provisional del cockpit. No implementar recorridos, mapas reales, integración Xiaomi, cámara o backend de negocio completo. El trabajo reversible y las verificaciones de este alcance están autorizados; no pidas otra confirmación para comenzar.

## 1. Sincronizar y cargar decisiones vigentes

git fetch y revisión de árbol local; conserva cambios ajenos. Lee AGENTS.md, docs/cockpit-experience.md, docs/architecture.md, docs/adr/0002-nextjs-platform.md y RULES.md desde el PR #66 actualizado (rama docs/initial-architecture).

Revisa el diff/head real de #66 y verifica que la arquitectura vigente sea Next.js. Si sigue abierto, sincroniza su rama sin force push y haz squash merge sólo si el diff permanece dentro de documentación/prompt de este alcance y no hay conflictos de producto inesperados. Su integración documental está autorizada. Si ya está integrado, no lo repitas.

No integrar otros PRs por asociación ni revivir el estado antiguo de la sonda. Si ya comenzaste un scaffold Vite siguiendo el prompt anterior, conserva los cambios en una rama y adapta únicamente esa base a Next.js en este trabajo, sin reset destructivo; informa qué se migró. Si hay trabajo de usuario fuera de alcance, preservarlo y reportar la separación.

## 2. Scaffold mínimo y seguro

Nueva rama feature/nextjs-foundation desde main actualizado, o rama equivalente existente si contiene este mismo trabajo.

Next.js **16.x estable** App Router + React compatible + TypeScript strict + Tailwind CSS v4 + Biome. Verifica Node/engines y versiones efectivas antes de instalar; npm y un package-lock reproducible. Elige configuración de Biome, no ESLint/Prettier adicionales. No usar Pages Router ni instalar Vite. Turbopack según soporte estable del framework; no flags experimentales por costumbre.

Inicializa sin borrar README/docs/prompts/experiments/workflows. Si usas create-next-app, hazlo en temporal y copia sólo archivos necesarios; su AGENTS.md generado no reemplaza las reglas propias. src/app/layout.tsx y page.tsx para composición; src/features/cockpit para UI; shared sólo para reutilización real.

Server Components por defecto; un límite 'use client' para cockpit interactivo/paneles. No leer navigator/window/IndexedDB durante render SSR. Reloj y presencia de APIs se inicializan tras montar con placeholders estables. Zustand sólo si hay estado compartido real. No instalar aún Dexie, Zod, MapLibre, Supabase, Drizzle, Redis, IA o Capacitor sólo por figurar en arquitectura.

## 3. Experiencia inicial y límites del backend

Cinco regiones verticales: barra superior, área del vehículo, mapa, barra inferior y panel contextual. Tokens semánticos propios. Estado inicial honesto: sin viaje, sin ruta, velocidad no disponible, batería no registrada. Mapa placeholder, sin falsa navegación. Accesos provisionales navegación/vehículo/misiones/aplicaciones; panel abre/cierra sin recargar, foco y cierre accesibles.

No iniciar GPS ni pedir ubicación/Bluetooth; no almacenar coordenadas. No implementar potencia, percepción ni cifras de demo como datos reales. Diseño provisional para validar F1, no diseño final completo.

Backend Next.js por Route Handlers y servicios server-only por feature cuando exista una función que lo requiera. En este PR no inventes login, endpoints vacíos, esquema DB o sincronización. Supabase/Auth/Postgres + Drizzle quedan preparados por decisión, no provisionados. Nunca secretos en NEXT_PUBLIC_*.

No configurar output:'export' ni basePath heredado de la sonda. La app tendrá runtime Next.js apto en Vercel/Node, por desplegar después; Pages continúa sirviendo únicamente la sonda actual. No crear cuentas, recursos ni cambiar .github/workflows/pages.yml en este scaffold.

## 4. Verificación

Scripts: dev (next dev), build (next build), start (next start), typecheck (tsc explícito), lint/check Biome. No usar next lint si no existe. Ejecuta npm ci, typecheck, lint y build; comprueba arranque/SSR e hidratación sin errores en entorno disponible. next start es para el build normal de runtime, no para un export estático.

Mantén node --test experiments/iphone-capability-probe-tests/probe.test.mjs funcionando. No modifiques la sonda para acomodar el scaffold. Comprueba layout vertical y apertura/cierre de paneles con navegador disponible; emulación no es Safari físico. Si no hay navegador, reporta limitación y no inventes pruebas/capturas. CI de PR puede verificar typecheck/lint/build sin desplegar.

No crear una suite que copie markup. Añadir pruebas de dominio al existir lógica real. No instalar framework de tests pesado sólo para estados vacíos.

## 5. Entrega

README con stack real, versión Node y comandos; preservar enlaces previos. current-status indica qué existe y qué sigue pendiente. Abre PR de código vinculando #13/GC-020 y #8/GC-010 como alcance parcial. No cerrar tareas completas ni GC-003/004 por este scaffold.

No merge/deploy del nuevo PR de código. Devuelve hasta cinco puntos: PR/commit, comportamiento visible, versiones/verificaciones, pendientes y una siguiente acción de revisión AI PM. No ejecutes el resto del roadmap.

Fuentes oficiales: https://nextjs.org/docs/app/getting-started/installation y https://nextjs.org/docs/app/getting-started/server-and-client-components. Decisión canónica: ADR-0002.
