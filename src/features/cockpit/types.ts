/** Regiones contextuales que puede abrir la barra inferior. */
export type PanelId = "navigation" | "vehicle" | "missions" | "apps";

/** Presencia de una capacidad o recurso del navegador. «unknown» hasta comprobar tras montar. */
export type Presence = "unknown" | "present" | "absent";
