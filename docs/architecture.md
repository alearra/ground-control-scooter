# Arquitectura inicial — Ground Control

Fecha: 2026-10-19. Decisión explícita de Alejandro: Next.js para uniformidad con ALESAM y evolución próxima hacia plataforma con backend. Documento de diseño; todavía no hay scaffold de app. Producto canónico: [cockpit](cockpit-experience.md). ADR vigente: [0002](adr/0002-nextjs-platform.md); [0001](adr/0001-local-first-web-cockpit.md) queda superado.

## Decisión ejecutiva

Una aplicación Next.js 16.x (App Router) + React + TypeScript strict. Interfaz de conducción en Client Components; layouts/páginas de servidor por defecto y Route Handlers/servicios de servidor para el backend progresivo. IndexedDB/Dexie conserva el soporte local y la recuperación de recorridos; Supabase/Postgres/Auth y Drizzle se incorporan al implementar cuenta/sincronización. Adaptadores separan hardware, dominio y presentación.

El primer modo operativo usa GPS con la página visible y batería manual explícita. La integración automática sigue siendo requisito independiente pendiente de investigación; no se presenta este modo como integración Xiaomi completa. La plataforma nace preparada para backend Next.js, que se implementa por funcionalidad; un puente nativo se agrega sólo si la integración Xiaomi lo requiere.

## Evidencia que guía la decisión

Prueba física aportada por Alejandro el 2026-10-19: HTTPS, Geolocation presente, 71 callbacks sin errores registrados, navigator.bluetooth=false y Wake Lock con 3 concesiones/2 liberaciones del sistema. No hubo callbacks GPS recibidos mientras hidden. Dos intervalos ocultos de 33,835 s y 9,652 s sin etiqueta de condición. Exactitud de rutas y continuidad con pantalla bloqueada no demostradas.

Conclusión de diseño: web de primer plano para cockpit; no basar telemetría Xiaomi en Web Bluetooth de ese Safari. No exigir más pruebas al usuario ahora. Conservar límites pendientes en GC-003/004; no cerrar por decidir un camino arquitectónico.

## Stack y momento de incorporación

| Necesidad | Elección | Cuándo |
|---|---|---|
| Framework e interfaz | Next.js 16.x App Router + React + TypeScript strict | Scaffold |
| Estilos | Tailwind CSS v4 y variables/tokens CSS propios | Scaffold |
| Estado compartido de UI y sesión | Zustand con selectores por región | Al primer estado compartido; scaffold acotado |
| Persistencia | IndexedDB mediante Dexie, esquemas versionados | GC-021; no persistir telemetría con Zustand/localStorage |
| Validación de importación y datos externos | Zod | Cuando existan esos límites |
| Render de mapa | MapLibre GL JS con carga diferida | F3/F4 tras seleccionar proveedor |
| Cartografía, búsqueda y rutas | Adaptadores; proveedor/costo/cobertura por elegir | GC-006/041; no resuelto por instalar MapLibre |
| PWA/offline | Manifest y service worker compatibles con Next.js | GC-025 después de funcionar la web |
| Calidad | Biome; TypeScript check; Vitest para dominio y Playwright para flujos críticos | Según código real; sin suite que sólo copie UI |
| Hosting | CI GitHub Actions; runtime Next.js en Vercel o servidor Node compatible | Sonda continúa en Pages; no desplegar app nueva en scaffold |
| Contenedor nativo | Capacitor como candidato, no seleccionado/instalado aún | Si GC-003/005 valida esa vía |

Usar versiones estables de Next.js 16.x, React y dependencias mutuamente compatibles, verificadas por OpenCode y fijadas en package-lock.json. Ejecutar typecheck explícito, Biome y next build. No usar next lint si no existe en la versión elegida.

La razón de Next.js es uniformidad con ALESAM y crecimiento hacia backend, no afirmar que el cockpit necesita SSR/SEO. El backend inicial se organiza en Route Handlers y servicios por feature; no duplicarlo con Fastify. Supabase/Auth/Postgres + Drizzle se incorporan al desarrollar cuenta/sincronización; TanStack Query al existir estado remoto; Redis/IA sólo por necesidad. No instalar toda la infraestructura en el primer scaffold. La IA de las herramientas de desarrollo no implica IA en la app.

## Organización por funciones

Repositorio único y una aplicación Next.js con frontend y backend modular. Sin monorepo ni microservicios iniciales.

- src/app/: App Router, layout/page, composición del cockpit y route.ts como adaptadores HTTP delgados hacia servicios por feature.
- src/features/: vehicle, missions, cockpit, telemetry, navigation, energy, logbook, maintenance, costs, mission-lab, sharing. Crear sólo las carpetas usadas.
- src/features/telemetry/: contrato de muestras y adaptadores gps/manual; posible native-bridge separado.
- src/shared/: componentes realmente reutilizados, tokens, utilidades y tipos compartidos.
- experiments/: sonda y harness existentes, conservados; docs/: arquitectura, especificación y ADR.

