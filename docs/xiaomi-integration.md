# Integración de datos Xiaomi Home / Xiaomi 6 Ultra

Investigación documental: 2026-10-19. Estado: pendiente de prueba en el equipo de Alejandro. Este documento registra viabilidad y decisiones de producto; implementación y protocolo detallados se documentarán en este repo técnico.

## Requisito

Alejandro pide integrar los datos de Xiaomi Home. El objetivo es disponer de datos reales de su scooter en Ground Control. Diferenciar dos vías: sincronizar con Xiaomi Home/nube e interoperar directamente con el scooter por BLE. La segunda puede aportar las mismas variables sin leer la base interna de Xiaomi Home.

## Evidencia y alcance

| Fuente primaria | Hallazgo | Qué no demuestra |
|---|---|---|
| [Xiaomi 6 Ultra oficial](https://www.mi.com/latin-es/product/xiaomi-electric-scooter-6-ultra/) | Xiaomi Home permite consultar datos y configurar funciones del scooter | No documenta una API pública general para esta webapp |
| [Integración oficial Xiaomi para Home Assistant](https://github.com/XiaoMi/ha_xiaomi_home) | Hay integración MIoT para dispositivos soportados | No equivale a soporte del 6 Ultra |
| [Comentario de colaboradora en issue #343, 2024-12-23](https://github.com/XiaoMi/ha_xiaomi_home/issues/343#issuecomment-2558733696) | Para el caso de scooters consultado, indica acceso BLE GATT y ausencia de datos en nube/gateway; no importables por esa integración | No es una prueba actual de cada variante regional del 6 Ultra |
| [Scooter Link, modelos soportados](https://github.com/desperado0044/xiaomi-scooter-link#supported-models) | Incluye 6 Ultra como experimental de lectura; tablas de especificación pública sin prueba en dispositivo real | No confirma campos, unidades, estabilidad ni compatibilidad con nuestro equipo |
| [Chrome: Web Bluetooth](https://developer.chrome.com/docs/capabilities/bluetooth) | Acceso GATT en plataformas compatibles, HTTPS y gesto del usuario | No acceso universal ni conexión automática silenciosa |
| [MDN: Web Bluetooth](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API#browser_compatibility) | Compatibilidad limitada entre navegadores | No asumir soporte en Safari/iPhone ni Firefox |
| [MDN: Geolocation](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) | API de ubicación del teléfono | No es GPS del scooter ni garantía de ejecución continua en segundo plano |

Conclusión provisional: priorizar una prueba BLE de lectura; investigar nube como alternativa, sin prometer que contiene telemetría. Un login Xiaomi para obtener metadatos o claves no implica acceso cloud a los viajes.

## Alternativas, por orden de evaluación

1. **Acceso oficial/documentado o exportación:** verificar si existe para modelo y región. Si existe, documentar campos, autorización, límites y actualización.
2. **BLE directo desde navegador compatible:** probar con el equipo real. Validar autenticación y propiedades; no trasladar tablas de otro Xiaomi sin comprobarlas.
3. **Puente nativo móvil:** si el teléfono/browser elegido no soporta BLE o ejecución necesaria, evaluar una envoltura o companion con BLE nativo que comparta datos normalizados con el frontend. Web sigue siendo interfaz principal.
4. **Gateway local:** experimento posible para sincronizar en casa; por sí solo no resuelve telemetría durante viajes.
5. **Entrada manual/importación verificada:** modo de continuidad mientras se resuelve acceso; no se cuenta como integración automática completa.

La elección del puente, framework o backend no está aprobada todavía. No se ha autenticado a Xiaomi ni probado lectura real desde este proyecto.

## Matriz de datos objetivo

Todos los campos Xiaomi siguientes tienen estado «pendiente de verificación 6 Ultra».

| Dato | Prioridad | Validación requerida |
|---|---|---|
| Modelo, variante y firmware | P0 | Coincidencia con identificación en Xiaomi Home |
| Batería % | P0 | Comparación detenido en varios niveles de carga |
| Odómetro total | P0 | Unidad, escala, persistencia y comparación con app |
| Velocidad del scooter | P1 | Diferenciar del GPS, escala y frecuencia |
| Autonomía reportada | P1 | Etiquetar estimación Xiaomi y distinguir la propia |
| Estado de carga | P1 | Lecturas conectado/desconectado al cargador |
| Modo de conducción | P1 | Correspondencia semántica, sólo lectura inicialmente |
| Temperatura, voltaje, corriente | P2 | Existencia, unidad, escala y signo |
| Fallos/diagnóstico | P2 | Existencia y significado documentado |
| Ciclos/salud de batería | P2 | No inferir que existen ni usar batería % como salud |

Luces, bloqueo y cambios de modo son funciones futuras condicionadas a soporte validado. No se investigan escrituras de control como requisito de la primera prueba; una autenticación puede requerir escrituras de transporte BLE sin equivaler a comandos del vehículo.

## Protocolo de validación fase 0

- Registrar teléfono, OS/browser, versión Xiaomi Home, región, modelo interno, variante y firmware. Nunca subir MAC, número de serie, tokens, claves o credenciales.
- Crear inventario de funciones observadas y comprobar si Xiaomi ofrece exportación o API aplicable.
- Revisar licencia y documentación del candidato antes de reutilizar código; Scooter Link usa PolyForm Noncommercial 1.0.0. Su uso comercial no está permitido por esa licencia; una posible evolución comercial exige resolver dependencia o autorización.
- Probar emparejamiento y autenticación con el scooter propio, detenido; conservar Xiaomi Home como referencia. Medir si las apps pueden coexistir o hay que desconectar una.
- Leer propiedades, registrar unidad, escala, frecuencia, timestamp y evidencia anonimizada. Comprobar batería y odómetro primero.
- Probar desconexión, reconexión, reinicio de app, red ausente, pantalla bloqueada y retorno desde segundo plano.
- Probar captura GPS por separado. No asumir soporte sólo por existir la API.
- Resultado obligatorio: matriz por teléfono/modelo/firmware con «verificado», «parcial», «no soportado» o «desconocido» y decisión de arquitectura.

Criterio propuesto de éxito: batería y odómetro consistentes con Xiaomi Home, cinco reconexiones de prueba y una sesión de lectura de al menos 15 minutos sin pérdidas no explicadas. Si sólo un subconjunto existe, registrar explícitamente el alcance; no declarar integración completa.

## Contrato de datos propuesto

Adaptadores separados: manual, teléfono, Xiaomi cloud si se valida y Xiaomi BLE/puente si se valida. Cada muestra conserva vehículo, métrica, valor, unidad, fuente, captured_at, received_at y calidad. Rechazar valores fuera de rango; mantener identidad de firmware y no extrapolar capacidades de otros modelos.

No inventar endpoints, UUIDs, claves, escalas ni soporte. Guardar secretos en almacenamiento seguro del dispositivo o backend según arquitectura; nunca en Git ni logs. Distinguir desconexión de batería cero. La app debe seguir operando sin el adaptador.

## Bloqueo actual

La investigación documental está hecha; no hay acceso físico al scooter ni al teléfono en esta sesión. La integración efectiva requiere esa prueba. El requisito sigue en el roadmap y no se sustituye silenciosamente por entrada manual.
