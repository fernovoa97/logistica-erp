import { ESTADO_BADGE_CLASS, ESTADO_LABEL, type EstadoDespacho } from "@/lib/estados";

export function EstadoBadge({ estado }: { estado: EstadoDespacho }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${ESTADO_BADGE_CLASS[estado]}`}
    >
      {ESTADO_LABEL[estado]}
    </span>
  );
}