Cada función mantiene sus componentes, lógica de dominio, schemas, estado y repositorio. No extraer un framework genérico de plugins antes de necesitarlo. Las regiones visuales componen funciones; no son cinco aplicaciones independientes.

## Flujo de datos

Teléfono / entrada manual / futura conexión Xiaomi → adaptador de fuente → validación y normalización → servicio de sesión y estado → regiones del cockpit.

El servicio de recorrido guarda cambios y puntos válidos mediante un repositorio de almacenamiento. La UI no llama al hardware ni escribe IndexedDB directamente. Route Handlers validan/autorizan y llaman servicios server-only; no importan sensores o repositorios de navegador. El cálculo de energía consume muestras validadas y ruta activa, no el texto de una tarjeta.

Los proveedores de mapa/rutas se invocan por su interfaz; la cartografía requiere red salvo soporte explícito de offline. No cachear teselas masivamente ni usar endpoints de demostración como infraestructura de producción. Respetar condiciones y atribución del proveedor.

## Contratos y estados

Definir primero contratos pequeños de dominio:
- Muestra: vehicleId, metric, value, unit, source, capturedAt, receivedAt, quality y estado de vigencia. Fuente manual explícita. Separar sample/error/disconnected para no representar desconexión como cero.
- Recorrido: identidad, estado (draft/preflight/ready/riding/paused/completed/cancelled), tiempos y referencias a ruta/mediciones. Sólo un recorrido activo inicial.
- Energía: batteryPercent observada, indicatedRangeKm con referencia/modelo y tripPrediction con consumo/llegada/reserva/incertidumbre. No colapsarlos en un único range.
- Capacidad: supported/unsupported/unknown/degraded y evidencia por plataforma. Asistencias reales separadas de ayuda de software.
- Datos GPS: precisión, validez y timestamps. Nunca asumir que cada callback es un punto independiente ni integrar saltos como distancia.

Son contratos de diseño, no requisitos de crear todos los archivos en el primer PR. Mantener capturedAt y receivedAt distintos. Capacidad y estado de conexión no son lo mismo.

## Ciclo de vida del recorrido

El propietario de la suscripción GPS es un servicio de sesión inicializado una sola vez por la app; abrir un panel o cambiar de vista no inicia otro watch. Limpiar suscripciones, timers y Wake Lock al finalizar. Evitar carreras ante reset y callbacks tardíos.

Page Visibility marca la sesión como degradada/oculta cuando corresponde; al regresar, comprobar discontinuidades y registrar huecos. No unirlos como si el recorrido hubiera sido continuo. No pausar/finalizar automáticamente por una desconexión transitoria ni inventar distancia faltante.

Persistir checkpoint al iniciar y en cambios relevantes; almacenar puntos en lotes pequeños mediante transacciones sin escribir el render completo cada segundo. Recuperar una sesión interrumpida como pendiente de confirmación/reanudación, no reiniciarla automáticamente.

Zustand mantiene selección de panel y estado efímero; IndexedDB es la fuente persistida. React consume selectores por región para evitar refrescar toda la pantalla con cada muestra.

## Datos, privacidad y continuidad

IndexedDB queda ligado al navegador/origen, sujeto a cuota, borrado y posible expulsión. Es almacenamiento persistente, no backup garantizado. Solicitar persistencia donde proceda y ofrecer exportación/restauración versionada. Validar importaciones y migraciones con datos sintéticos.

La app de uso personal sí necesita guardar coordenadas del recorrido con consentimiento explícito al iniciar registro; la sonda, que no las guarda, se conserva separada. Coordenadas nunca en Git, logs públicos ni artifacts Pages. No subirlas a backend por defecto.

La sonda en GitHub Pages sirve código/assets públicos; no almacena recorridos como archivos del repo. La app Next.js tendrá hosting separado con origen dedicado y frontend/backend según su implementación. Los diferentes proyectos bajo el mismo origen alearra.github.io no están aislados por su path: prefijar la DB evita colisiones, pero no constituye aislamiento de seguridad. Antes de guardar historial personal real de forma habitual, usar un origen dedicado o aceptar/documentar expresamente el entorno de prueba compartido. Dominio/cambio de hosting no se contratan ni configuran en este trabajo.

## PWA y despliegue

Manifest ayuda a instalación; no habilita BLE ni GPS continuo oculto. Cachear inicialmente interfaz/recursos propios, no respuestas privadas ni mapas indiscriminadamente. Manejar actualización como «disponible para aplicar al detenerte»: no cambiar la versión activa a mitad de misión.

