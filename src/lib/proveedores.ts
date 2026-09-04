export const ESTADOS_PROVEEDOR = ["activo", "inactivo"] as const;

export type EstadoProveedor = (typeof ESTADOS_PROVEEDOR)[number];

export const ESTADO_PROVEEDOR_LABEL: Record<EstadoProveedor, string> = {
  activo: "Activo",
  inactivo: "Inactivo",
};

export const ESTADO_PROVEEDOR_BADGE_CLASS: Record<EstadoProveedor, string> = {
  activo: "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
  inactivo: "bg-zinc-100 text-zinc-600 ring-zinc-500/20",
};
