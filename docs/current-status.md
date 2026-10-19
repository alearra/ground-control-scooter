# Estado actual — Ground Control

Actualización: 2026-10-19, inicio de arquitectura.

## Producto y entrega

PR #65 integrado: cockpit con cinco regiones, jerarquía visual y tres conceptos de energía. [Especificación](cockpit-experience.md). Alejandro autorizó avanzar a arquitectura; la pausa previa quedó superada.

Sonda publicada por PR #63 (80db320): https://alearra.github.io/ground-control-scooter/. No es todavía el cockpit ni una integración Xiaomi. PR #64 documental de publicación permanece pendiente de conciliación; no usar sus textos anteriores como estado más reciente.

## Evidencia física disponible

JSON aportado por Alejandro: HTTPS; Geolocation=true, bluetooth=false, wake_lock=true; 71 callbacks GPS sin errores, 3 concesiones y 2 liberaciones Wake Lock. Ningún callback recibido con página hidden; intervalos ocultos de 33,835 y 9,652 s sin identificar condición. La prueba sustenta GPS visible, no continuidad de captura con pantalla bloqueada. No se exige otra prueba al usuario ahora; los límites quedan explícitos.

iPhone 11, iOS 27.0.1 declarado, Safari, soporte vertical disponible. Xiaomi Home V11.8.204 / Argentina, Xiaomi 6 Ultra, código DDHBC01xb, firmware 2.7.1_0112.0066. Sin serie/MAC/cuenta en este repo. Inventario: [device-inventory](discovery/device-inventory.md).

## Arquitectura seleccionada para iniciar

[Arquitectura](architecture.md), [ADR-0001](adr/0001-local-first-web-cockpit.md) y [RULES](../RULES.md): React + Vite + TypeScript; Tailwind; diseño local-first y adaptadores GPS/manual/Xiaomi futuro. IndexedDB/Dexie y MapLibre por etapas. Backend y Capacitor no instalados ni comprometidos todavía.

Esta es una selección técnica del AI PM dentro de la autorización de avanzar; no implica que cada dependencia haya sido aprobada individualmente por Alejandro. No hay scaffold de app, proveedor de rutas, origen definitivo para datos personales ni conexión Xiaomi validada.

## Seguimiento

[Project #6](https://github.com/users/alearra/projects/6): 60 tareas del roadmap, GC-007 completada. No se reconsultaron todos sus estados en esta actualización; no afirmar que las demás siguen en Backlog (GC-004 fue reportada Blocked a la espera de prueba, y ahora tiene evidencia parcial).

GC-001/002/003/004 siguen abiertas según último estado reportado. GC-003 sin lectura del scooter; GC-004 evidencia parcial recibida, no cierre. GC-005/006 no se cierran al elegir frontend: la vía Xiaomi/proveedor/costos siguen pendientes.

## Próximo paso

Ejecutar [prompts/005-web-foundation.md](../prompts/005-web-foundation.md): integrar la documentación de arquitectura tras verificar su PR y preparar un scaffold mínimo con las cinco regiones, sin datos ficticios en vivo ni despliegue que reemplace la sonda. Luego revisión del AI PM; no implementar todas las fases.
