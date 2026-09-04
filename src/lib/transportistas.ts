export const ESTADOS_TRANSPORTISTA = ["activo", "inactivo"] as const;

export type EstadoTransportista = (typeof ESTADOS_TRANSPORTISTA)[number];

export const ESTADO_TRANSPORTISTA_LABEL: Record<EstadoTransportista, string> = {
  activo: "Activo",
  inactivo: "Inactivo",
};

export const ESTADO_TRANSPORTISTA_BADGE_CLASS: Record<EstadoTransportista, string> = {
  activo: "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
  inactivo: "bg-zinc-100 text-zinc-600 ring-zinc-500/20",
};
