# Roadmap 0–100 — Ground Control

Versión: 2026-10-19. Plan propuesto para ejecutar el concepto aceptado. No se ha iniciado implementación.

## Cómo leer el plan

Los intervalos representan orden y alcance de la versión personal completa, no porcentaje actual ni fechas comprometidas. Cada fase requiere evidencia de cierre. La integración Xiaomi se investiga al principio y se entrega tras comprobar viabilidad. «100» significa una versión personal estable con las capacidades soportadas documentadas; expansiones comerciales no son condición de cierre.

Responsable de decisiones y pruebas de campo: Alejandro. La ejecución técnica se realizará con OpenCode + Big Pickle; Cursor sólo si es necesario. ChatGPT actuará como AI Product Manager. No hay presupuesto, calendario ni stack aprobados. Estimar cada fase después de la investigación, indicando disponibilidad y costos de mapas, hosting y servicios.

Ruta crítica: F0 → F1 → F2 → F3 → F4 → F6 → F9. F5 requiere la integración validada de F0/F3. F7/F8 pueden avanzar con datos de prueba identificados, pero su aceptación requiere datos reales.

## Actualización de producto — cockpit (2026-10-19)

[Especificación de experiencia](cockpit-experience.md): cinco regiones, orden visual/coherencia/evolución y batería/autonomía/predicción separadas. Se amplía el alcance de tareas existentes sin renumerarlas. Cámara/percepción es expansión futura solicitada, sin fase/fecha comprometida. Decisión de arquitectura en pausa hasta completar revisión de producto.

## F0 · 0–10 — Factibilidad y contrato de alcance

- [ ] GC-001: identificar teléfono/OS/browser principal y orientación del soporte de manubrio.
- [ ] GC-002: identificar variante/modelo interno, firmware y región de Xiaomi Home.
- [ ] GC-003: ejecutar [protocolo Xiaomi](xiaomi-integration.md): acceso oficial/exportación/nube, BLE y compatibilidad.
- [ ] GC-004: probar GPS, suspensión/segundo plano, pantalla bloqueada y wake lock si está disponible.
- [ ] GC-005: elegir PWA sola o web con puente nativo según resultados.
- [ ] GC-006: cerrar campos soportados, fuentes, stack, proveedor de mapas/rutas, costos y alcance de primera versión.
- [x] GC-007: preparar este repositorio público con instrucciones y registro de decisiones.

**Entrega:** informe de factibilidad, matriz de capacidades y decisiones técnicas enlazadas desde este repo.
**Aceptación:** cada requisito crítico tiene camino comprobado o bloqueo explícito. No diseñar una integración cloud por suposición.
**Si BLE falla:** continuar un prototipo útil con GPS/manual y abrir una tarea de investigación o puente; el requisito automático permanece pendiente y el 100 % conectado no se declara cumplido.

## F1 · 10–20 — Diseño de la experiencia

Depende de F0 para representar capacidades reales.

- [ ] GC-010: wireframes de Hangar, misión, preflight, cockpit, estacionamiento y debrief; cinco regiones del cockpit vertical y paneles contextuales.
- [ ] GC-011: sistema visual propio inspirado en Tesla/SpaceX/aviación; confirmar nombre y alias.
- [ ] GC-012: estados vacíos, desconectado, dato antiguo, error, permisos denegados y GPS impreciso; testigos y asistencias reales con prioridad de avisos.
- [ ] GC-013: prototipo interactivo con fixture claramente marcado como demo.
- [ ] GC-014: legibilidad al sol, controles táctiles, voz opcional y comportamiento en movimiento.

**Entrega:** flujo completo revisable antes de construir.
**Aceptación propuesta:** Alejandro prepara una misión frecuente en menos de 30 segundos; puede identificar velocidad, próxima maniobra y reserva sin recorrer menús. No tratar pruebas en escritorio como validación en conducción.

## F2 · 20–30 — Fundaciones de la app

- [ ] GC-020: estructura del frontend y componentes del cockpit; instalación PWA cuando aplique.
- [ ] GC-021: almacenamiento local persistente y migraciones; perfil de vehículo, preferencias y destinos.
- [ ] GC-022: contrato común de muestras, fuentes, timestamps, unidades y calidad; separar batería, autonomía, predicción y potencia instantánea.
- [ ] GC-023: sesión de viaje recuperable, cola de sincronización y exportación/backup inicial.
- [ ] GC-024: HTTPS, permisos bajo demanda y separación de secretos; login privado si hay backend.
- [ ] GC-025: caché de interfaz y estados offline explícitos.

