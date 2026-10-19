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
 * la página. Ninguno inicia GPS, Bluetooth ni permisos. Cada control respeta un
 * área táctil de al menos 44×44 CSS px.
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
      className="safe-bottom flex shrink-0 items-stretch gap-1 border-t border-line bg-surface px-2 pt-1"
    >
      {ACCESSES.map((access) => {
        const isOpen = openPanel === access.id;
        return (
          <button
            key={access.id}
            type="button"
            aria-expanded={isOpen}
            aria-controls={isOpen ? "context-panel" : undefined}
            title={access.hint}
            onClick={() => onToggle(access.id)}
            ref={(element) => registerTrigger(access.id, element)}
            className={`flex min-h-11 min-w-11 flex-1 flex-col items-center justify-center rounded-lg px-1 py-1.5 text-xs font-medium transition-colors ${
              isOpen
                ? "bg-accent/15 text-accent"
                : "text-muted hover:bg-surface-2 hover:text-fg"
            }`}
          >
            {access.label}
          </button>
        );
      })}
    </nav>
  );
}
