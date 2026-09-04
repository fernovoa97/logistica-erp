import { ESTADO_OC_BADGE_CLASS, ESTADO_OC_LABEL, type EstadoOC } from "@/lib/ordenes-compra";

export function EstadoOCBadge({ estado }: { estado: EstadoOC }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${ESTADO_OC_BADGE_CLASS[estado]}`}
    >
      {ESTADO_OC_LABEL[estado]}
    </span>
  );
}
