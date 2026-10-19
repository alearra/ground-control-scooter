"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BottomBar } from "./bottom-bar";
import { ContextPanel } from "./context-panel";
import { MapRegion } from "./map-region";
import { TopBar } from "./top-bar";
import type { PanelId } from "./types";
import { useClientCapabilities } from "./use-client-capabilities";
import { formatClock, useClock } from "./use-clock";
import { VehicleArea } from "./vehicle-area";

/**
 * Límite de cliente del cockpit: es la única parte interactiva de la base.
 * Layout y página siguen siendo Server Components. No inicia GPS, Bluetooth,
 * wake lock ni persistencia: sólo lee la presencia de APIs tras montar.
 *
 * Jerarquía vertical: los instrumentos persistentes (barra superior e
 * instrumentos del vehículo) y la barra de accesos quedan **fuera** de `main`.
 * `main` aloja sólo la región flexible mapa/panel y es la única que se
 * desplaza cuando falta altura o el texto está ampliado; por eso un panel
 * abierto o su scroll nunca pueden desplazar los instrumentos fuera de vista.
 */
export function Cockpit() {
  const [panel, setPanel] = useState<PanelId | null>(null);
  const capabilities = useClientCapabilities();
  const clock = formatClock(useClock());

  const triggerRefs = useRef<
    Partial<Record<PanelId, HTMLButtonElement | null>>
  >({});
  const returnFocusTo = useRef<PanelId | null>(null);

  const registerTrigger = useCallback(
    (id: PanelId, element: HTMLButtonElement | null) => {
      triggerRefs.current[id] = element;
    },
    [],
  );

  const togglePanel = useCallback((id: PanelId) => {
    setPanel((current) => {
      if (current === id) return null;
      returnFocusTo.current = id;
      return id;
    });
  }, []);

  const closePanel = useCallback(() => setPanel(null), []);

  // Devuelve el foco al acceso que abrió el panel.
  useEffect(() => {
    if (panel !== null) return;
    const target = returnFocusTo.current;
    if (!target) return;
    triggerRefs.current[target]?.focus();
    returnFocusTo.current = null;
  }, [panel]);

  return (
    <div className="flex h-dvh flex-col bg-bg text-fg">
      <TopBar time={clock} online={capabilities.online} />
      <VehicleArea />

      <main className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2">
        <MapRegion compact={panel !== null} />
        <ContextPanel
          panel={panel}
          onClose={closePanel}
          capabilities={capabilities}
          time={clock}
        />
      </main>

      <BottomBar
        openPanel={panel}
        onToggle={togglePanel}
        registerTrigger={registerTrigger}
      />
    </div>
  );
}
