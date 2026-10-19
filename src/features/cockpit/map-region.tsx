/**
 * Región de mapa: espacio central del cockpit.
 * En F0/F1 no hay proveedor de mapas ni navegación real; se deja explícito
 * el pendiente para no simular recorridos ni rutas.
 */
export function MapRegion() {
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
          <p className="text-sm font-semibold text-fg">Mapa sin configurar</p>
          <p className="mt-1 text-xs text-muted">
            Proveedor de mapas pendiente (GC-006). No se dibujan rutas ni
            posiciones estimadas.
          </p>
        </div>
      </div>
      <p className="border-t border-line px-3 py-2 text-[11px] text-muted">
        Sin viaje, sin ruta y sin ubicación solicitada.
      </p>
    </section>
  );
}
