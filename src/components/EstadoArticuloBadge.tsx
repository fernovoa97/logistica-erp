import {
  ESTADO_ARTICULO_BADGE_CLASS,
  ESTADO_ARTICULO_LABEL,
  type EstadoArticulo,
} from "@/lib/articulos";

export function EstadoArticuloBadge({ estado }: { estado: EstadoArticulo }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${ESTADO_ARTICULO_BADGE_CLASS[estado]}`}
    >
      {ESTADO_ARTICULO_LABEL[estado]}
    </span>
  );
}
