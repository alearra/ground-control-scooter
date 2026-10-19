# Inventario de dispositivo y vehículo — GC-001 / GC-002

Fecha: 2026-10-19. Estado: **incompleto — pendiente de datos reales**. Autorizado por Alejandro; sin datos todavía.

Este inventario alimenta la [matriz de capacidades](capability-matrix.md) y la [investigación Xiaomi](../xiaomi-integration.md). No afirma soporte del 6 Ultra: solo registra lo observado.

## Reglas de datos

- No registrar MAC, número de serie, cuenta Xiaomi, claves, tokens ni ubicación.
- No inferir del historial ni de otros modelos. Cada valor lleva fuente o queda «Pendiente».
- La región de la cuenta Xiaomi no es un domicilio; se registra solo el nombre de región.

## 1. Teléfono principal (GC-001)

| Dato | Valor actual | Fuente / cómo se obtiene |
|---|---|---|
| Plataforma (Android / iOS) | Pendiente | Ajustes del teléfono |
| Marca y modelo | Pendiente | Ajustes > Acerca del dispositivo |
| Versión de OS | Pendiente | Ajustes > Acerca del dispositivo |
| Browser principal y versión | Pendiente | Menú «Acerca de» del browser |
| Soporte de Web Bluetooth | Desconocido | No evaluar sin el browser real |
| Nivel mínimo de Android/iOS del equipo | Pendiente | Ajustes del teléfono |
| GPS del teléfono disponible | Desconocido | Prueba real; no asumirlo por existir la API |
| Permisos ya concedidos (ubicación/Bluetooth) | Pendiente | Ajustes > Aplicaciones |
| Espacio libre / restricciones relevantes | Pendiente | Solo si afecta la prueba |

## 2. Orientación y soporte de manubrio (GC-001)

| Dato | Valor actual | Fuente / cómo se obtiene |
|---|---|---|
| Orientación de uso prevista (retrato / paisaje) | Pendiente | Decisión de Alejandro |
| Tipo de soporte de manubrio | Pendiente | Foto sanitizada o descripción |
| Altura y ángulo respecto de la vista | Pendiente | Medición o descripción |
| Visibilidad con luz solar directa | Desconocido | Prueba física |
| Uso con guantes / controles táctiles | Desconocido | Prueba física |

## 3. Xiaomi Home y scooter (GC-002)

| Dato | Valor actual | Fuente / cómo se obtiene |
|---|---|---|
| App Xiaomi Home: plataforma | Pendiente | Teléfono donde está instalada |
| Versión de Xiaomi Home | Pendiente | Ajustes de la app |
| Región de la cuenta | Pendiente | Perfil de Xiaomi Home (solo región) |
| Modelo comercial | Pendiente | Etiqueta / ficha en Xiaomi Home |
| Modelo interno o variante | Pendiente | Pantalla de información del dispositivo |
| Firmware del scooter | Pendiente | Xiaomi Home > info del dispositivo |
| ¿Aparece en Xiaomi Home con datos? | Desconocido | Observación en la app |

## 4. Estado de las tareas

- GC-001 (#1): **abierta**. Falta teléfono/OS/browser y orientación.
- GC-002 (#2): **abierta**. Falta versión/región de Xiaomi Home, modelo interno, variante y firmware.
- No cerrar ninguna hasta validar datos reales y obtener evidencia revisable.
