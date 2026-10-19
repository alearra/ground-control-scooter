import { StatusPill, type StatusTone } from "@/shared/ui/status-pill";
import type { Presence } from "./types";
import type { ClientCapabilities } from "./use-client-capabilities";

function presenceText(presence: Presence): string {
  if (presence === "present") return "API presente";
  if (presence === "absent") return "API ausente";
  return "sin comprobar";
}

function connectivityText(presence: Presence): string {
  if (presence === "present") return "el navegador informa en línea";
  if (presence === "absent") return "el navegador informa sin conexión";
  return "sin comprobar";
}

/**
 * La presencia de una API nunca se pinta como estado «activo»: un elemento
 * presente no prueba permiso, lectura, conexión real ni uso. Todo en tono
 * neutro para no sugerir sensores ni funciones en marcha.
 */
const PRESENCE_TONE: StatusTone = "neutral";

/**
 * Barra superior: hora, conectividad y contexto de sensores/datos.
 * Responde «¿en qué estado está el sistema?». No inicia ninguna API.
 */
export function TopBar({
  time,
  capabilities,
}: {
  time: string;
  capabilities: ClientCapabilities;
}) {
  return (
    <header className="safe-top flex flex-col gap-1.5 border-b border-line bg-surface px-3 pb-2">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <p className="text-lg font-semibold tabular-nums">
          <span className="sr-only">Hora local: </span>
          {time}
        </p>
        <StatusPill label="Funciones" value="inactivas" tone="neutral" />
        <StatusPill
          label="Conectividad"
          value={connectivityText(capabilities.online)}
          tone={PRESENCE_TONE}
        />
      </div>

      <section
        aria-label="Presencia de APIs del navegador"
        className="flex flex-wrap items-center gap-1.5"
      >
        <StatusPill
          label="Geolocation"
          value={presenceText(capabilities.geolocation)}
          tone={PRESENCE_TONE}
        />
        <StatusPill
          label="Bluetooth"
          value={presenceText(capabilities.bluetooth)}
          tone={PRESENCE_TONE}
        />
        <StatusPill
          label="Wake Lock"
          value={presenceText(capabilities.wakeLock)}
          tone={PRESENCE_TONE}
        />
      </section>

      <p className="text-[11px] text-muted">
        Presencia de API, no permiso, conexión al scooter ni pantalla bloqueada
        activa. Ninguna función está iniciada; la conectividad es lo informado
        por el navegador, no una comprobación de acceso a Internet.
      </p>
    </header>
  );
}
