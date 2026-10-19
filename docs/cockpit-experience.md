# Cockpit — organización de pantalla e información

Actualización: 2026-10-19. Requisitos de producto aportados por Alejandro antes de elegir arquitectura. Esta especificación define experiencia y comportamiento; no elige framework, proveedor de mapas ni método de conexión.

## Tres resultados

**Orden visual:** pocos elementos compiten por atención; velocidad, maniobra y alerta relevante dominan según contexto.
**Coherencia:** módulos comparten unidades, iconos, colores semánticos, lenguaje de estados e interacción.
**Evolución por software:** pantallas y comportamientos pueden cambiar conservando convenciones, preferencias y consistencia de datos. No mover controles esenciales de forma sorpresiva durante una misión; presentar cambios relevantes estando detenido.

## Cinco regiones de la pantalla

| Región | Información/acciones | Pregunta que responde |
|---|---|---|
| Área del vehículo | Velocidad, visualización del scooter, energía, estados y avisos relevantes | ¿Qué está pasando? |
| Mapa | Destino, recorrido, posición, próxima indicación | ¿Adónde voy? |
| Barra inferior | Aplicaciones y accesos rápidos compartidos | ¿Qué puedo hacer rápidamente? |
| Barra superior | Hora, conectividad y contexto de sensores/datos | ¿En qué estado está el sistema? |
| Paneles superpuestos | Controles y ajustes contextuales | ¿Cómo configuro esto? |

Para el iPhone vertical, la propuesta de diseño es: barra superior compacta, área de conducción en la parte alta, mapa con el espacio central disponible y barra inferior anclada abajo. Es una distribución por validar en F1; no copiar dos columnas de una pantalla de auto. Al navegar el mapa gana espacio, manteniendo velocidad y alerta importante legibles. Sin navegación, la visualización del vehículo y el resumen pueden ganar espacio. No fijar porcentajes de altura antes del prototipo.

Primer recorte implementado en F1 (incremento parcial, 2026-10-19): barra superior con hora y conectividad breve; el inventario de APIs y sus explicaciones pasan a un detalle «Estado del sistema» dentro del panel Aplicaciones. El área del vehículo queda como instrumento persistente (velocidad dominante, batería secundaria y resumen que separa avisos de app del diagnóstico del scooter) fuera del área desplazable; con panel abierto se conservan instrumentos y barra de accesos, y el detalle se desplaza dentro de su región. El mapa sin panel mantiene espacio reconocible. Pendiente: flujos de Hangar/misiones/debrief, wireframes parado/en marcha, iconos definitivos y validación en Safari físico.

La barra inferior conserva accesos estables; propuesta inicial: Navegación, Vehículo, Misiones y Aplicaciones. Los iconos definitivos se validan en F1. Configuraciones menos frecuentes viven en paneles; no saturar con todos los módulos de la bitácora durante la marcha.

«Climatización» proviene de la referencia automotriz de Alejandro. El scooter no tiene un sistema HVAC integrado a este alcance; no ofrecer controles de temperatura inexistentes. El contexto meteorológico previsto en F7 puede tener un acceso informativo, claramente diferente de controlar climatización.

## Información durante la conducción

| Indicador solicitado | Uso | Fuente y comportamiento |
|---|---|---|
| Velocidad actual | Leer velocidad terrestre de un vistazo | GPS del teléfono inicialmente; BLE si se valida. Mostrar fuente, antigüedad/calidad y no interpretar ausencia como 0 |
| Límite de velocidad detectado | Comparar velocidad con una referencia de la vía | Proveedor de mapas/señalización verificable por elegir; cámara en fase futura si se valida. Mostrar procedencia y vigencia; si es desconocido, indicar desconocido |
| Energía restante | Evaluar batería disponible | Porcentaje observado y fecha/fuente; manual identificado mientras no haya lectura automática |
| Medidor de potencia | Entender demanda instantánea y regeneración | Telemetría eléctrica validada; no fabricar potencia desde el cambio de batería o velocidad GPS |
| Vehículos y elementos detectados | Visualizar parte del entorno percibido | Cámara futura más procesamiento validado; nunca dibujar detecciones como si existieran antes de implementar percepción |
| Testigos y advertencias | Identificar condiciones relevantes o fallas | Alertas propias de app y diagnósticos reales del scooter, separados por origen |
| Estado de asistencias | Identificar qué función está disponible o activa | Sólo funciones implementadas y verificables; distinguir ayuda de software de intervención del vehículo |

### Límite de velocidad

Distinguir límite de la vía, velocidad máxima del scooter y umbral personal de aviso. Un umbral configurado por el usuario no se etiqueta «detectado»; tampoco se trata la velocidad máxima del scooter como límite de la calle. Sin proveedor o lectura fiable, no inventar una señal. Cambios de vía/datos desactualizados deben invalidar o degradar la referencia. La selección del proveedor y cobertura corresponde a GC-006/041; detectar una señal con cámara es parte de la expansión futura.

