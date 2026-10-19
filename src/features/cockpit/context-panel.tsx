"use client";

import { useEffect, useRef } from "react";
import type { PanelId } from "./types";

const PANEL_CONTENT: Record<PanelId, { title: string; body: string }> = {
  navigation: {
    title: "Navegación",
    body: "Sin destino ni ruta. El proveedor de mapas sigue pendiente (GC-006); esta región queda provisional para validar jerarquía y accesos en F1.",
  },
  vehicle: {
    title: "Vehículo",
    body: "No hay lectura del scooter: la integración Xiaomi no está implementada y requiere lectura validada del 6 Ultra (GC-003). No se muestran batería, firmware ni estados inventados.",
  },
  missions: {
    title: "Misiones",
    body: "No hay misiones ni recorridos guardados. El registro local y las predicciones llegan por etapas, con evidencia.",
  },
  apps: {
    title: "Aplicaciones",
    body: "Accesos provisionales. Esta lista sólo valida estructura y navegación; no abre apps reales ni integra servicios.",
  },
};

/**
 * Panel contextual. Ocupa espacio real dentro del layout (no se superpone a la
 * barra inferior): al abrirse, reduce el mapa, y la barra superior, el área del
 * vehículo y la barra de accesos siguen visibles y utilizables. No es modal y
 * no oculta instrumentos de conducción.
 *
 * Al abrir mueve el foco a su botón de cierre; Escape lo cierra; la devolución
 * del foco al acceso que lo abrió la resuelve el cockpit.
 */
export function ContextPanel({
  panel,
  onClose,
}: {
  panel: PanelId | null;
  onClose: () => void;
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

  const content = PANEL_CONTENT[panel];

  return (
    <section
      id="context-panel"
      role="dialog"
      aria-modal="false"
      aria-labelledby="context-panel-title"
      className="flex max-h-[45dvh] min-h-0 flex-col rounded-2xl border border-line bg-surface-2 p-3"
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 id="context-panel-title" className="text-base font-semibold">
          {content.title}
        </h2>
        <button
          type="button"
          ref={closeButtonRef}
          onClick={onClose}
          className="shrink-0 rounded-lg border border-line px-3 py-1.5 text-sm text-muted hover:text-fg"
        >
          Cerrar
        </button>
      </div>
      <div className="min-h-0 overflow-y-auto">
        <p className="text-sm text-muted">{content.body}</p>
        <p className="mt-3 text-[11px] text-muted/80">
          Provisional para validar F1. Sin datos reales ni acciones sobre el
          vehículo.
        </p>
      </div>
    </section>
  );
}
