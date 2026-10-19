# Definición de producto — Ground Control

Actualización: 2026-10-19. Concepto aceptado; detalle de alcance y criterios propuestos para desarrollo.

## Origen y evolución

Alejandro compró un Xiaomi Electric Scooter 6 Ultra y quiere desarrollar una webapp para su uso diario. La idea evolucionó desde registro de viajes, autonomía, mantenimiento y ahorro frente a su Amarok hacia una combinación de sus intereses como developer, aficionado a la aviación y fan de Tesla, Elon Musk y SpaceX.

Se exploraron los nombres Daily Ride y GroundFlight; Ground Control es el nombre de trabajo actual. La aclaración decisiva de Alejandro fue trasladar la experiencia de conducir un Tesla al scooter: el cockpit durante el viaje es central, además de la planificación y las estadísticas.

## Promesa y utilidad

«Ground Control es mi centro de operaciones personal: planifico recorridos, gestiono la energía de mi scooter y convierto cada viaje en datos para el siguiente».

Usuario inicial: Alejandro, en sus trayectos cotidianos, negocios, reuniones y exploración. Debe ser rápido de abrir y útil aunque no haya conexión con el scooter. La instrumentación del vehículo sigue siendo referencia independiente.

## Principios de experiencia

| Inspiración | Traducción al producto |
|---|---|
| Tesla | Vehículo protagonista, estado comprensible, mapa integrado, continuidad entre preparación, marcha y estacionamiento |
| SpaceX | Misiones, estados operativos, telemetría y debrief; identidad propia |
| Aviación | Checklist, rumbo, velocidad terrestre y reserva planificada |
| Developer | Datos propios, módulos reemplazables, simulaciones y evolución mediante versiones |

Diseño propuesto: fondo oscuro, tipografía limpia, alto contraste, transiciones breves y pocos indicadores. Soportar uso bajo sol; modo claro a evaluar. El vehículo ocupa el centro en reposo y el mapa gana espacio en marcha. No depender de un render 3D pesado para operar. Idioma español por defecto, con nombres de estados opcionales en inglés.

## Recorrido completo

1. **Hangar / reposo:** Rover 01, estado de conexión, batería con fecha y fuente, mantenimiento y destinos frecuentes. Casa puede definirse como «Base» sin publicar su ubicación.
2. **Preparar misión:** origen, destino, paradas, regreso opcional, distancia y reserva deseada. Guardar destinos frecuentes y rutas conocidas.
3. **Preflight:** neumáticos, frenos, luces, casco y carga. Checklist configurable y breve.
4. **Ready:** resumen y comienzo explícito. No prometer detección automática de proximidad, arranque o desbloqueo sin verificar capacidades.
5. **Cockpit / en marcha:** velocidad, mapa orientado al avance, próxima maniobra, tiempo, energía estimada de llegada y conectividad. Información legible, sin menús complejos.
6. **Detenido / pausa:** acceso a detalles y pausa/reanudación; confirmar fin para evitar cortar por semáforos o pausas breves.
7. **Estacionar:** guardar ubicación del teléfono como ubicación de estacionamiento, etiquetada como tal; no equivale a seguimiento remoto del scooter.
8. **Debrief:** trazado, distancia, duración, batería consumida cuando haya mediciones válidas, notas de viento/pavimento y comparación histórica.
9. **Bitácora:** recorridos y horas acumuladas, cargas, gastos, mantenimiento y fichas para compartir.

Estados propuestos: draft → preflight → ready → riding ↔ paused → completed; cancelled para misiones abandonadas. La pérdida de BLE, GPS o red no completa automáticamente un viaje.

## Módulos funcionales

| Módulo | Funciones |
|---|---|
| Vehículo | Perfil, alias, imagen, odómetro si disponible, conexión y mantenimiento |
| Misiones | Destinos, circuitos, paradas, reserva, checklist y estados |
| Cockpit | Velocidad GPS o BLE identificada, rumbo válido, mapa e instrucciones |
| Energía | Batería observada, cargas, consumo histórico y predicción con incertidumbre |
| Bitácora | Resumen, notas, filtros, replay y exportaciones |
| Mapa personal | Pavimento malo, calles cómodas, estacionamiento y carga con permiso |
| Costos | Gastos del scooter y ahorro estimado frente a Amarok con supuestos editables |
| Mission Lab | Simular paradas/reserva, comparar consumo, reglas y experimentos |
| Contenido | Tarjeta de misión para historias con ocultamiento de origen/destino sensibles |
| Flota futura | Otros vehículos, dron o sensores, como expansión opcional |

La energía no debe aparentar precisión inexistente: comenzar con consumo observado en porcentaje de batería por km; usar Wh/km sólo si hay capacidad y datos adecuados. Una carga intermedia divide el tramo de cálculo. Con pocos datos, mostrar «datos insuficientes» o un rango conservador; no inventar una predicción. La reserva es configurable: los porcentajes de ejemplos del chat no son valores aprobados.

## Fuentes y honestidad visual

- Teléfono: ubicación, precisión, velocidad GPS cuando exista, rumbo válido y tiempo. Derivar velocidad sólo con muestras válidas; detenido o sin señal no se confunden.
- Scooter: batería, velocidad y otros campos exclusivamente después de validar acceso, escala, unidades y actualización.
- Xiaomi Home: referencia para contrastar lecturas; acceso a su nube o exportación no asumido.
- Usuario: batería manual, gastos, revisión y anotaciones.
- Proveedor externo por elegir: cartografía, rutas e instrucciones; clima/desnivel en etapas posteriores.

Cada dato necesita fuente, timestamp y estado: actual, desactualizado, estimado o no disponible. Un valor manual o de nube no se presenta como telemetría en vivo. Controles no soportados no se muestran como operativos.

## Conducción y límites del producto

Controles grandes, tareas de configuración antes de partir y restricciones de interacción en marcha. Voz opcional a validar en el teléfono. Sin animaciones distractoras ni gamificación que premie velocidad. Sin detección ficticia de autos/peatones, conducción autónoma ni relación con Autopilot/FSD.

La webapp debe degradarse con claridad ante GPS, BLE o red ausentes. Mapas offline completos, ubicación con pantalla bloqueada y BLE en segundo plano requieren evaluación específica; instalar una PWA no los garantiza.

## Criterio de producto logrado

Preparar y registrar un recorrido real con poco esfuerzo, leer el cockpit de un vistazo, conservar el historial y tomar decisiones de energía con datos trazables. La versión personal completa y la integración verificada son objetivos distintos de comercializar.
