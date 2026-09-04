"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ESTADOS_CLIENTE, ESTADO_CLIENTE_LABEL } from "@/lib/clientes";
import type { Cliente } from "@/db/schema";
import type { EstadoFormularioCliente } from "@/app/clientes/actions";

export function ClienteForm({
  action,
  cliente,
  submitLabel,
}: {
  action: (
    prevState: EstadoFormularioCliente,
    formData: FormData
  ) => Promise<EstadoFormularioCliente>;
  cliente?: Cliente;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState<
    EstadoFormularioCliente,
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
            defaultValue={cliente?.nombre}
            placeholder="Ej. Compañía Minera XYZ S.A."
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
            defaultValue={cliente?.documento ?? ""}
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
            defaultValue={cliente?.estado ?? "activo"}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          >
            {ESTADOS_CLIENTE.map((estado) => (
              <option key={estado} value={estado}>
                {ESTADO_CLIENTE_LABEL[estado]}
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
            defaultValue={cliente?.contactoNombre ?? ""}
            placeholder="Ej. Juan Pérez"
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
            defaultValue={cliente?.telefono ?? ""}
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
            defaultValue={cliente?.email ?? ""}
            placeholder="Ej. compras@mina.pe"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <label htmlFor="direccion" className="text-sm font-medium text-zinc-700">
            Dirección / sede de la mina
          </label>
          <input
            id="direccion"
            name="direccion"
            type="text"
            defaultValue={cliente?.direccion ?? ""}
            placeholder="Ej. Unidad minera, distrito, provincia..."
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
          defaultValue={cliente?.observaciones ?? ""}
          placeholder="Notas adicionales sobre el cliente..."
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
        <Link href="/clientes" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
