import {
  ESTADO_TRANSPORTISTA_BADGE_CLASS,
  ESTADO_TRANSPORTISTA_LABEL,
  type EstadoTransportista,
} from "@/lib/transportistas";

export function EstadoTransportistaBadge({ estado }: { estado: EstadoTransportista }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${ESTADO_TRANSPORTISTA_BADGE_CLASS[estado]}`}
    >
      {ESTADO_TRANSPORTISTA_LABEL[estado]}
    </span>
  );
}
