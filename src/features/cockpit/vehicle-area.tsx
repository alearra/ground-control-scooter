import { StatusPill } from "@/shared/ui/status-pill";

/**
 * Área del vehículo: velocidad, visualización, energía y avisos.
 * Responde «¿qué está pasando?». Estado inicial honesto: nada medido todavía.
 */
export function VehicleArea() {
  return (
    <section
      aria-labelledby="vehicle-heading"
      className="rounded-2xl border border-line bg-surface p-3"
    >
      <h2 id="vehicle-heading" className="sr-only">
        Área del vehículo
      </h2>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        {/* Visualización provisional del vehículo: no representa datos en vivo. */}
        <div className="flex min-h-24 items-center justify-center rounded-xl border border-dashed border-line bg-surface-2/50 p-3 sm:w-40">
          <div className="text-center">
            <div
              aria-hidden="true"
              className="mx-auto mb-2 h-16 w-8 rounded-full border border-muted/50 bg-surface-2"
            />
            <p className="text-xs text-muted">Vista del vehículo</p>
            <p className="text-[11px] text-muted/80">
              provisional, sin telemetría
            </p>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">
                Velocidad
              </p>
              <p className="text-4xl font-semibold leading-none text-muted">
                No disponible
              </p>
              <p className="mt-1 text-xs text-muted">
                km/h · fuera de viaje, sin lectura de fuente
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-muted">
                Energía
              </p>
              <p className="text-lg font-semibold text-muted">
                Batería no registrada
              </p>
              <p className="text-xs text-muted">sin lectura observada</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <StatusPill label="Viaje" value="sin iniciar" tone="neutral" />
            <StatusPill label="Ruta" value="sin destino" tone="neutral" />
          </div>

          {/* Avisos de app y diagnóstico del scooter son orígenes distintos. */}
          <div className="rounded-xl border border-line bg-surface-2/50 p-2">
            <p className="text-xs font-semibold text-fg">
              Avisos y diagnóstico
            </p>
            <ul className="mt-1 space-y-1 text-xs text-muted">
              <li>
                <span className="text-fg">Avisos de la aplicación:</span> sin
                avisos.
              </li>
              <li>
                <span className="text-fg">Diagnóstico del scooter:</span> no
                disponible (sin lectura del vehículo).
              </li>
            </ul>
            <p className="mt-1 text-[11px] text-muted/80">
              «Sin avisos de la aplicación» no diagnostica el scooter ni implica
              que esté en buen estado.
            </p>
          </div>

          <p className="text-xs text-muted">
            Autonomía estimada y predicción del viaje: datos insuficientes. No
            se muestran porcentajes ni distancias inventadas.
          </p>
        </div>
      </div>
    </section>
  );
}
