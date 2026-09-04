import Link from "next/link";
import { listarArticulos } from "@/db/queries/articulos";
import {
  ESTADOS_ARTICULO,
  ESTADO_ARTICULO_LABEL,
  type EstadoArticulo,
} from "@/lib/articulos";
import { EstadoArticuloBadge } from "@/components/EstadoArticuloBadge";
import { DeleteArticuloButton } from "@/components/DeleteArticuloButton";

export default async function ArticulosPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; q?: string }>;
}) {
  const params = await searchParams;
  const estadoFiltro =
    params.estado && ESTADOS_ARTICULO.includes(params.estado as EstadoArticulo)
      ? (params.estado as EstadoArticulo)
      : "todos";
  const q = params.q ?? "";

  const articulos = await listarArticulos({ estado: estadoFiltro, q });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Artículos</h1>
          <p className="mt-1 text-sm text-zinc-600">
            {articulos.length} artículo{articulos.length === 1 ? "" : "s"} registrado
            {articulos.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/articulos/nuevo"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          + Nuevo artículo
        </Link>
      </div>

      <form className="flex flex-wrap items-end gap-3" method="get">
        <div className="flex flex-col gap-1">
          <label htmlFor="q" className="text-xs font-medium text-zinc-600">
            Buscar
          </label>
          <input
            id="q"
            name="q"
            type="text"
            defaultValue={q}
            placeholder="Código, descripción, marca..."
            className="w-64 rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="estado" className="text-xs font-medium text-zinc-600">
            Estado
          </label>
          <select
            id="estado"
            name="estado"
            defaultValue={estadoFiltro}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          >
            <option value="todos">Todos</option>
            {ESTADOS_ARTICULO.map((estado) => (
              <option key={estado} value={estado}>
                {ESTADO_ARTICULO_LABEL[estado]}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
        >
          Filtrar
        </button>
        {(q || estadoFiltro !== "todos") && (
          <Link
            href="/articulos"
            className="text-sm font-medium text-zinc-500 hover:text-zinc-800"
          >
            Limpiar filtros
          </Link>
        )}
      </form>

      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
        <table className="min-w-full divide-y divide-zinc-200 text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Código</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Descripción</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Marca</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Unidad</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Estado</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Usos</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {articulos.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-zinc-500">
                  No hay artículos que coincidan con el filtro.
                </td>
              </tr>
            )}
            {articulos.map((a) => (
              <tr key={a.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3 text-zinc-600">{a.codigo || "—"}</td>
                <td className="px-4 py-3 font-medium text-zinc-800">{a.descripcion}</td>
                <td className="px-4 py-3 text-zinc-600">{a.marca || "—"}</td>
                <td className="px-4 py-3 text-zinc-600">{a.unidadMedida || "—"}</td>
                <td className="px-4 py-3">
                  <EstadoArticuloBadge estado={a.estado} />
                </td>
                <td className="px-4 py-3 text-zinc-600">{a.usosCount}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/articulos/${a.id}/editar`}
                      className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
                    >
                      Editar
                    </Link>
                    <DeleteArticuloButton id={a.id} descripcion={a.descripcion} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
