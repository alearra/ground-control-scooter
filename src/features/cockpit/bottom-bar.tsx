import type { PanelId } from "./types";

const ACCESSES: ReadonlyArray<{ id: PanelId; label: string; hint: string }> = [
  {
    id: "navigation",
    label: "Navegación",
    hint: "Deshabilitada: sin destino ni proveedor de mapas.",
  },
  {
    id: "vehicle",
    label: "Vehículo",
    hint: "Sin lectura del scooter ni integración Xiaomi.",
  },
  {
    id: "missions",
    label: "Misiones",
    hint: "Sin misiones: no hay viajes registrados.",
  },
  {
    id: "apps",
    label: "Aplicaciones",
    hint: "Accesos provisionales para validar F1.",
  },
];

/**
 * Barra inferior: accesos contextuales. Cada botón abre un panel sin recargar
 * la página. Ninguno inicia GPS, Bluetooth ni permisos.
 */
export function BottomBar({
  openPanel,
  onToggle,
  registerTrigger,
}: {
  openPanel: PanelId | null;
  onToggle: (panel: PanelId) => void;
  registerTrigger: (panel: PanelId, element: HTMLButtonElement | null) => void;
}) {
  return (
    <nav
      aria-label="Accesos del cockpit"
      className="safe-bottom flex items-stretch gap-1 border-t border-line bg-surface px-2 pt-2"
    >
      {ACCESSES.map((access) => {
        const isOpen = openPanel === access.id;
        return (
          <button
            key={access.id}
            type="button"
            ref={(element) => registerTrigger(access.id, element)}
            onClick={() => onToggle(access.id)}
            aria-expanded={isOpen}
            aria-controls="context-panel"
            aria-describedby={`access-hint-${access.id}`}
            className={`flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs transition-colors ${
              isOpen
                ? "bg-surface-2 text-fg"
                : "text-muted hover:bg-surface-2/60 hover:text-fg"
            }`}
          >
            <span className="font-medium">{access.label}</span>
            <span id={`access-hint-${access.id}`} className="sr-only">
              {access.hint}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
