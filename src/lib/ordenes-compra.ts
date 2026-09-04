export const ESTADOS_OC = ["pendiente", "aprobada", "recibida", "cancelada"] as const;

export type EstadoOC = (typeof ESTADOS_OC)[number];

export const ESTADO_OC_LABEL: Record<EstadoOC, string> = {
  pendiente: "Pendiente",
  aprobada: "Aprobada",
  recibida: "Recibida",
  cancelada: "Cancelada",
};

export const ESTADO_OC_BADGE_CLASS: Record<EstadoOC, string> = {
  pendiente: "bg-amber-100 text-amber-800 ring-amber-600/20",
  aprobada: "bg-blue-100 text-blue-800 ring-blue-600/20",
  recibida: "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
  cancelada: "bg-red-100 text-red-800 ring-red-600/20",
};
