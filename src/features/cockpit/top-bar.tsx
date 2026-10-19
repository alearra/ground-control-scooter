import { StatusPill } from "@/shared/ui/status-pill";
import type { Presence } from "./types";
import { connectivityLabel } from "./use-client-capabilities";

/**
 * Barra superior compacta: hora y contexto breve en lenguaje de usuario.
 * El inventario de APIs y sus explicaciones viven en «Estado del sistema»,
 * dentro del panel Aplicaciones (no en la vista de conducción).
 */
export function TopBar({ time, online }: { time: string; online: Presence }) {
  return (
    <header className="safe-top flex shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-line bg-surface px-3 pb-2">
      <p className="text-lg font-semibold tabular-nums">
        <span className="sr-only">Hora local: </span>
        {time}
      </p>
      <StatusPill
        label="Red"
        value={connectivityLabel(online)}
        tone="neutral"
      />
    </header>
  );
}
