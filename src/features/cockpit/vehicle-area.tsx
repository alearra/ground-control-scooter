import { StatusPill } from "@/shared/ui/status-pill";

/**
 * Instrumentos persistentes del vehículo: velocidad dominante, batería
 * secundaria y un resumen de avisos reconocible que separa los avisos de la
 * aplicación del diagnóstico del scooter. Visible siempre, incluso con un
 * panel abierto. No mide nada: sin lectura, la velocidad es «—», nunca 0.
 */
export function VehicleArea() {
  return (
    <section
      aria-labelledby="vehicle-heading"
      className="flex shrink-0 flex-col gap-1.5 px-3 pt-2 pb-1"
    >
      <h2 id="vehicle-heading" className="sr-only">
        Área del vehículo
      </h2>

      <div className="flex items-end justify-between gap-3">
        <p className="min-w-0">
          <span className="sr-only">Velocidad actual: sin lectura</span>
          <span
            aria-hidden="true"
            className="text-5xl font-semibold leading-none tabular-nums"
          >
            —
          </span>
          <span aria-hidden="true" className="ml-1 text-sm text-muted">
            km/h
          </span>
          <span aria-hidden="true" className="ml-2 text-xs text-muted">
            Sin lectura
          </span>
        </p>
        <div className="shrink-0 text-right">
          <p className="text-xs uppercase tracking-wide text-muted">Batería</p>
          <p className="text-sm font-semibold text-muted">Sin registrar</p>
        </div>
      </div>

      {/* Resumen de avisos: donde aparecería una alerta relevante. */}
      <div className="flex flex-wrap items-center gap-1.5">
        <StatusPill label="Avisos de app" value="sin avisos" tone="neutral" />
        <StatusPill label="Diagnóstico" value="sin lectura" tone="neutral" />
      </div>
    </section>
  );
}
