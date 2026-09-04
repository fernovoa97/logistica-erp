"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ESTADOS, ESTADO_LABEL } from "@/lib/estados";
import type { DespachoConTransportista, Transportista } from "@/db/schema";
import type { EstadoFormulario } from "@/app/despachos/actions";

function aFechaInput(fecha: Date | null | undefined): string {
  if (!fecha) return "";
  const d = new Date(fecha);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

export function DespachoForm({
  action,
  despacho,
  transportistas,
  submitLabel,
}: {
  action: (prevState: EstadoFormulario, formData: FormData) => Promise<EstadoFormulario>;
  despacho?: DespachoConTransportista;
  transportistas: Transportista[];
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState<EstadoFormulario, FormData>(
    action,
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-5 max-w-2xl">
      {state?.error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-inset ring-red-200">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="transportistaId" className="text-sm font-medium text-zinc-700">
            Transportista *
          </label>
          <select
            id="transportistaId"
            name="transportistaId"
            required
            defaultValue={despacho?.transportistaId ?? ""}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          >
            <option value="" disabled>
              Selecciona un transportista...
            </option>
            {transportistas.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
                {t.estado === "inactivo" ? " (inactivo)" : ""}
              </option>
            ))}
          </select>
          {transportistas.length === 0 && (
            <p className="text-xs text-zinc-500">
              No hay transportistas registrados todavía.{" "}
              <Link href="/transportistas/nuevo" className="underline">
                Crea uno primero
              </Link>
              .
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="numeroGuia" className="text-sm font-medium text-zinc-700">
            Número de guía
          </label>
          <input
            id="numeroGuia"
            name="numeroGuia"
            type="text"
            defaultValue={despacho?.numeroGuia ?? ""}
            placeholder="Ej. T001-000123"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="origen" className="text-sm font-medium text-zinc-700">
            Origen
          </label>
          <input
            id="origen"
            name="origen"
            type="text"
            defaultValue={despacho?.origen ?? ""}
            placeholder="Ej. Almacén Lima"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="destino" className="text-sm font-medium text-zinc-700">
            Destino *
          </label>
          <input
            id="destino"
            name="destino"
            type="text"
            required
            defaultValue={despacho?.destino}
            placeholder="Ej. Arequipa"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="ordenCompraRef" className="text-sm font-medium text-zinc-700">
            Orden de compra (referencia)
          </label>
          <input
            id="ordenCompraRef"
            name="ordenCompraRef"
            type="text"
            defaultValue={despacho?.ordenCompraRef ?? ""}
            placeholder="Ej. OC-2026-045"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="estado" className="text-sm font-medium text-zinc-700">
            Estado *
          </label>
          <select
            id="estado"
            name="estado"
            defaultValue={despacho?.estado ?? "pendiente"}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          >
            {ESTADOS.map((estado) => (
              <option key={estado} value={estado}>
                {ESTADO_LABEL[estado]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="fechaDespacho" className="text-sm font-medium text-zinc-700">
            Fecha de despacho *
          </label>
          <input
            id="fechaDespacho"
            name="fechaDespacho"
            type="date"
            required
            defaultValue={aFechaInput(despacho?.fechaDespacho)}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="fechaEntregaEstimada" className="text-sm font-medium text-zinc-700">
            Fecha estimada de entrega
          </label>
          <input
            id="fechaEntregaEstimada"
            name="fechaEntregaEstimada"
            type="date"
            defaultValue={aFechaInput(despacho?.fechaEntregaEstimada)}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="observaciones" className="text-sm font-medium text-zinc-700">
          Observaciones
        </label>
        <textarea
          id="observaciones"
          name="observaciones"
          rows={3}
          defaultValue={despacho?.observaciones ?? ""}
          placeholder="Notas adicionales sobre el despacho..."
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          {isPending ? "Guardando..." : submitLabel}
        </button>
        <Link
          href="/despachos"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
