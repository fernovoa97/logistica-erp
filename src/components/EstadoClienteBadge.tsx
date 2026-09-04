import {
  ESTADO_CLIENTE_BADGE_CLASS,
  ESTADO_CLIENTE_LABEL,
  type EstadoCliente,
} from "@/lib/clientes";

export function EstadoClienteBadge({ estado }: { estado: EstadoCliente }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${ESTADO_CLIENTE_BADGE_CLASS[estado]}`}
    >
      {ESTADO_CLIENTE_LABEL[estado]}
    </span>
  );
}
