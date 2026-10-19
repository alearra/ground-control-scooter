# Backlog 0–100

60 tareas del roadmap completo. Importación a GitHub Issues en curso; se añadirá el índice de URLs verificadas al finalizar. GitHub Project aún no creado.

| Fase | ID | Objetivo |
|---|---|---|
| F0 | GC-001 | identificar teléfono/OS/browser principal y orientación del soporte de manubrio |
| F0 | GC-002 | identificar variante/modelo interno, firmware y región de Xiaomi Home |
| F0 | GC-003 | ejecutar [protocolo Xiaomi](xiaomi-integration.md): acceso oficial/exportación/nube, BLE y compatibilidad |
| F0 | GC-004 | probar GPS, suspensión/segundo plano, pantalla bloqueada y wake lock si está disponible |
| F0 | GC-005 | elegir PWA sola o web con puente nativo según resultados |
| F0 | GC-006 | cerrar campos soportados, fuentes, stack, proveedor de mapas/rutas, costos y alcance de primera versión |
| F0 | GC-007 | preparar el repositorio técnico específico con instrucciones y registro de decisiones |
| F1 | GC-010 | wireframes de Hangar, misión, preflight, cockpit, estacionamiento y debrief |
| F1 | GC-011 | sistema visual propio inspirado en Tesla/SpaceX/aviación; confirmar nombre y alias |
| F1 | GC-012 | estados vacíos, desconectado, dato antiguo, error, permisos denegados y GPS impreciso |
| F1 | GC-013 | prototipo interactivo con fixture claramente marcado como demo |
| F1 | GC-014 | legibilidad al sol, controles táctiles, voz opcional y comportamiento en movimiento |
| F2 | GC-020 | estructura del frontend y componentes del cockpit; instalación PWA cuando aplique |
| F2 | GC-021 | almacenamiento local persistente y migraciones; perfil de vehículo, preferencias y destinos |
| F2 | GC-022 | contrato común de muestras, fuentes, timestamps, unidades y calidad |
| F2 | GC-023 | sesión de viaje recuperable, cola de sincronización y exportación/backup inicial |
| F2 | GC-024 | HTTPS, permisos bajo demanda y separación de secretos; login privado si hay backend |
| F2 | GC-025 | caché de interfaz y estados offline explícitos |
| F3 | GC-030 | inicio, pausa, reanudación, fin y cancelación explícitos |
| F3 | GC-031 | captura GPS, velocidad, rumbo si válido, precisión y tiempo |
| F3 | GC-032 | mapa y trazado; evitar sumar saltos GPS como distancia recorrida |
| F3 | GC-033 | batería al salir/llegar desde fuente válida o manual etiquetada |
| F3 | GC-034 | checklist y debrief mínimo con notas |
| F3 | GC-035 | adaptador Xiaomi de lectura o puente según F0; prioridad batería/odómetro |
| F3 | GC-036 | desconexión visible, reconexión y continuidad del viaje sin BLE |
| F4 | GC-040 | destinos frecuentes, rutas, paradas y regreso a base |
| F4 | GC-041 | distancia/tiempo planificados y selección de perfil de ruta apropiado según proveedor |
| F4 | GC-042 | próxima maniobra, mapa orientado y voz si funciona de forma confiable |
| F4 | GC-043 | desvío/replanificación, pérdida de red y distinción entre trazado y ruta guiada |
| F4 | GC-044 | estacionamiento guardado desde el teléfono |
| F4 | GC-045 | mapa personal de superficies, calles cómodas, estacionamientos y carga con permiso |
| F5 | GC-050 | consolidar matriz Xiaomi; batería, odómetro y campos adicionales verificados |
| F5 | GC-051 | historial de cargas y tramos de consumo; distinguir energía observada de calculada |
| F5 | GC-052 | modelo inicial de consumo por trayecto con incertidumbre y mínimo de muestras |
| F5 | GC-053 | reserva configurable y estimación ida/vuelta; alerta de margen bajo |
| F5 | GC-054 | contraste de predicción contra consumo al finalizar y registro del error |
| F5 | GC-055 | degradación con batería antigua, ausencia BLE o datos atípicos |
| F6 | GC-060 | historial, filtros, notas, estadísticas y replay |
| F6 | GC-061 | registro de mantenimiento, intervalos configurables y tareas |
| F6 | GC-062 | costos de energía, mantenimiento y gastos registrados |
| F6 | GC-063 | comparación Amarok con consumo, combustible y estacionamiento editables; separar ahorro marginal de costos fijos |
| F6 | GC-064 | exportar viajes/datos en formatos a definir (CSV/JSON/GPX según dato) |
| F6 | GC-065 | respaldo/restauración y eliminación de recorridos |
| F7 | GC-070 | simular paradas, distancias, batería inicial y reserva |
| F7 | GC-071 | comparar rutas y consumo de viajes equivalentes |
| F7 | GC-072 | reglas personales y avisos en la app; push sólo si se valida soporte |
| F7 | GC-073 | evaluar clima/viento/desnivel como datos de contexto, con proveedor y costo definidos |
| F7 | GC-074 | diagnóstico de permisos, fuentes y conectividad para el developer |
| F8 | GC-080 | pulir bienvenida, estados de misión y «misión completada» |
| F8 | GC-081 | tarjetas de recorrido para historias y resumen semanal bajo demanda |
| F8 | GC-082 | ocultar casa, destinos sensibles y extremos de ruta al compartir |
| F8 | GC-083 | evaluar circuitos y metas de exploración sin premios por velocidad |
| F8 | GC-084 | ajustes de accesibilidad, contraste y movimiento reducido |
| F9 | GC-090 | matriz de pruebas en teléfono y scooter reales: permisos, offline, reconexión, suspensión, poca batería del teléfono, GPS malo y firmware registrado |
| F9 | GC-091 | medir consumo energético del teléfono, temperatura, fluidez y legibilidad en soporte |
| F9 | GC-092 | pruebas de consistencia de viajes y energía, recuperación tras cierre y backup |
| F9 | GC-093 | privacidad, autenticación si corresponde, secretos, retención y logs sin datos sensibles |
| F9 | GC-094 | observabilidad mínima, versionado, despliegue privado, rollback y manual de uso |
| F9 | GC-095 | piloto personal de dos semanas; resolver incidencias críticas |
| F9 | GC-096 | checklist de release y actualización de documentación/estado |