### Potencia y regeneración

Es potencia instantánea (por ejemplo W o kW), distinta de energía consumida (Wh/kWh). Puede calcularse desde voltaje y corriente sólo si ambos campos, escalas, sincronización y signo se validan. Identificar potencia eléctrica medida/estimada y no presentarla como potencia mecánica del motor. Regeneración sólo cuando el flujo/signo real lo respalde; desacelerar por GPS no prueba regeneración. Un valor ausente/desactualizado no es cero. GC-050 investiga campos; si no existen, el indicador queda no disponible sin bloquear el cockpit GPS.

### Alertas, testigos y asistencias

Colores e iconos coherentes, texto breve y prioridad por relevancia. Propuesta: alerta importante primero, maniobra después y avisos informativos sin competir con ambos. No recrear todos los testigos de un auto ni mostrar fallas de motor que no podamos leer.

Estados de funciones: no disponible, disponible/inactiva, activa, degradada y error. Ejemplos de software: navegación guiada, registro GPS o avisos de reserva. No describirlos como una asistencia que acelera, frena o conduce el scooter. Una asistencia real del vehículo sólo aparece si se conoce su existencia y estado.

### Paneles e interacción

Panel contextual con acción de cierre clara; preservar contexto al volver al mapa. Controles grandes y lectura breve en movimiento; configuración detallada, inputs y exploración de apps durante parada. Una alerta esencial debe seguir accesible al abrir un panel; evitar que el panel oculte toda la información de conducción.

## Tres conceptos de energía, tres etiquetas

| Concepto | Representa | Presentación |
|---|---|---|
| Porcentaje de batería | Energía restante observada respecto de la batería | Batería: X %, con fuente y antigüedad |
| Autonomía indicada | Distancia estimada desde una referencia de consumo | Autonomía estimada: X km, indicando si viene de Xiaomi o de nuestro modelo y su incertidumbre |
| Predicción del viaje | Energía necesaria y restante prevista para el recorrido seleccionado | Consumo previsto y batería estimada al llegar; regreso/reserva cuando corresponde |

Ejemplo meramente ilustrativo: «Batería 62 %», «Autonomía estimada 30 km» y «Llegada prevista 24 %». Son tres datos distintos, no lecturas reales ni objetivos aprobados. No confundir autonomía genérica con poder completar esa ruta.

Con pocos datos, predicción/autonomía muestran un rango o «datos insuficientes». Batería antigua o una carga intermedia deben afectar o invalidar la estimación. No convertir porcentajes a Wh sin capacidad/datos válidos. La reserva es una preferencia separada de las tres magnitudes.

## Cámara y percepción — futuro solicitado

Alejandro pide incorporar a futuro una cámara para detectar vehículos/elementos y visualizar parte del entorno. Queda registrado como dirección futura condicionada, con fecha y fase de implementación por definir; no es requisito del MVP GPS ni del cierre de la investigación actual.

Evaluar ubicación y orientación de cámara, permisos, procesamiento, latencia, batería/temperatura del iPhone, exactitud y limitaciones. Superponer sólo detecciones reales, con estado de percepción y datos obsoletos visibles. La ausencia de detección no significa entorno libre. Un mock de percepción se marca demo y no se muestra como detección real durante un viaje. No implica conducción autónoma ni intervención en frenos/acelerador.

La inferencia no requiere grabar ni subir video por defecto. Si se propone grabación/subida o un hardware distinto, deberá definirse explícitamente el flujo de producto antes de implementarlo. No crear infraestructura de visión en esta revisión documental.

## Trazabilidad al roadmap

| Trabajo | GC-ID / fase |
|---|---|
| Wireframes de las cinco regiones, paneles y variantes parado/en marcha | GC-010/011/013/014 — F1 |
| Estados, fuentes, vigencia y datos ausentes | GC-012/022 — F1/F2 |
| Cockpit con velocidad y avisos de datos | GC-030/031/033/036 — F3 |
| Límite de vía, mapa, maniobras y procedencia | GC-006/041/042/043 — F0/F4 |
| Tres conceptos de energía y potencia/regeneración verificadas | GC-050/052/053/054/055 — F5 |
| Percepción con cámara | Expansión futura solicitada; sin fase/fecha comprometida |

Criterios F1: en vertical se reconocen las cinco regiones, se mantienen visibles velocidad y alerta relevante, las tres magnitudes de energía se distinguen por etiqueta/unidad y los datos sin fuente no aparentan estar activos. La arquitectura Next.js quedó definida por Alejandro en ADR-0002; la validación de experiencia continúa en F1.