**Entrega:** app instalable/usable en el teléfono elegido, con datos persistentes.
**Aceptación:** cerrar/reabrir no pierde preferencias o viaje recuperable; negar permisos no rompe el acceso a bitácora. No prometer mapas offline por cachear la interfaz.

## F3 · 30–45 — Primer cockpit utilizable / MVP personal

- [ ] GC-030: inicio, pausa, reanudación, fin y cancelación explícitos.
- [ ] GC-031: captura GPS, velocidad, rumbo si válido, precisión y tiempo.
- [ ] GC-032: mapa y trazado; evitar sumar saltos GPS como distancia recorrida.
- [ ] GC-033: batería al salir/llegar desde fuente válida o manual etiquetada.
- [ ] GC-034: checklist y debrief mínimo con notas.
- [ ] GC-035: adaptador Xiaomi de lectura o puente según F0; prioridad batería/odómetro.
- [ ] GC-036: desconexión visible, reconexión y continuidad del viaje sin BLE.

**Entrega:** primer recorrido completo registrado en campo, con cockpit y resumen.
**Aceptación propuesta:** cinco recorridos reales, sin pérdida de viajes; timestamps y fuentes visibles. Si Xiaomi sigue bloqueado, etiquetar entrega como MVP GPS/manual y registrar deuda de integración, no como versión conectada completa.

## F4 · 45–60 — Navegación y misiones

- [ ] GC-040: destinos frecuentes, rutas, paradas y regreso a base.
- [ ] GC-041: distancia/tiempo planificados y selección de perfil de ruta apropiado según proveedor; límite de vía sólo con fuente válida, separado de umbral personal y máximo del scooter.
- [ ] GC-042: próxima maniobra, mapa orientado y voz si funciona de forma confiable.
- [ ] GC-043: desvío/replanificación, pérdida de red y distinción entre trazado y ruta guiada.
- [ ] GC-044: estacionamiento guardado desde el teléfono.
- [ ] GC-045: mapa personal de superficies, calles cómodas, estacionamientos y carga con permiso.

**Entrega:** planificar → seguir indicaciones → estacionar.
**Aceptación:** navegación probada en trayectos conocidos, comportamiento claro ante desvío y falta de señal. Rutas propuestas no se describen como legalmente habilitadas sin una fuente aplicable; validar localmente las restricciones necesarias.

## F5 · 60–70 — Energía y datos del vehículo

Depende de F0/F3 y de muestras reales suficientes.

- [ ] GC-050: consolidar matriz Xiaomi; batería, odómetro y campos adicionales verificados; investigar potencia/regeneración con voltaje/corriente o campo directo, unidades y signo.
- [ ] GC-051: historial de cargas y tramos de consumo; distinguir energía observada de calculada.
- [ ] GC-052: modelo inicial de consumo por trayecto con incertidumbre y mínimo de muestras.
- [ ] GC-053: reserva configurable y estimación ida/vuelta; alerta de margen bajo; UI distingue porcentaje de batería, autonomía indicada y predicción del viaje.
- [ ] GC-054: contraste de predicción contra consumo al finalizar y registro del error.
- [ ] GC-055: degradación con batería antigua, ausencia BLE o datos atípicos.

**Entrega:** planificación de energía trazable.
**Aceptación propuesta:** evaluar al menos diez recorridos válidos y mostrar error real; fijar umbral de aceptación después de la línea base, no inventar precisión. Usar rangos/datos insuficientes cuando corresponda. Sin Wh/km si no hay base energética adecuada.

## F6 · 70–80 — Bitácora, mantenimiento y costos

- [ ] GC-060: historial, filtros, notas, estadísticas y replay.
- [ ] GC-061: registro de mantenimiento, intervalos configurables y tareas.
- [ ] GC-062: costos de energía, mantenimiento y gastos registrados.
- [ ] GC-063: comparación Amarok con consumo, combustible y estacionamiento editables; separar ahorro marginal de costos fijos.
- [ ] GC-064: exportar viajes/datos en formatos a definir (CSV/JSON/GPX según dato).
- [ ] GC-065: respaldo/restauración y eliminación de recorridos.

**Entrega:** uso cotidiano e historial propio recuperable.
**Aceptación:** restauración comprobada con un backup, cálculos contrastados con ejemplos manuales y rutas privadas por defecto.

