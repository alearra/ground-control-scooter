# Revisión AI PM — sonda iPhone / PR #63

Fecha: 2026-10-19. Head revisado: 2510113cb1605b81b3a773cb3212d0bd6eb2d829.
Estado: requiere correcciones antes de integrar/publicar. Revisión estática de diff y app.js completo; no se ejecutaron pruebas físicas ni se afirma validación de runtime.

## Hallazgos

1. **GPS: estado incorrecto.** onGeoError(code=1) establece denied, pero llama stopGps(false), que lo reemplaza por stopped y oculta «Permiso denegado». onPosition tampoco restablece running después de un error recuperable: UI y exportación pueden discrepar.
2. **Wake Lock: callbacks obsoletos.** requestWakeLock y onVisibilityChange duplican adquisición sin guardia pending ni identidad de sesión. Reiniciar/liberar mientras una promesa está pendiente permite que la resolución posterior reactive pantalla o modifique contadores de la sesión nueva. Los handlers release tampoco comprueban que el sentinel siga siendo el actual y no registran liberaciones del sistema de forma consistente.
3. **Evidencia temporal insuficiente.** buildExport sólo incluye first_to_last_ms para GPS y timestamps de visibilidad. No conserva timestamps/intervalos de cada muestra o resúmenes equivalentes; no se puede reconstruir si continuó la entrega en segundo plano ni separar captura timestamp de recepción callback. La guía no debe concluir «la página estuvo pausada» de un hueco GPS aislado.
4. **Publicación fuera de alcance.** La guía ofrece raíz del repo como fallback. El requisito es publicar sólo experiments/iphone-capability-probe. Preparar Actions con upload-pages-artifact apuntando exclusivamente a esa carpeta; no publicar raíz ni docs. La selección de carpeta arbitraria no es una opción de publicación de rama estándar.

## Corrección y validación solicitadas

Conservar estado denied al limpiar recursos; recuperar running al recibir muestras válidas. Usar una adquisición Wake Lock compartida, guardia pending y generación/token de sesión; descartar y liberar resultados obsoletos. Registrar tiempos de captura y recepción o intervalos agregados, limitados y sin coordenadas; no equiparar wake lock con ejecución en background.

Verificar las regresiones con mocks acotados o harness Node sin dependencias: denegación GPS; recuperación tras timeout; reset mientras adquisición pendiente; liberar antes de resolver; adquirir tras retorno y liberar por sistema; exportar muestras con pausas conocidas. La prueba iPhone sigue pendiente.

Actualizar documentación, mantener GC-003/004 abiertas y devolver PR #63 corregido. Instrucciones: prompts/003-probe-review-fixes.md en main.


## Segunda revisión AI PM — 2026-10-19

Head revisado: 198177959af307481e4c99a6ea42bf294bc42fba.

- Revisión de app.js, harness, guía y workflow. Los cuatro hallazgos originales están resueltos.
- Ejecutados independientemente por el AI PM: node --check experiments/iphone-capability-probe/app.js y node --test experiments/iphone-capability-probe-tests/probe.test.mjs: 15/15 aprobados, salida 0. Harness Node simulado, no Safari/iPhone.
- Tags verificados por GitHub: checkout@v7, configure-pages@v6, upload-pages-artifact@v5 y deploy-pages@v5 existen. Artefacto apunta únicamente a la carpeta de sonda; pruebas fuera de ella.
- Ajuste final requerido: workflow_dispatch no restringe por sí solo la rama. Añadir guardia explícita github.ref == 'refs/heads/main' para los jobs de publicación. No relajar el environment.

**Decisión:** aprobado para integrar y publicar únicamente la sonda una vez aplicado y verificado ese ajuste acotado. No hace falta nueva confirmación si el diff sigue dentro de ese alcance y las verificaciones pasan. PR #63 permanece sin merge en esta revisión; Pages y prueba iPhone pendientes. No cerrar GC-003/004 por este resultado. Continuación: prompts/004-publish-iphone-probe.md.

## Ajuste final aplicado — 2026-10-19

- `.github/workflows/pages.yml`: añadida la guardia `github.ref == 'refs/heads/main'` en los jobs `build` y `deploy`, de modo que una ejecución `workflow_dispatch` sobre otra rama no publique.
- Verificado: `node --check app.js` OK; harness 15/15 (incluye ahora la assert de las dos guardas); YAML válido; artefacto sigue apuntando solo a `experiments/iphone-capability-probe`; triggers `push`/`main` y dispatch; permisos mínimos y `environment: github-pages` sin cambios.
- Sin cambios de alcance, stack, dependencias ni permisos de cuenta.