La sonda actual en Pages sigue operativa. No cambiar su workflow en el scaffold. La aplicación Next.js se desplegará posteriormente en Vercel o runtime Node compatible, sobre origen dedicado, cuando se revise el primer deploy. No crear cuentas ni asumir un plan/costo.

No configurar output: 'export' como arquitectura principal: Pages no ejecuta el backend Next.js. El export estático es una opción limitada para una demo aprobada, no un sustituto de Route Handlers/servicios de servidor. No aplicar basePath /ground-control-scooter/ al cockpit por heredar la URL de la sonda; definirlo según su hosting real.

Server Components por defecto. El cockpit interactivo, GPS, IndexedDB, Zustand y Wake Lock viven en límites 'use client' y se inicializan en efectos/servicios del cliente; no leer window/navigator/IndexedDB durante render de servidor. Evitar diferencias de hidratación en reloj/estados usando placeholders hasta montar. El dominio puro se comparte; módulos de DB/secretos se marcan server-only y no entran al bundle cliente.

## Integración Xiaomi y evolución nativa

TelemetryAdapter permite más adelante implementar lectura directa BLE en una plataforma compatible, una importación oficial si existe, o NativeBridgeAdapter. No inventar API cloud Xiaomi ni tokens del usuario.

Si el acceso BLE y/o registro fiable en segundo plano exige iOS nativo, evaluar Capacitor manteniendo React/dominio y reemplazando los adaptadores web por nativos. Capacitor no resuelve por sí solo autenticación y protocolo Xiaomi. Harán falta implementación/plugin compatible, pruebas en el firmware real y herramientas de compilación/firma iOS (Xcode en entorno adecuado). No prometer distribución sin resolver ese acceso.

Un gateway doméstico puede sincronizar al volver, pero no equivale a telemetría en viaje. La cámara futura merece otro ADR de percepción: hardware, permisos, procesamiento, energía/temperatura y latencia, sin iniciar esa infraestructura ahora.

## Backend: preparado desde la base, implementado por función

Next.js App Router es el framework de la plataforma desde el inicio. Route Handlers y servicios de servidor alojarán sincronización, autorización e integraciones con secretos cuando se implementen. Supabase es la elección prevista para Auth/Postgres/Storage y Drizzle para consultas/migraciones cuando haya datos remotos; usar RLS/separación por usuario y autorización server-side. No crear recursos, esquema de DB ni login ficticio en el primer scaffold.

TanStack Query entra con estado remoto real. Un token público de proveedor sólo puede incluirse en cliente si ese proveedor lo diseña así y permite restricciones; secretos privados nunca van en NEXT_PUBLIC_* ni artifacts. Variables públicas sólo si el proveedor las diseña para cliente. Una API privada va en servidor Next.js; nunca exponerla desde Pages.

## Secuencia de implementación

1. Base web y cinco regiones vacías con estados honestos; PR pequeño, sin mapa real, GPS activo o datos ficticios presentados como vivos.
2. Dominio de sesión y adaptador GPS, a partir de evidencia de la sonda; contratos y pruebas significativas.
3. Repositorio IndexedDB, checkpoint y recuperación; perfil/destinos y batería manual.
4. Mapa con proveedor elegido, trazado y navegación; energía basada en datos suficientes.
5. Integración Xiaomi por vía validada; puente nativo/backend sólo si se justifican.

La secuencia es incremental dentro del roadmap, no autoriza implementar cinco entregas en un solo prompt. El primer prompt se limita al scaffold y layout provisional; no adelanta el diseño final de F1.

## Pendientes que permanecen abiertos

Proveedor de mapas/rutas y sus costos/cobertura/límites de vía; origen dedicado para historial personal; método de lectura Xiaomi; distribución nativa si se requiere; percepción futura. No cerrar GC-006 por escoger sólo el frontend ni GC-003/004 por documentar límites.

## Fuentes primarias consultadas

- [React y TypeScript](https://react.dev/learn/typescript).
- [Next.js: instalación](https://nextjs.org/docs/app/getting-started/installation), [Server/Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components), [Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers) y [límites de export estático](https://nextjs.org/docs/app/guides/static-exports).
- [Tailwind con Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs).
- [Zustand](https://zustand.docs.pmnd.rs/learn/getting-started/introduction).
- [Dexie con React](https://dexie.org/docs/Tutorial/React).
- [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/).
- [Cuotas/borrado de almacenamiento web](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria).
- [Capacitor: entorno](https://capacitorjs.com/docs/getting-started/environment-setup) y [plugins iOS](https://capacitorjs.com/docs/plugins/ios).
