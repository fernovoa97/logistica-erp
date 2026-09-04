import {
  ESTADO_PROVEEDOR_BADGE_CLASS,
  ESTADO_PROVEEDOR_LABEL,
  type EstadoProveedor,
} from "@/lib/proveedores";

export function EstadoProveedorBadge({ estado }: { estado: EstadoProveedor }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${ESTADO_PROVEEDOR_BADGE_CLASS[estado]}`}
    >
      {ESTADO_PROVEEDOR_LABEL[estado]}
    </span>
  );
}
