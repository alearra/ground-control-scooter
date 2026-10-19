# Inventario de dispositivo y vehículo — GC-001 / GC-002

Fecha: 2026-10-19. Estado: **parcialmente completado con datos declarados por Alejandro el 2026-10-19**. Sin pruebas de hardware todavía.

Este inventario alimenta la [matriz de capacidades](capability-matrix.md) y la [investigación Xiaomi](../xiaomi-integration.md). No afirma soporte del 6 Ultra: solo registra lo observado.

## Reglas de datos

- No registrar MAC, número de serie, cuenta Xiaomi, claves, tokens ni ubicación.
- No inferir del historial ni de otros modelos. Cada valor lleva fuente o queda «Pendiente».
- La región de la cuenta Xiaomi no es un domicilio; se registra solo el nombre de región.

## 1. Teléfono principal (GC-001)

| Dato | Valor actual | Fuente / cómo se obtiene |
|---|---|---|
| Plataforma (Android / iOS) | iOS | Declaración de Alejandro, 2026-10-19 |
| Marca y modelo | Apple iPhone 11 | Declaración de Alejandro, 2026-10-19 |
| Versión de OS | 27.0.1 (declarada; sin verificación independiente) | Declaración de Alejandro, 2026-10-19 |
| Browser principal y versión | Safari (navegador de Apple); versión exacta pendiente | Declaración de Alejandro, 2026-10-19; dispuesto a evaluar otro navegador |
| Soporte de Web Bluetooth | Desconocido | No evaluar sin el browser real |
| GPS del teléfono disponible | Desconocido | Prueba real; no asumirlo por existir la API |
| Permisos ya concedidos (ubicación/Bluetooth) | Pendiente | Ajustes > Aplicaciones |
| Espacio libre / restricciones relevantes | Pendiente | Solo si afecta la prueba |

## 2. Orientación y soporte de manubrio (GC-001)

| Dato | Valor actual | Fuente / cómo se obtiene |
|---|---|---|
| Orientación de uso prevista (retrato / paisaje) | Retrato / vertical | Decisión de Alejandro, 2026-10-19 |
| Tipo de soporte de manubrio | Pendiente | Foto sanitizada o descripción |
| Altura y ángulo respecto de la vista | Pendiente | Medición o descripción |
| Visibilidad con luz solar directa | Desconocido | Prueba física |
| Uso con guantes / controles táctiles | Desconocido | Prueba física |

## 3. Xiaomi Home y scooter (GC-002)

| Dato | Valor actual | Fuente / cómo se obtiene |
|---|---|---|
| App Xiaomi Home: plataforma | iOS, según contexto de la respuesta | Respuesta de Alejandro, 2026-10-19; confirmar si usa otro teléfono |
| Versión de Xiaomi Home | V11.8.204 | Declaración de Alejandro, 2026-10-19 |
| Región de la cuenta | Argentina | Declaración de Alejandro, 2026-10-19 |
| Modelo comercial | Xiaomi 6 Ultra | Declaración de Alejandro, 2026-10-19 |
| Modelo interno o variante | DDHBC01xb (código informado; conservar grafía original) | Declaración de Alejandro, 2026-10-19; confirmar etiqueta/variante si hace falta |
| Firmware del scooter | 2.7.1_0112.0066 | Declaración de Alejandro, 2026-10-19; sin prueba de compatibilidad |
| ¿Aparece en Xiaomi Home con datos? | Desconocido | Observación en la app |

## 4. Estado de las tareas

- GC-001 (#1): **abierta**, inventario parcial recibido: iPhone 11, iOS declarado 27.0.1, Safari y orientación vertical. Pendientes versión exacta del navegador y tipo de soporte. Pruebas de capacidades se gestionan en GC-003/004; no son requisito para registrar un dato declarado.
- GC-002 (#2): **abierta**, región Argentina, Xiaomi Home V11.8.204, modelo comercial y código informados. Firmware informado: 2.7.1_0112.0066. Inventario mínimo del scooter recibido; pendiente de revisión/cierre con evidencia documental. El código de modelo no se interpreta como firmware.
- No cerrar ninguna hasta validar datos reales y obtener evidencia revisable.
