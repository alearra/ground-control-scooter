# Estado actual — Ground Control

Actualización: 2026-10-19, integración de la base Next.js (squash `77e6735`).

## Producto y entrega

PR #65 integrado: cockpit con cinco regiones, jerarquía visual y tres conceptos de energía. [Especificación](cockpit-experience.md). Alejandro autorizó avanzar a arquitectura; la pausa previa quedó superada.

Sonda publicada por PR #63 (80db320): https://alearra.github.io/ground-control-scooter/. No es todavía el cockpit ni una integración Xiaomi. PR #64 documental de publicación permanece pendiente de conciliación; no usar sus textos anteriores como estado más reciente.

Base provisional del cockpit integrada por **squash merge del PR #67** (commit `77e6735`, head verificado `187c90e`): Next.js 16 App Router con las cinco regiones (barra superior, área del vehículo, mapa, barra inferior, panel contextual) y estado inicial vacío y explícito. Sólo lectura de presencia de APIs tras montar; sin GPS, ubicación, Bluetooth ni persistencia. La sonda sigue publicada por Pages, que no cambió.

Tras la revisión del AI PM, el PR #67 aplicó tres correcciones (commit 8c008c2): la barra superior etiqueta presencia de API y funciones inactivas en tono neutro y declara la conectividad como informada por el navegador; el área del vehículo separa avisos de app de «Diagnóstico del scooter: no disponible»; y el panel contextual dejó de superponerse a la barra inferior, reservando espacio real sin altura supuesta. Informe: [revisión 2026-10-19](reviews/2026-10-19-nextjs-foundation.md).

## Evidencia física disponible

JSON aportado por Alejandro: HTTPS; Geolocation=true, bluetooth=false, wake_lock=true; 71 callbacks GPS sin errores, 3 concesiones y 2 liberaciones Wake Lock. Ningún callback recibido con página hidden; intervalos ocultos de 33,835 y 9,652 s sin identificar condición. La prueba sustenta GPS visible, no continuidad de captura con pantalla bloqueada. No se exige otra prueba al usuario ahora; los límites quedan explícitos.

iPhone 11, iOS 27.0.1 declarado, Safari, soporte vertical disponible. Xiaomi Home V11.8.204 / Argentina, Xiaomi 6 Ultra, código DDHBC01xb, firmware 2.7.1_0112.0066. Sin serie/MAC/cuenta en este repo. Inventario: [device-inventory](discovery/device-inventory.md).

## Arquitectura seleccionada para iniciar

[Arquitectura](architecture.md), [ADR-0002](adr/0002-nextjs-platform.md) y [RULES](../RULES.md): **Next.js 16.x App Router + React + TypeScript**, por decisión explícita de Alejandro: uniformidad con ALESAM y evolución cercana a plataforma con backend. Tailwind; datos locales y adaptadores GPS/manual/Xiaomi futuro. IndexedDB/Dexie y MapLibre por etapas. Backend Next.js preparado por diseño, sin endpoints implementados todavía. Capacitor no seleccionado/instalado.

La elección del framework Next.js fue aprobada explícitamente por Alejandro; otros servicios se incorporan según necesidad. Vite queda descartado como base del producto. Existe una base de app provisional con layout y placeholders, verificada con `npm ci`, typecheck, Biome y build; siguen pendientes el proveedor de rutas, el origen definitivo para datos personales y la conexión Xiaomi validada. El despliegue runtime de la app no se configuró todavía: Pages sigue sirviendo únicamente la sonda.

## Seguimiento

[Project #6](https://github.com/users/alearra/projects/6): 60 tareas del roadmap. Sincronizado con escrituras acotadas, reutilizando items y conservando Phase/Priority/GC ID: GC-001/#1 y GC-002/#2 en **Review** (inventario declarado); GC-003/#3 sigue abierta sin cambio; GC-004/#4 en **Review** por evidencia parcial (ya no Blocked); GC-005/#5 y GC-006/#6 en **In progress**; GC-007/#7 **Done**; GC-010/#8 en **In progress**; GC-020/#13 en **In progress** (base integrada, alcance restante: instalación PWA y dependencias). Todos con Evidence enlazada. La API de Projects permitió escribir sin errores; no se creó otro Project ni se duplicaron items.

GC-001/002/003/004 siguen abiertas. GC-003 sin lectura del scooter; GC-004 con evidencia parcial (GPS visible; continuidad con pantalla bloqueada no validada), no cierre. GC-005/006 no se cierran: elegir frontend no resuelve PWA vs puente nativo ni el proveedor de mapas/costos. Se corrigió el cuerpo obsoleto de #8 (enlazaba rama antigua y afirmaba arquitectura pausada).

## Próximo paso

PR #67 integrado por squash en `77e6735` tras verificar el head `187c90e` (sólo conciliaciones documentales sobre el head aprobado) y re-ejecutar `npm ci`, typecheck, Biome, build y la sonda (15/15). Sin deploy: Pages sigue sirviendo sólo la sonda. #8 y #13 permanecen **abiertas** por alcance pendiente; GC-020 pasó a **In progress**. La prueba interactiva y la sonda siguen como evidencia de OpenCode, sin validación Safari física. Siguiente paso: planificar el siguiente incremento F1 (compactar contenido provisional y validar jerarquía vertical) antes de añadir sensores o servicios; no iniciar otra fase automáticamente.
