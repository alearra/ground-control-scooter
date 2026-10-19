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
 * El panel contextual vive dentro de `main`, entre el mapa y la barra
 * inferior, para reservar espacio real: la barra de accesos nunca queda
 * cubierta y sigue siendo utilizable para cambiar o cerrar el panel.
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
      <TopBar time={clock} capabilities={capabilities} />

      <main className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2">
        <VehicleArea />
        <MapRegion />
        <ContextPanel panel={panel} onClose={closePanel} />
      </main>

      <BottomBar
        openPanel={panel}
        onToggle={togglePanel}
        registerTrigger={registerTrigger}
      />
    </div>
  );
}
