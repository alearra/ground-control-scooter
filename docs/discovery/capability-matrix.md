# Matriz de capacidades — GC-001 / GC-002

Fecha: 2026-10-19. Estado: **sin resultados de prueba**. Todo lo no probado figura como «Desconocido».

Leyenda: Verificado · Parcial · No soportado · **Desconocido**. Solo se usa «Desconocido» hasta tener prueba real.

Regla: no se declara soporte del Xiaomi 6 Ultra sin evidencia. La documentación de otras variantes no se traslada.

| Capacidad | Plataforma / vía | Evidencia disponible | Resultado | Bloqueo |
|---|---|---|---|---|
| BLE (lectura GATT) | Web Bluetooth desde el browser del teléfono | [Acceso GATT documentado por Chrome](https://developer.chrome.com/docs/capabilities/bluetooth); [compatibilidad limitada entre navegadores](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API#browser_compatibility); [Scooter Link lista el 6 Ultra como experimental de lectura](https://github.com/desperado0044/xiaomi-scooter-link#supported-models) | Desconocido | Falta teléfono/browser real, emparejamiento y lectura propia del 6 Ultra |
| Batería % | Xiaomi BLE (o vía validada) | [Xiaomi Home permite consultar datos](https://www.mi.com/latin-es/product/xiaomi-electric-scooter-6-ultra/); campos del 6 Ultra sin verificar | Desconocido | Falta comparar con Xiaomi Home en varios niveles de carga |
| Odómetro total | Xiaomi BLE (o vía validada) | Igual que batería; unidad y escala sin verificar | Desconocido | Falta unidad, escala, persistencia y contraste con la app |
| GPS en primer plano | Geolocation API del browser | [MDN Geolocation](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API); no es GPS del scooter | Desconocido | Falta prueba real del teléfono/browser |
| Captura en segundo plano | Web app en el teléfono | Comportamiento no garantizado por la API; sin prueba | Desconocido | Falta probar suspensión y retorno desde segundo plano |
| Pantalla bloqueada | Web app / bridge | Sin evidencia; depende de la plataforma | Desconocido | Falta prueba con pantalla bloqueada |
| Wake lock (mantener activo) | Screen Wake Lock / alternativa | API no confirmada en el equipo; sin prueba | Desconocido | Falta verificar disponibilidad y comportamiento real |

## Datos Xiaomi objetivo

La [matriz de datos de la integración Xiaomi](../xiaomi-integration.md) mantiene todos los campos como «pendiente de verificación 6 Ultra» (batería y odómetro P0; velocidad y autonomía P1; resto P2). No se duplica aquí para evitar dos fuentes de verdad.

## Pendientes para completar la matriz

1. Datos del teléfono y de Xiaomi Home del [inventario](device-inventory.md).
2. Prueba física de lectura con el scooter detenido.
3. Evidencia anonimizada por capacidad y decisión de arquitectura de F0.