## F7 · 80–88 — Mission Lab y contexto

- [ ] GC-070: simular paradas, distancias, batería inicial y reserva.
- [ ] GC-071: comparar rutas y consumo de viajes equivalentes.
- [ ] GC-072: reglas personales y avisos en la app; push sólo si se valida soporte.
- [ ] GC-073: evaluar clima/viento/desnivel como datos de contexto, con proveedor y costo definidos.
- [ ] GC-074: diagnóstico de permisos, fuentes y conectividad para el developer.

**Entrega:** laboratorio útil para decidir antes de salir.
**Aceptación:** simulaciones identificadas y separadas del historial real; ninguna regla modifica parámetros del scooter. Clima no altera el consumo con una fórmula no validada.

## F8 · 88–94 — Identidad y contenido

- [ ] GC-080: pulir bienvenida, estados de misión y «misión completada».
- [ ] GC-081: tarjetas de recorrido para historias y resumen semanal bajo demanda.
- [ ] GC-082: ocultar casa, destinos sensibles y extremos de ruta al compartir.
- [ ] GC-083: evaluar circuitos y metas de exploración sin premios por velocidad.
- [ ] GC-084: ajustes de accesibilidad, contraste y movimiento reducido.

**Entrega:** experiencia coherente y tarjetas compartibles.
**Aceptación:** previsualizar antes de exportar; sin publicación automática ni filtración de ubicación sensible.

## F9 · 94–100 — Estabilidad y versión personal completa

- [ ] GC-090: matriz de pruebas en teléfono y scooter reales: permisos, offline, reconexión, suspensión, poca batería del teléfono, GPS malo y firmware registrado.
- [ ] GC-091: medir consumo energético del teléfono, temperatura, fluidez y legibilidad en soporte.
- [ ] GC-092: pruebas de consistencia de viajes y energía, recuperación tras cierre y backup.
- [ ] GC-093: privacidad, autenticación si corresponde, secretos, retención y logs sin datos sensibles.
- [ ] GC-094: observabilidad mínima, versionado, despliegue privado, rollback y manual de uso.
- [ ] GC-095: piloto personal de dos semanas; resolver incidencias críticas.
- [ ] GC-096: checklist de release y actualización de documentación/estado.

**Entrega:** v1 personal operativa, con límites y compatibilidad explícitos.
**Aceptación propuesta:** diez viajes consecutivos sin pérdida de registro, cero incidencias críticas abiertas y restauración verificada. La integración Xiaomi se acepta sólo para campos/modelo/firmware/plataforma probados. Los módulos que sigan bloqueados se mantienen pendientes; no se marca 100 sólo por completar pantallas.

## Después de 100 — Opciones sin compromiso

Cámara y percepción de vehículos/elementos: dirección futura solicitada por Alejandro, sin fase/fecha comprometida; evaluar hardware, permisos, procesamiento, latencia, precisión y recursos antes de implementar, según [especificación](cockpit-experience.md). No mostrar detecciones ficticias ni implica conducción autónoma.

Otras opciones: otros scooters/vehículos, dron/sensores, varias cuentas, comunidad, integraciones adicionales y comercialización. Controles del vehículo sólo tras evaluación específica. Antes de monetizar: resolver licencias, soporte, costos, privacidad y modelo de negocio. Ninguna opción implica pertenencia empresarial o aprobación de desarrollo.

## Métricas de seguimiento propuestas

- Uso: viajes registrados / viajes que Alejandro quiso registrar; tiempo de preparación.
- Fiabilidad: viajes recuperados, fallos de GPS/BLE, tiempo de reconexión y datos antiguos.
- Energía: error entre batería final estimada y observada, por cantidad de muestras.
- Experiencia: lecturas comprensibles de un vistazo y acciones requeridas en marcha.
- Operación: consumo del teléfono por hora y costo mensual de servicios.
- Continuidad: exportación/restauración exitosa y decisiones con evidencia.

Revisar prioridades después del MVP y del piloto. El roadmap no es una estimación de esfuerzo uniforme por porcentaje.

## Seguimiento operativo

Cada GC-ID corresponde a una issue: [backlog](backlog.md). Estado real en GitHub Issues y en el [Project](https://github.com/users/alearra/projects/6). Porcentajes son intervalos del plan, no avance medido. Repo público build in public; datos de viajes privados. [Workflow](development-workflow.md).
