# Primera base web — Ground Control

Ejecuta en OpenCode + Big Pickle. Alejandro autorizó avanzar a arquitectura y desarrollo incremental. No pidas otra confirmación para las lecturas, scaffold reversible o verificaciones de este alcance. No cambies modelo ni uses Cursor salvo bloqueo justificado.

Objetivo único: primera base web y layout provisional del cockpit. No implementar todavía recorridos, IndexedDB, mapas reales, Xiaomi ni cámara. El prototipo visual detallado de F1 sigue pendiente; las cinco regiones son el contrato inicial.

## 1. Sincronizar y cargar decisiones

git fetch y revisión del árbol local. Conserva cambios ajenos. Lee AGENTS.md, docs/cockpit-experience.md, docs/architecture.md, docs/adr/0001-local-first-web-cockpit.md, RULES.md y este prompt. Si no están aún en main, localiza el PR documental de arquitectura que contiene estos archivos (no adivines número), revisa el diff y su head real, sincronízalo sin force push e intégralo por squash sólo si continúa siendo documentación de este alcance y no hay conflictos o cambios inesperados. La integración de esa documentación está autorizada por el AI PM; no integrar otros PRs por asociación.

PR #65 del producto ya está integrado. PR #64 documental puede estar pendiente: no revivas textos «sin publicar/sin probar» ni sobrescribas el estado actual más reciente. Si hay conflictos documentales rutinarios, conserva hechos actuales y pendientes; si cambia alcance, reporta.

## 2. Scaffold mínimo y seguro

Nueva rama feature/web-foundation desde main actualizado. Verifica versión de Node y engines de herramientas antes de elegir versiones estables compatibles, registra las versiones efectivas y usa npm/package-lock. React + Vite + TypeScript strict; Tailwind v4 con integración Vite compatible; Biome. Zustand sólo para el estado compartido del panel seleccionado si se necesita. No instalar las dependencias futuras sólo por aparecer en architecture.md.

No ejecutes un generador que borre archivos del repo. Puedes generar en directorio temporal y copiar sólo la base requerida, conservando README, docs, prompts, experiments, pruebas y workflows actuales. Sin .env con secretos, servicios nuevos ni cambios globales de configuración.

Crear src/app, src/features/cockpit y shared donde haya reutilización real. No generar todos los módulos futuros ni un framework de plugins. Define tokens CSS y layout vertical con las cinco regiones: barra superior, área de vehículo, mapa, barra inferior y panel contextual.

Estado real inicial: sin viaje, sin ruta, velocidad no disponible y batería no registrada. No mostrar números de ejemplo como lecturas reales. El espacio del mapa dice «Sin ruta / mapa por conectar», sin un falso mapa interactivo. Cámara y potencia quedan fuera de esta entrega.

## 3. Interacción acotada

Barra inferior con navegación/vehículo/misiones/aplicaciones como accesos provisionales coherentes. Abrir/cerrar un panel cambia UI sin recargar página; foco accesible y cierre claro. No permitir que el panel oculte toda la información esencial. Barra superior puede mostrar reloj local y estado de APIs por presencia, sin llamar al hardware ni pedir permisos.

No iniciar GPS, solicitar localización, emparejar Bluetooth ni hacer requests a proveedores. No añadir almacenamiento de coordenadas o telemetría. La pantalla describe estados vacíos con honestidad. Sin animaciones complejas ni renderer 3D.

Configura base de Vite para el path /ground-control-scooter/ al construir para ese hosting. Evita routing que requiera rewrites de Pages; estado local de paneles basta en este PR.

## 4. Verificación

Scripts reales: dev, typecheck (tsc explícito), lint/check Biome y build. Ejecuta npm ci, typecheck, lint y build; confirma que lockfile reproduce instalación. Mantén el harness de la sonda funcionando (node --test experiments/iphone-capability-probe-tests/probe.test.mjs).

Verifica en navegador disponible el layout vertical de referencia iPhone y apertura/cierre de panel/foco. Esa emulación no es una prueba física Safari. Si no tienes navegador, reporta limitación y no inventes capturas. No crees una suite que copie la estructura de los componentes; tests de dominio se añadirán al implementar lógica real.

Puedes añadir CI de PR para typecheck/lint/build si es pequeño y respeta workflows existentes. No modificar .github/workflows/pages.yml ni publicar dist: la sonda permanece activa en su URL. No agregar service worker todavía.

## 5. Entrega y parada

README con stack efectivo, Node requerido y comandos; conserva enlaces/documentación previos. Actualiza current-status con qué existe y qué sigue pendiente. Abre PR de implementación con referencia a #13/GC-020 y #8/GC-010 como alcance parcial. No cierres esas tareas enteras: no hay PWA/flujo F1 completo ni hardware validado.

No hagas merge/deploy de este nuevo PR de código. Entrega hasta cinco puntos: PR/commit, comportamiento visible, verificaciones, pendientes y única siguiente acción de revisión AI PM. No preguntes si puedes empezar: ejecuta el alcance autorizado y detente en esta entrega.
