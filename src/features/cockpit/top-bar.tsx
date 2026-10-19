import { StatusPill, type StatusTone } from "@/shared/ui/status-pill";
import type { Presence } from "./types";
import type { ClientCapabilities } from "./use-client-capabilities";

function presenceText(presence: Presence): string {
  if (presence === "present") return "disponible";
  if (presence === "absent") return "no disponible";
  return "sin comprobar";
}

function presenceTone(presence: Presence): StatusTone {
  if (presence === "present") return "ok";
  if (presence === "absent") return "warn";
  return "neutral";
}

/**
 * Barra superior: hora, conectividad y contexto de sensores/datos.
 * Responde «¿en qué estado está el sistema?». No inicia sensores.
 */
export function TopBar({
  time,
  capabilities,
}: {
  time: string;
  capabilities: ClientCapabilities;
}) {
  return (
    <header className="safe-top flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line bg-surface px-3 pb-2">
      <p className="text-lg font-semibold tabular-nums">
        <span className="sr-only">Hora local: </span>
        {time}
      </p>
      <StatusPill
        label="Red"
        value={presenceText(capabilities.online)}
        tone={presenceTone(capabilities.online)}
      />
      <section
        className="flex flex-wrap items-center gap-1.5"
        aria-label="Contexto de sensores"
      >
        <StatusPill
          label="GPS"
          value={presenceText(capabilities.geolocation)}
          tone={presenceTone(capabilities.geolocation)}
        />
        <StatusPill
          label="Bluetooth"
          value={presenceText(capabilities.bluetooth)}
          tone={presenceTone(capabilities.bluetooth)}
        />
        <StatusPill
          label="Pantalla"
          value={presenceText(capabilities.wakeLock)}
          tone={presenceTone(capabilities.wakeLock)}
        />
      </section>
    </header>
  );
}
