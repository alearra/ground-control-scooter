# Estado actual

Fecha: 2026-10-19.

## Preparado

Repositorio público y documentación fundacional. OpenCode + Big Pickle como herramienta principal; Cursor si hace falta. ChatGPT asume AI Product Manager. Roadmap de diez fases con 60 tareas creadas en GitHub Issues (#1–#60).

## Estado de producto

Sin app implementada, scaffold, stack final o conexión Xiaomi verificada. F0 es el trabajo activo de planificación; las tareas de hardware siguen pendientes.

## Seguimiento

[Backlog](backlog.md) e [Issues](https://github.com/alearra/ground-control-scooter/issues). [GitHub Project](https://github.com/users/alearra/projects/6) creado y verificado: 60 items (#1–#60), #7 en Done y 59 en Backlog, con Phase, Priority y GC ID cargados; Evidence en #7. [Detalle](project-setup.md). Vistas Board/Roadmap/Current phase pendientes de UI. Prioridad inicial por fase validada por el AI PM; revisar al cerrar F0.

GC-007 (#7): Done: repositorio e instrucciones preparados, decisiones registradas y documentación verificada en el commit 0eb9aeb; issue cerrada tras revisión documental. No equivale a cerrar F0. GC-001/002: **abiertas**, con [inventario](discovery/device-inventory.md) y [matriz de capacidades](discovery/capability-matrix.md) integrados en main (PR #62, squash f4f41d0). Datos declarados recibidos: iPhone 11, iOS 27.0.1, Safari, orientación vertical, Xiaomi Home V11.8.204 / Argentina y código DDHBC01xb. Firmware informado: 2.7.1_0112.0066. Soporte disponible y vertical confirmado; pendiente versión exacta de Safari. Ninguna capacidad física validada. [Sonda de capacidades iPhone](discovery/iphone-probe-guide.md) (GC-004) preparada, **sin ejecutar**.

## Próxima acción

Revisión AI PM realizada e integrada en main (PR #61, squash 3c583c8). [Inventario de discovery](discovery/device-inventory.md) integrado en main con la declaración de Alejandro (PR #62, squash f4f41d0). Firmware recibido: 2.7.1_0112.0066. Soporte disponible y vertical confirmado. Siguiente: publicar la [sonda de capacidades iPhone](discovery/iphone-probe-guide.md) por HTTPS y ejecutarla en el iPhone 11 para obtener evidencia de GC-004 y avanzar GC-001. Registrar capacidades como desconocidas hasta GC-003/004. No cerrar esas issues sin datos reales, no elegir stack ni crear la app antes de F0.
