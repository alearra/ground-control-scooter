# Estado actual — Ground Control

Actualización: 2026-10-19, corrección de persistencia del incremento F1 (PR #68).

## Producto y entrega

PR #65 integrado: cockpit con cinco regiones, jerarquía visual y tres conceptos de energía. [Especificación](cockpit-experience.md). Alejandro autorizó avanzar a arquitectura; la pausa previa quedó superada.

Sonda publicada por PR #63 (80db320): https://alearra.github.io/ground-control-scooter/. No es todavía el cockpit ni una integración Xiaomi. PR #64 documental de publicación permanece pendiente de conciliación; no usar sus textos anteriores como estado más reciente.

Base provisional del cockpit integrada por **squash merge del PR #67** (commit `77e6735`, head verificado `187c90e`): Next.js 16 App Router con las cinco regiones (barra superior, área del vehículo, mapa, barra inferior, panel contextual) y estado inicial vacío y explícito. Sólo lectura de presencia de APIs tras montar; sin GPS, ubicación, Bluetooth ni persistencia. La sonda sigue publicada por Pages, que no cambió.

Tras la revisión del AI PM, el PR #67 aplicó tres correcciones (commit 8c008c2): la barra superior etiqueta presencia de API y funciones inactivas en tono neutro y declara la conectividad como informada por el navegador; el área del vehículo separa avisos de app de «Diagnóstico del scooter: no disponible»; y el panel contextual dejó de superponerse a la barra inferior, reservando espacio real sin altura supuesta. Informe: [revisión 2026-10-19](reviews/2026-10-19-nextjs-foundation.md).

Incremento F1 de jerarquía vertical (rama `feature/cockpit-vertical-hierarchy`, **PR #68 en revisión, sin merge**): compacta el cockpit y valida la vertical. La barra superior queda con hora + conectividad breve; el inventario de APIs y sus explicaciones se trasladan a «Estado del sistema» dentro del panel Aplicaciones. El área del vehículo pasa a instrumento persistente **hermano de `main`** (velocidad dominante, batería secundaria y resumen que separa avisos de app de diagnóstico); `main` contiene sólo mapa/panel y es la única región desplazable. Tras la revisión del AI PM se corrigió que `VehicleArea` seguía dentro de `main`, se eliminó el recorte silencioso del panel (`min-h-56`, sin `overflow-hidden`), los textos pequeños pasaron a rem y el ancho mínimo de accesos a `[44px]` absoluto. Verificación vigente: documento constreñido a 390 CSS px con altura de viewport 844 y 660, Firefox headless + geckodriver, **91/91 PASS** (incluye scroll forzado con instrumentos inmóviles y zoom de texto al 200 %), más typecheck, Biome, build, HTTP 200 y sonda 15/15. El 102/102 anterior corresponde al head `185d18c` y se conserva como resultado histórico, no como ejecución nueva. Informe: [revisión 2026-10-19](reviews/2026-10-19-cockpit-vertical-hierarchy.md). Sigue sin sensores, servicios, merge ni deploy; no cierra F1.

## Evidencia física disponible

JSON aportado por Alejandro: HTTPS; Geolocation=true, bluetooth=false, wake_lock=true; 71 callbacks GPS sin errores, 3 concesiones y 2 liberaciones Wake Lock. Ningún callback recibido con página hidden; intervalos ocultos de 33,835 y 9,652 s sin identificar condición. La prueba sustenta GPS visible, no continuidad de captura con pantalla bloqueada. No se exige otra prueba al usuario ahora; los límites quedan explícitos.

iPhone 11, iOS 27.0.1 declarado, Safari, soporte vertical disponible. Xiaomi Home V11.8.204 / Argentina, Xiaomi 6 Ultra, código DDHBC01xb, firmware 2.7.1_0112.0066. Sin serie/MAC/cuenta en este repo. Inventario: [device-inventory](discovery/device-inventory.md).

## Arquitectura seleccionada para iniciar

[Arquitectura](architecture.md), [ADR-0002](adr/0002-nextjs-platform.md) y [RULES](../RULES.md): **Next.js 16.x App Router + React + TypeScript**, por decisión explícita de Alejandro: uniformidad con ALESAM y evolución cercana a plataforma con backend. Tailwind; datos locales y adaptadores GPS/manual/Xiaomi futuro. IndexedDB/Dexie y MapLibre por etapas. Backend Next.js preparado por diseño, sin endpoints implementados todavía. Capacitor no seleccionado/instalado.

La elección del framework Next.js fue aprobada explícitamente por Alejandro; otros servicios se incorporan según necesidad. Vite queda descartado como base del producto. Existe una base de app provisional con layout y placeholders, verificada con `npm ci`, typecheck, Biome y build; siguen pendientes el proveedor de rutas, el origen definitivo para datos personales y la conexión Xiaomi validada. El despliegue runtime de la app no se configuró todavía: Pages sigue sirviendo únicamente la sonda.

## Seguimiento

[Project #6](https://github.com/users/alearra/projects/6): 60 tareas del roadmap. Sincronizado con escrituras acotadas, reutilizando items y conservando Phase/Priority/GC ID: GC-001/#1 y GC-002/#2 en **Review** (inventario declarado); GC-003/#3 sigue abierta sin cambio; GC-004/#4 en **Review** por evidencia parcial (ya no Blocked); GC-005/#5 y GC-006/#6 en **In progress**; GC-007/#7 **Done**; GC-010/#8 en **Review** (sólo este incremento; flujos pendientes); GC-020/#13 en **In progress** (base integrada, alcance restante: instalación PWA y dependencias). Todos con Evidence enlazada. La API de Projects permitió escribir sin errores; no se creó otro Project ni se duplicaron items.

GC-001/002/003/004 siguen abiertas. GC-003 sin lectura del scooter; GC-004 con evidencia parcial (GPS visible; continuidad con pantalla bloqueada no validada), no cierre. GC-005/006 no se cierran: elegir frontend no resuelve PWA vs puente nativo ni el proveedor de mapas/costos. Se corrigió el cuerpo obsoleto de #8 (enlazaba rama antigua y afirmaba arquitectura pausada).

## Próximo paso

Corrección de #68 entregada (prompt 008): `VehicleArea` fuera de `main`, panel sin recorte silencioso, textos rem y accesos con ancho mínimo absoluto. Evidencia vigente **91/91** con documento de 390 px y altura de viewport 844/660, scroll forzado con instrumentos inmóviles y zoom de texto al 200 %. El 102/102 anterior (head `185d18c`) queda como resultado histórico reportado. Pendiente: revisión del AI PM en el mismo PR #68. GC-010/#8 sigue **Review** y abierta; #13 In progress. Sin merge ni deploy ni prueba física adicional solicitada al usuario.
