export const ESTADOS_PEDIDO_VENTA = [
  "pendiente",
  "en_preparacion",
  "despachado",
  "completado",
  "cancelado",
] as const;

export type EstadoPedidoVenta = (typeof ESTADOS_PEDIDO_VENTA)[number];

export const ESTADO_PEDIDO_VENTA_LABEL: Record<EstadoPedidoVenta, string> = {
  pendiente: "Pendiente",
  en_preparacion: "En preparación",
  despachado: "Despachado",
  completado: "Completado",
  cancelado: "Cancelado",
};

export const ESTADO_PEDIDO_VENTA_BADGE_CLASS: Record<EstadoPedidoVenta, string> = {
  pendiente: "bg-amber-100 text-amber-800 ring-amber-600/20",
  en_preparacion: "bg-blue-100 text-blue-800 ring-blue-600/20",
  despachado: "bg-violet-100 text-violet-800 ring-violet-600/20",
  completado: "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
  cancelado: "bg-red-100 text-red-800 ring-red-600/20",
};

export const TIPOS_VENTA = ["directa", "consignacion"] as const;
export type TipoVenta = (typeof TIPOS_VENTA)[number];
export const TIPO_VENTA_LABEL: Record<TipoVenta, string> = {
  directa: "Directa",
  consignacion: "Consignación",
};

export const MONEDAS = ["PEN", "USD"] as const;
export type Moneda = (typeof MONEDAS)[number];
export const MONEDA_LABEL: Record<Moneda, string> = {
  PEN: "Soles (S/.)",
  USD: "Dólares (US$)",
};
export const MONEDA_SIMBOLO: Record<Moneda, string> = {
  PEN: "S/.",
  USD: "US$",
};

export const CONDICIONES_VENTA = ["contado", "credito"] as const;
export type CondicionVenta = (typeof CONDICIONES_VENTA)[number];
export const CONDICION_VENTA_LABEL: Record<CondicionVenta, string> = {
  contado: "Contado",
  credito: "Crédito",
};

export const DIAS_CREDITO_OPCIONES = [7, 15, 30, 60, 90] as const;
