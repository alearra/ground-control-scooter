Trabaja únicamente en el inventario de factibilidad GC-001 y GC-002. No instales dependencias ni crees la aplicación.

Estado: repo público preparado; app e integración Xiaomi todavía no implementadas. Herramienta elegida: OpenCode con Big Pickle. Cursor sólo si hace falta. AI Product Manager: ChatGPT.

1. Lee AGENTS.md, docs/current-status.md y docs/xiaomi-integration.md. Inspecciona el repo sin modificar configuraciones globales.
2. Crea docs/discovery/device-inventory.md con campos pendientes para teléfono/OS/browser/versiones, orientación del soporte, versión Xiaomi Home, región, modelo interno/variante y firmware. No incluyas cuenta, MAC, serie, claves ni ubicación.
3. Crea docs/discovery/capability-matrix.md con columnas capacidad, plataforma, evidencia, resultado y bloqueo. Filas iniciales: BLE, batería, odómetro, GPS en primer plano, segundo plano, pantalla bloqueada y wake lock. Marca todo sin prueba como desconocido; no inventes resultados.
4. Formula un único pedido compacto a Alejandro para completar los datos del teléfono y la ficha técnica de Xiaomi Home. No solicites secretos ni capturas sin sanitizar. No cierres GC-001/002 hasta recibir los datos.
5. Prepara el cambio en una rama docs/device-discovery y entrega el diff o PR para revisión. No elijas framework ni ejecutes fases posteriores.

Aceptación: inventario y matriz claros con datos desconocidos visibles; ninguna afirmación de soporte del 6 Ultra sin evidencia; sin código de aplicación, nuevas dependencias ni datos sensibles.

Responde con el resultado primero y hasta cinco puntos: archivos, comprobaciones, pendientes, enlace commit/PR si existe y una siguiente acción concreta. Sigue el estilo de AGENTS.md inspirado en i-have-adhd. No simules pruebas físicas.
