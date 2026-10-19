"use client";

import { useEffect, useState } from "react";
import type { Presence } from "./types";

export interface ClientCapabilities {
  /** Presencia de la API Geolocation. No solicita permiso ni inicia GPS. */
  geolocation: Presence;
  /** Presencia de navigator.bluetooth. No empareja ni lee servicios. */
  bluetooth: Presence;
  /** Presencia de Screen Wake Lock. No activa nada por sí sola. */
  wakeLock: Presence;
  /** Conectividad informada por el navegador. */
  online: Presence;
}

const UNKNOWN: ClientCapabilities = {
  geolocation: "unknown",
  bluetooth: "unknown",
  wakeLock: "unknown",
  online: "unknown",
};

function presence(value: boolean): Presence {
  return value ? "present" : "absent";
}

/** Etiqueta de presencia de una API. «sin comprobar» antes de montar. */
export function presenceLabel(presence: Presence): string {
  if (presence === "present") return "API presente";
  if (presence === "absent") return "API ausente";
  return "Sin comprobar";
}

/**
 * Estado de conectividad informado por el navegador. No es una comprobación de
 * acceso real a Internet: se declara como lo que informa el navegador.
 */
export function connectivityLabel(presence: Presence): string {
  if (presence === "present") return "En línea (navegador)";
  if (presence === "absent") return "Sin conexión (navegador)";
  return "Sin comprobar";
}

/**
 * Lee la presencia de APIs del navegador recién después de montar.
 * El primer render (servidor e hidratación) siempre usa «unknown» para evitar
 * diferencias de hidratación y para no pedir permisos ni tokens.
 */
export function useClientCapabilities(): ClientCapabilities {
  const [capabilities, setCapabilities] = useState<ClientCapabilities>(UNKNOWN);

  useEffect(() => {
    const read = () => ({
      geolocation: presence("geolocation" in navigator),
      bluetooth: presence("bluetooth" in navigator),
      wakeLock: presence("wakeLock" in navigator),
      online: presence(navigator.onLine),
    });

    setCapabilities(read());

    const sync = () => setCapabilities(read());
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  return capabilities;
}
