"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ESTADOS_ARTICULO, ESTADO_ARTICULO_LABEL } from "@/lib/articulos";
import type { Articulo } from "@/db/schema";
import type { EstadoFormularioArticulo } from "@/app/articulos/actions";

export function ArticuloForm({
  action,
  articulo,
  submitLabel,
}: {
  action: (
    prevState: EstadoFormularioArticulo,
    formData: FormData
  ) => Promise<EstadoFormularioArticulo>;
  articulo?: Articulo;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState<
    EstadoFormularioArticulo,
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
          <label htmlFor="descripcion" className="text-sm font-medium text-zinc-700">
            Descripción *
          </label>
          <input
            id="descripcion"
            name="descripcion"
            type="text"
            required
            defaultValue={articulo?.descripcion}
            placeholder="Ej. Broca tricónica 8 1/2&quot;"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="codigo" className="text-sm font-medium text-zinc-700">
            Código
          </label>
          <input
            id="codigo"
            name="codigo"
            type="text"
            defaultValue={articulo?.codigo ?? ""}
            placeholder="Ej. ART-00123"
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
            defaultValue={articulo?.estado ?? "activo"}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          >
            {ESTADOS_ARTICULO.map((estado) => (
              <option key={estado} value={estado}>
                {ESTADO_ARTICULO_LABEL[estado]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="marca" className="text-sm font-medium text-zinc-700">
            Marca
          </label>
          <input
            id="marca"
            name="marca"
            type="text"
            defaultValue={articulo?.marca ?? ""}
            placeholder="Ej. Sandvik"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="unidadMedida" className="text-sm font-medium text-zinc-700">
            Unidad de medida
          </label>
          <input
            id="unidadMedida"
            name="unidadMedida"
            type="text"
            defaultValue={articulo?.unidadMedida ?? ""}
            placeholder="Ej. UND, SET, M"
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
          defaultValue={articulo?.observaciones ?? ""}
          placeholder="Notas adicionales sobre el artículo..."
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
        <Link href="/articulos" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
