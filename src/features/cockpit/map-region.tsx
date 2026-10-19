/**
 * Región de mapa: región flexible del cockpit.
 * En F0/F1 no hay proveedor de mapas ni navegación real; se deja explícito el
 * pendiente para no simular recorridos ni rutas. Las explicaciones de proveedor
 * e IDs pertenecen al detalle/documentación, no a la vista de conducción.
 *
 * Cuando hay un panel abierto (`compact`), el mapa se reduce a una franja
 * discreta y reconocible para reservar el espacio real al detalle.
 */
export function MapRegion({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <section
        aria-labelledby="map-heading"
        className="flex shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-0.5 rounded-2xl border border-line bg-surface px-3 py-2"
      >
        <h2 id="map-heading" className="text-xs font-semibold text-fg">
          Sin ruta
        </h2>
        <p className="text-xs text-muted">Mapa sin configurar</p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="map-heading"
      className="flex min-h-0 flex-1 flex-col rounded-2xl border border-line bg-surface"
    >
      <h2 id="map-heading" className="sr-only">
        Mapa
      </h2>
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="max-w-xs text-center">
          <p className="text-sm font-semibold text-fg">Sin ruta</p>
          <p className="mt-1 text-xs text-muted">Mapa sin configurar</p>
        </div>
      </div>
    </section>
  );
}
