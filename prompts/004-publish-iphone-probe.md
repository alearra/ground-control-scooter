# Integrar y publicar la sonda iPhone

Ejecuta en OpenCode + Big Pickle. El AI PM revisó el head 1981779 del PR #63 y ejecutó node --check y el harness: 15/15 pass. Las cuatro correcciones están resueltas. Está autorizada la integración y publicación pública de **sólo la sonda** tras el ajuste final y verificaciones siguientes. No pidas otra confirmación si todo coincide; si aparece un bloqueo real, informa exactamente cuál.

## 1. Recuperar y ajustar el workflow

git fetch; conserva cambios locales ajenos. Actualiza feature/f0-iphone-capability-probe con commits remotos del AI PM e incorpora main sin force push. Lee AGENTS.md y docs/reviews/2026-10-19-iphone-probe.md.

Añade en .github/workflows/pages.yml una condición explícita github.ref == 'refs/heads/main' a los jobs build/deploy: workflow_dispatch permite seleccionar otra rama y no cumple esa restricción por sí solo. Mantén triggers push/main y dispatch, permisos mínimos, environment github-pages y artefacto exclusivo experiments/iphone-capability-probe. No amplíes alcance, stack, dependencias, permisos de cuenta ni datos publicados. Verifica YAML y que una ejecución sobre otra ref no pueda publicar.

## 2. Verificar y cerrar revisión

Ejecuta node --check experiments/iphone-capability-probe/app.js y node --test experiments/iphone-capability-probe-tests/probe.test.mjs. Revisa diff final, ausencia de datos sensibles, carpeta del artefacto y cambios remotos inesperados. No confundir mocks con pruebas físicas. Registra ajuste final y resultados en la revisión; actualiza PR #63. Si todo pasa y el PR está limpio, haz squash merge #63 y sincroniza main; si ya está integrado, no repitas. No cierres #3/GC-003 ni #4/GC-004.

## 3. Configurar GitHub Pages y desplegar

Usa la cuenta ya autenticada y verifica el repo alearra/ground-control-scooter. Inspecciona configuración y despliegues existentes antes de cambiarlos; no reemplaces un sitio ajeno al experimento. Configura Pages con build_type workflow / Source GitHub Actions mediante la CLI/API documentada si tu acceso lo permite. La publicación de la carpeta de sonda está autorizada; no publicar raíz del repo ni docs/tests.

No amplíes scopes ni desactives reglas/protecciones para sortear un error. Si falta permiso de administración, indica el único ajuste que Alejandro debe hacer en Settings > Pages > Source: GitHub Actions. Conserva lo ya completado.

Usa el workflow de main. Reutiliza una ejecución válida iniciada por el merge si existe; si necesita reejecutarse tras activar Pages, hazlo una sola vez de forma deliberada. Observa estados con consultas espaciadas y espera limitada; no hagas polling agresivo ni sleep hasta el reset de GraphQL. Ante 502/504, consulta el estado antes de repetir mutaciones para evitar duplicar. Informa un error real o bloqueo si ocurre.

## 4. Verificar el sitio y documentar

Obtén URL real desde el deployment/environment/API o salida page_url; no construyas una URL suponiendo la ruta de la carpeta. Comprueba HTTPS, respuesta correcta de index/JS/CSS y contenido de la sonda. No marques prueba física ni concedas ubicación en nombre del usuario.

Registra commit integrado, URL, workflow run y resultado en docs/current-status.md y la guía en un PR documental breve; no es necesario bloquear el uso de la sonda esperando ese PR. Si hay acceso Projects, actualiza GC-004 como In progress o Blocked según estado real, con evidencia de deploy; nunca Done sin la prueba iPhone. GC-003 sigue pendiente de lectura del scooter.

## 5. Handoff

Devuelve hasta cinco puntos: PR/commit integrado, URL HTTPS verificada, enlace de run y checks, pendientes reales y siguiente acción única: abrir esa URL en Safari del iPhone.

La prueba posterior del usuario será primer plano 60s, otra app 30s, bloqueo 30s y exportar JSON sanitizado. No la marques realizada. No avances al cockpit ni puente nativo en esta sesión.
