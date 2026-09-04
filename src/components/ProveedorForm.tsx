"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ESTADOS_PROVEEDOR, ESTADO_PROVEEDOR_LABEL } from "@/lib/proveedores";
import type { Proveedor } from "@/db/schema";
import type { EstadoFormularioProveedor } from "@/app/proveedores/actions";

export function ProveedorForm({
  action,
  proveedor,
  submitLabel,
}: {
  action: (
    prevState: EstadoFormularioProveedor,
    formData: FormData
  ) => Promise<EstadoFormularioProveedor>;
  proveedor?: Proveedor;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState<
    EstadoFormularioProveedor,
    FormData
  >(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-5 max-w-2xl">
      {state?.error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-inset ring-red-200">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label htmlFor="nombre" className="text-sm font-medium text-zinc-700">
            Nombre / Razón social *
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            defaultValue={proveedor?.nombre}
            placeholder="Ej. Distribuidora Industrial SAC"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="documento" className="text-sm font-medium text-zinc-700">
            RUC
          </label>
          <input
            id="documento"
            name="documento"
            type="text"
            defaultValue={proveedor?.documento ?? ""}
            placeholder="Ej. 20123456789"
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
            defaultValue={proveedor?.estado ?? "activo"}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          >
            {ESTADOS_PROVEEDOR.map((estado) => (
              <option key={estado} value={estado}>
                {ESTADO_PROVEEDOR_LABEL[estado]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="contactoNombre" className="text-sm font-medium text-zinc-700">
            Persona de contacto
          </label>
          <input
            id="contactoNombre"
            name="contactoNombre"
            type="text"
            defaultValue={proveedor?.contactoNombre ?? ""}
            placeholder="Ej. María López"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="telefono" className="text-sm font-medium text-zinc-700">
            Teléfono
          </label>
          <input
            id="telefono"
            name="telefono"
            type="text"
            defaultValue={proveedor?.telefono ?? ""}
            placeholder="Ej. 987 654 321"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-zinc-700">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={proveedor?.email ?? ""}
            placeholder="Ej. ventas@proveedor.pe"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <label htmlFor="direccion" className="text-sm font-medium text-zinc-700">
            Dirección
          </label>
          <input
            id="direccion"
            name="direccion"
            type="text"
            defaultValue={proveedor?.direccion ?? ""}
            placeholder="Ej. Av. Industrial 123, Lima"
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
          defaultValue={proveedor?.observaciones ?? ""}
          placeholder="Notas adicionales sobre el proveedor..."
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
          href="/proveedores"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
