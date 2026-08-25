export const ESTADOS = [
  "pendiente",
  "en_transito",
  "entregado",
  "cancelado",
] as const;

export type EstadoDespacho = (typeof ESTADOS)[number];

export const ESTADO_LABEL: Record<EstadoDespacho, string> = {
  pendiente: "Pendiente",
  en_transito: "En tránsito",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export const ESTADO_BADGE_CLASS: Record<EstadoDespacho, string> = {
  pendiente: "bg-amber-100 text-amber-800 ring-amber-600/20",
  en_transito: "bg-blue-100 text-blue-800 ring-blue-600/20",
  entregado: "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
  cancelado: "bg-red-100 text-red-800 ring-red-600/20",
};
