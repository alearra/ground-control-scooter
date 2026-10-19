"use client";

import { useEffect, useRef } from "react";
import type { PanelId } from "./types";
import {
  type ClientCapabilities,
  connectivityLabel,
  presenceLabel,
} from "./use-client-capabilities";

const PANEL_TITLES: Record<PanelId, string> = {
  navigation: "Navegación",
  vehicle: "Vehículo",
  missions: "Misiones",
  apps: "Aplicaciones",
};

const PANEL_SUMMARY: Record<PanelId, string> = {
  navigation:
    "Sin destino ni ruta. El proveedor de mapas sigue pendiente (GC-006); esta región queda provisional para validar jerarquía y accesos en F1.",
  missions:
    "No hay misiones ni recorridos guardados. El registro local y las predicciones llegan por etapas, con evidencia.",
  vehicle: "",
  apps: "",
};

/**
 * Panel contextual no modal. Ocupa espacio real dentro del layout (no se
 * superpone a la barra inferior). El contenido del detalle se desplaza dentro
 * de su propia región, de modo que al enfocar «Cerrar» no se desplazan fuera de
 * vista los instrumentos persistentes ni la barra de accesos.
 *
 * Al abrir mueve el foco a su botón de cierre; Escape lo cierra; la devolución
 * del foco al acceso que lo abrió la resuelve el cockpit.
 */
export function ContextPanel({
  panel,
  onClose,
  capabilities,
  time,
}: {
  panel: PanelId | null;
  onClose: () => void;
  capabilities: ClientCapabilities;
  time: string;
}) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!panel) return;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [panel, onClose]);

  if (!panel) return null;

  return (
    <section
      id="context-panel"
      role="dialog"
      aria-modal="false"
      aria-labelledby="context-panel-title"
      className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-line bg-surface-2"
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line p-3">
        <h2 id="context-panel-title" className="text-base font-semibold">
          {PANEL_TITLES[panel]}
        </h2>
        <button
          type="button"
          ref={closeButtonRef}
          onClick={onClose}
          className="min-h-11 min-w-11 shrink-0 rounded-lg border border-line px-3 py-1.5 text-sm text-muted hover:text-fg"
        >
          Cerrar
        </button>
      </div>
      <div className="min-h-32 flex-1 overflow-y-auto p-3">
        {panel === "vehicle" ? (
          <VehicleDetail />
        ) : panel === "apps" ? (
          <AppsDetail capabilities={capabilities} time={time} />
        ) : (
          <p className="text-sm text-muted">{PANEL_SUMMARY[panel]}</p>
        )}
      </div>
    </section>
  );
}

/**
 * Detalle del vehículo: tres magnitudes de energía diferenciadas (sin
 * combinarlas en un único indicador) y la explicación completa de avisos y
 * diagnóstico. Sin lectura del scooter, todas quedan «Sin registrar» o
 * «Datos insuficientes», nunca un valor inventado.
 */
function VehicleDetail() {
  return (
    <div className="space-y-4 text-sm">
      <dl className="space-y-2">
        <div>
          <dt className="font-medium text-fg">Porcentaje de batería</dt>
          <dd className="text-muted">
            Sin registrar (sin lectura del scooter)
          </dd>
        </div>
        <div>
          <dt className="font-medium text-fg">Autonomía estimada</dt>
          <dd className="text-muted">Datos insuficientes</dd>
        </div>
        <div>
          <dt className="font-medium text-fg">Predicción del viaje</dt>
          <dd className="text-muted">Datos insuficientes</dd>
        </div>
      </dl>

      <div>
        <h3 className="font-medium text-fg">Avisos y diagnóstico</h3>
        <ul className="mt-1 space-y-1 text-muted">
          <li>
            <span className="text-fg">Avisos de la aplicación:</span> sin
            avisos.
          </li>
          <li>
            <span className="text-fg">Diagnóstico del scooter:</span> no
            disponible (sin lectura del vehículo).
          </li>
        </ul>
        <p className="mt-2 text-[11px] text-muted/80">
          «Sin avisos de la aplicación» no diagnostica el scooter ni implica que
          esté en buen estado: ese diagnóstico requiere leer el vehículo.
        </p>
      </div>

      <p className="text-[11px] text-muted/80">
        Los tres datos de energía son distintos y no se combinan en un único
        indicador. Autonomía y predicción requieren datos de consumo validados.
      </p>
    </div>
  );
}

/**
 * Detalle del panel Aplicaciones. Incluye «Estado del sistema», que reúne el
 * inventario de APIs y sus explicaciones fuera de la vista de conducción.
 * Mantiene la distinción entre API presente, función inactiva y conexión real.
 */
function AppsDetail({
  capabilities,
  time,
}: {
  capabilities: ClientCapabilities;
  time: string;
}) {
  return (
    <div className="space-y-4 text-sm">
      <div>
        <h3 className="font-medium text-fg">Accesos provisionales</h3>
        <p className="mt-1 text-muted">
          Esta lista sólo valida estructura y navegación; no abre apps reales ni
          integra servicios.
        </p>
      </div>

      <div>
        <h3 className="font-medium text-fg">Estado del sistema</h3>
        <dl className="mt-1.5 space-y-1">
          <DetailRow label="Hora" value={time} />
          <DetailRow
            label="Conectividad"
            value={connectivityLabel(capabilities.online)}
          />
          <DetailRow
            label="Geolocation"
            value={`${presenceLabel(capabilities.geolocation)} · función inactiva`}
          />
          <DetailRow
            label="Bluetooth"
            value={`${presenceLabel(capabilities.bluetooth)} · función inactiva`}
          />
          <DetailRow
            label="Wake Lock"
            value={`${presenceLabel(capabilities.wakeLock)} · función inactiva`}
          />
        </dl>
        <p className="mt-2 text-[11px] text-muted/80">
          Presencia de API no es permiso, conexión real ni pantalla bloqueada
          activa; ninguna función está iniciada. La conectividad es lo informado
          por el navegador, no una comprobación de acceso a Internet.
        </p>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}
