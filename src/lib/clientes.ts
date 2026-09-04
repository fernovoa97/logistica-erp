export const ESTADOS_CLIENTE = ["activo", "inactivo"] as const;

export type EstadoCliente = (typeof ESTADOS_CLIENTE)[number];

export const ESTADO_CLIENTE_LABEL: Record<EstadoCliente, string> = {
  activo: "Activo",
  inactivo: "Inactivo",
};

export const ESTADO_CLIENTE_BADGE_CLASS: Record<EstadoCliente, string> = {
  activo: "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
  inactivo: "bg-zinc-100 text-zinc-600 ring-zinc-500/20",
};
