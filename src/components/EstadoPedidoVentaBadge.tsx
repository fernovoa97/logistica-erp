import {
  ESTADO_PEDIDO_VENTA_BADGE_CLASS,
  ESTADO_PEDIDO_VENTA_LABEL,
  type EstadoPedidoVenta,
} from "@/lib/pedidos-venta";

export function EstadoPedidoVentaBadge({ estado }: { estado: EstadoPedidoVenta }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${ESTADO_PEDIDO_VENTA_BADGE_CLASS[estado]}`}
    >
      {ESTADO_PEDIDO_VENTA_LABEL[estado]}
    </span>
  );
}
