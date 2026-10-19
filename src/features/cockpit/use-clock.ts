"use client";

import { useEffect, useState } from "react";

/**
 * Hora local del dispositivo. Devuelve null en el primer render (servidor e
 * hidratación) para no generar diferencias de hidratación; se completa tras montar.
 */
export function useClock(intervalMs = 15_000): Date | null {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
}

export function formatClock(now: Date | null): string {
  if (!now) return "--:--";
  return now.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
