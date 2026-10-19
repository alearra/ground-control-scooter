# Estado actual — Ground Control

Actualización: 2026-10-19, inicio de arquitectura.

## Producto y entrega

PR #65 integrado: cockpit con cinco regiones, jerarquía visual y tres conceptos de energía. [Especificación](cockpit-experience.md). Alejandro autorizó avanzar a arquitectura; la pausa previa quedó superada.

Sonda publicada por PR #63 (80db320): https://alearra.github.io/ground-control-scooter/. No es todavía el cockpit ni una integración Xiaomi. PR #64 documental de publicación permanece pendiente de conciliación; no usar sus textos anteriores como estado más reciente.

Base provisional del cockpit en la rama `feature/nextjs-foundation`: Next.js 16 App Router con las cinco regiones (barra superior, área del vehículo, mapa, barra inferior, panel contextual) y estado inicial vacío y explícito. Sólo lectura de presencia de APIs tras montar; sin GPS, ubicación, Bluetooth ni persistencia. La sonda sigue publicada por Pages, que no cambió.

## Evidencia física disponible

JSON aportado por Alejandro: HTTPS; Geolocation=true, bluetooth=false, wake_lock=true; 71 callbacks GPS sin errores, 3 concesiones y 2 liberaciones Wake Lock. Ningún callback recibido con página hidden; intervalos ocultos de 33,835 y 9,652 s sin identificar condición. La prueba sustenta GPS visible, no continuidad de captura con pantalla bloqueada. No se exige otra prueba al usuario ahora; los límites quedan explícitos.

iPhone 11, iOS 27.0.1 declarado, Safari, soporte vertical disponible. Xiaomi Home V11.8.204 / Argentina, Xiaomi 6 Ultra, código DDHBC01xb, firmware 2.7.1_0112.0066. Sin serie/MAC/cuenta en este repo. Inventario: [device-inventory](discovery/device-inventory.md).

## Arquitectura seleccionada para iniciar

[Arquitectura](architecture.md), [ADR-0002](adr/0002-nextjs-platform.md) y [RULES](../RULES.md): **Next.js 16.x App Router + React + TypeScript**, por decisión explícita de Alejandro: uniformidad con ALESAM y evolución cercana a plataforma con backend. Tailwind; datos locales y adaptadores GPS/manual/Xiaomi futuro. IndexedDB/Dexie y MapLibre por etapas. Backend Next.js preparado por diseño, sin endpoints implementados todavía. Capacitor no seleccionado/instalado.

La elección del framework Next.js fue aprobada explícitamente por Alejandro; otros servicios se incorporan según necesidad. Vite queda descartado como base del producto. Existe una base de app provisional con layout y placeholders, verificada con `npm ci`, typecheck, Biome y build; siguen pendientes el proveedor de rutas, el origen definitivo para datos personales y la conexión Xiaomi validada. El despliegue runtime de la app no se configuró todavía: Pages sigue sirviendo únicamente la sonda.

## Seguimiento

[Project #6](https://github.com/users/alearra/projects/6): 60 tareas del roadmap, GC-007 completada. No se reconsultaron todos sus estados en esta actualización; no afirmar que las demás siguen en Backlog (GC-004 fue reportada Blocked a la espera de prueba, y ahora tiene evidencia parcial).

GC-001/002/003/004 siguen abiertas según último estado reportado. GC-003 sin lectura del scooter; GC-004 evidencia parcial recibida, no cierre. GC-005/006 no se cierran al elegir frontend: la vía Xiaomi/proveedor/costos siguen pendientes.

## Próximo paso

Revisión del AI PM sobre el PR de la base Next.js: confirmar alcance, límites honestos y verificaciones; luego decidir próximos pasos (proveedor de mapas, integración Xiaomi, despliegue runtime) sin cerrar GC-003/GC-004 por este scaffold.
