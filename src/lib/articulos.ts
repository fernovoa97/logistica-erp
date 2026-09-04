export const ESTADOS_ARTICULO = ["activo", "inactivo"] as const;

export type EstadoArticulo = (typeof ESTADOS_ARTICULO)[number];

export const ESTADO_ARTICULO_LABEL: Record<EstadoArticulo, string> = {
  activo: "Activo",
  inactivo: "Inactivo",
};

export const ESTADO_ARTICULO_BADGE_CLASS: Record<EstadoArticulo, string> = {
  activo: "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
  inactivo: "bg-zinc-100 text-zinc-600 ring-zinc-500/20",
};
