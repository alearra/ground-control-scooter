# Revisión AI PM del PR #67 y sincronización del Project

Ejecuta en OpenCode + Big Pickle. Objetivo: resolver esta revisión sobre la base Next.js y reconciliar seguimiento. No implementar otra fase, hacer merge ni desplegar.

## 1. Recuperar contexto y preservar trabajo
Lee AGENTS.md, RULES.md, ADR-0002, docs/cockpit-experience.md y el PR #67. Revisión realizada sobre head 8d123dd2163c718e1ff01a389b4a38e7c27118e7. Next.js queda confirmado por decisión de Alejandro, uniformidad ALESAM y evolución a backend. Sincroniza feature/nextjs-foundation sin force push; preserva trabajo ajeno y PR #64.

## 2. Corregir tres observaciones acotadas
- top-bar.tsx: la presencia de navigator.geolocation/bluetooth/wakeLock no prueba permiso, lectura, conexión al scooter ni bloqueo de pantalla activo. Etiquetar explícitamente API presente/no presente/sin comprobar y función inactiva cuando corresponda. Evitar que verde y «GPS disponible» o «Pantalla disponible» parezcan sensores/funciones activos. navigator.onLine es estado informado por navegador, no comprobación de acceso a Internet. No iniciar APIs.
- vehicle-area.tsx: «Avisos: sin alertas» no debe insinuar diagnóstico satisfactorio del scooter sin fuente. Separar avisos de aplicación, si existen, de «Diagnóstico del scooter: no disponible». No inventar fallas o asistencia.
- context-panel.tsx: fixed bottom-0 y z-50 cubren la barra inferior. Mantener accesos estables visibles y utilizables al abrir un panel y conservar velocidad/alerta esencial. Resolver con composición que reserve espacio real, sin altura de barra supuesta. Conservar cierre, Escape, cambio de panel y devolución de foco. No convertirlo en modal que oculte instrumentos.

Revisar vertical 390×844 y una altura menor con navegador disponible, incluyendo overflow y panel abierto. Emulación no es Safari físico. Si no hay navegador, informar limitación. No añadir frameworks de pruebas sólo para copiar markup. No cambiar GPS/BLE/persistencia/mapas/backend ni workflow Pages.

## 3. Reconciliar Project #6 sin duplicados
Project: https://github.com/users/alearra/projects/6 . Reutilizar items existentes, identificar por issue y GC ID, conservar Phase/Priority/GC ID. Verificar estado real antes de escribir; actualizar sólo diferencias, con Evidence enlazada a commit/PR/documento y alcance pendiente:
- GC-001/#1 y GC-002/#2: Review, inventario declarado ya documentado; mantener issues abiertas hasta revisión de criterios. No publicar identificadores únicos.
- GC-003/#3: conservar abierta; no declarar integración o protocolo Xiaomi soportados.
- GC-004/#4: Review de evidencia parcial ya aportada, en vez de Blocked a la espera de más pruebas del usuario. GPS visible observado; continuidad con pantalla bloqueada no validada. No cerrar ni prometer continuidad. No pedir otro JSON ahora.
- GC-005/#5: In progress; elección Next.js no equivale a cerrar PWA frente a puente nativo.
- GC-006/#6: In progress; stack elegido, proveedores/costos/campos siguen pendientes.
- GC-007/#7: conservar Done.
- GC-010/#8: In progress; sólo cockpit provisional, faltan los demás flujos.
- GC-020/#13: Review del alcance parcial del PR #67; issue abierta, instalación PWA y dependencias pendientes.

No modificar masivamente las otras tareas, no crear otro Project ni duplicar issues/items. Si la API no permite editar, informar exactamente qué quedó sin escribir; no simular éxito. Consultar rate limit una vez si hace falta, hacer lecturas/escrituras acotadas; si se agota, entregar pendiente sin sleep largo ni bucle.

Reconciliar enlaces obsoletos de issues afectadas al documento en main: #8 aún enlaza rama antigua y afirma arquitectura pausada. Actualizar el cuerpo conservando criterios/marcadores, sin alterar el sentido de la aceptación. Esto es mantenimiento del seguimiento autorizado por Alejandro; no envío de mensajes a terceros.

## 4. Verificar y documentar
Ejecutar npm ci, typecheck, Biome, build, arranque HTTP y sonda node --test. Verificar interacciones con navegador si disponible. No sustituir prueba interactiva por curl. Mantener Pages y sonda intactos.

El AI PM revisó los 21 archivos y reprodujo instalación (con --ignore-scripts), Biome y build en copia de revisión del head indicado; typecheck también pasó. No realizó prueba Safari física ni prueba interactiva. La verificación de sonda de esta entrega sigue siendo evidencia reportada por OpenCode, no repetida por el AI PM.

Registrar revisión/correcciones y estados reales en docs/current-status.md y un informe de revisión. Conservar límites físicos del JSON; no publicar export crudo ni serie/MAC/coordenadas. No revivir textos obsoletos de #64.

## 5. Entregar para revisión
Actualizar el PR #67 existente con las correcciones y documentación, sin merge/deploy y sin cerrar #8/#13. Entregar hasta cinco puntos: head; correcciones; pruebas reales y límites; Project antes/después con pendientes; siguiente acción única = revisión AI PM.
