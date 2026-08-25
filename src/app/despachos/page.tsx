import Link from "next/link";
import { listarDespachos } from "@/db/queries";
import { ESTADOS, ESTADO_LABEL, type EstadoDespacho } from "@/lib/estados";
import { EstadoBadge } from "@/components/EstadoBadge";
import { DeleteDespachoButton } from "@/components/DeleteDespachoButton";

function formatearFecha(fecha: Date | null): string {
  if (!fecha) return "—";
  return new Date(fecha).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function DespachosPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; q?: string }>;
}) {
  const params = await searchParams;
  const estadoFiltro =
    params.estado && ESTADOS.includes(params.estado as EstadoDespacho)
      ? (params.estado as EstadoDespacho)
      : "todos";
  const q = params.q ?? "";

  const despachos = await listarDespachos({ estado: estadoFiltro, q });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Despachos</h1>
          <p className="mt-1 text-sm text-zinc-600">
            {despachos.length} despacho{despachos.length === 1 ? "" : "s"} registrado
            {despachos.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/despachos/nuevo"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          + Nuevo despacho
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
            placeholder="Guía, transportista, destino, OC..."
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
            {ESTADOS.map((estado) => (
              <option key={estado} value={estado}>
                {ESTADO_LABEL[estado]}
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
            href="/despachos"
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
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Guía</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Transportista</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Origen → Destino</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">OC</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Estado</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">F. despacho</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">F. est. entrega</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {despachos.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-zinc-500">
                  No hay despachos que coincidan con el filtro.
                </td>
              </tr>
            )}
            {despachos.map((despacho) => (
              <tr key={despacho.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3 font-medium text-zinc-800">
                  {despacho.numeroGuia || "—"}
                </td>
                <td className="px-4 py-3">{despacho.transportista}</td>
                <td className="px-4 py-3 text-zinc-600">
                  {despacho.origen ? `${despacho.origen} → ` : ""}
                  {despacho.destino}
                </td>
                <td className="px-4 py-3 text-zinc-600">{despacho.ordenCompraRef || "—"}</td>
                <td className="px-4 py-3">
                  <EstadoBadge estado={despacho.estado} />
                </td>
                <td className="px-4 py-3 text-zinc-600">
                  {formatearFecha(despacho.fechaDespacho)}
                </td>
                <td className="px-4 py-3 text-zinc-600">
                  {formatearFecha(despacho.fechaEntregaEstimada)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/despachos/${despacho.id}/editar`}
                      className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
                    >
                      Editar
                    </Link>
                    <DeleteDespachoButton
                      id={despacho.id}
                      descripcion={despacho.numeroGuia || despacho.destino}
                    />
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
