"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ESTADOS_OC, ESTADO_OC_LABEL } from "@/lib/ordenes-compra";
import { aFechaInput } from "@/lib/fechas";
import type { OrdenCompraConProveedor, Proveedor } from "@/db/schema";
import type { EstadoFormularioOC } from "@/app/ordenes-compra/actions";

export function OrdenCompraForm({
  action,
  ordenCompra,
  proveedores,
  submitLabel,
}: {
  action: (
    prevState: EstadoFormularioOC,
    formData: FormData
  ) => Promise<EstadoFormularioOC>;
  ordenCompra?: OrdenCompraConProveedor;
  proveedores: Proveedor[];
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState<EstadoFormularioOC, FormData>(
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
          <label htmlFor="proveedorId" className="text-sm font-medium text-zinc-700">
            Proveedor *
          </label>
          <select
            id="proveedorId"
            name="proveedorId"
            required
            defaultValue={ordenCompra?.proveedorId ?? ""}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          >
            <option value="" disabled>
              Selecciona un proveedor...
            </option>
            {proveedores.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
                {p.estado === "inactivo" ? " (inactivo)" : ""}
              </option>
            ))}
          </select>
          {proveedores.length === 0 && (
            <p className="text-xs text-zinc-500">
              No hay proveedores registrados todavía.{" "}
              <Link href="/proveedores/nuevo" className="underline">
                Crea uno primero
              </Link>
              .
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="numeroOc" className="text-sm font-medium text-zinc-700">
            Número de OC
          </label>
          <input
            id="numeroOc"
            name="numeroOc"
            type="text"
            defaultValue={ordenCompra?.numeroOc ?? ""}
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
            defaultValue={ordenCompra?.estado ?? "pendiente"}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          >
            {ESTADOS_OC.map((estado) => (
              <option key={estado} value={estado}>
                {ESTADO_OC_LABEL[estado]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="montoTotal" className="text-sm font-medium text-zinc-700">
            Monto total (S/.)
          </label>
          <input
            id="montoTotal"
            name="montoTotal"
            type="number"
            step="0.01"
            min="0"
            defaultValue={ordenCompra?.montoTotal ?? ""}
            placeholder="Ej. 1500.00"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="fechaEmision" className="text-sm font-medium text-zinc-700">
            Fecha de emisión *
          </label>
          <input
            id="fechaEmision"
            name="fechaEmision"
            type="date"
            required
            defaultValue={aFechaInput(ordenCompra?.fechaEmision)}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="fechaEntregaEsperada" className="text-sm font-medium text-zinc-700">
            Fecha esperada de entrega
          </label>
          <input
            id="fechaEntregaEsperada"
            name="fechaEntregaEsperada"
            type="date"
            defaultValue={aFechaInput(ordenCompra?.fechaEntregaEsperada)}
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
          defaultValue={ordenCompra?.observaciones ?? ""}
          placeholder="Notas adicionales sobre la orden de compra..."
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
          href="/ordenes-compra"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
