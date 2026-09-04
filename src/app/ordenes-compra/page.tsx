import Link from "next/link";
import { listarOrdenesCompra } from "@/db/queries/ordenes-compra";
import { ESTADOS_OC, ESTADO_OC_LABEL, type EstadoOC } from "@/lib/ordenes-compra";
import { EstadoOCBadge } from "@/components/EstadoOCBadge";
import { DeleteOrdenCompraButton } from "@/components/DeleteOrdenCompraButton";

function formatearFecha(fecha: Date | null): string {
  if (!fecha) return "—";
  return new Date(fecha).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatearMonto(monto: string | null): string {
  if (!monto) return "—";
  const numero = Number(monto);
  if (Number.isNaN(numero)) return "—";
  return `S/. ${numero.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`;
}

export default async function OrdenesCompraPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; q?: string }>;
}) {
  const params = await searchParams;
  const estadoFiltro =
    params.estado && ESTADOS_OC.includes(params.estado as EstadoOC)
      ? (params.estado as EstadoOC)
      : "todos";
  const q = params.q ?? "";

  const ordenes = await listarOrdenesCompra({ estado: estadoFiltro, q });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Órdenes de compra</h1>
          <p className="mt-1 text-sm text-zinc-600">
            {ordenes.length} orden{ordenes.length === 1 ? "" : "es"} registrada
            {ordenes.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/ordenes-compra/nuevo"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          + Nueva orden de compra
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
            placeholder="Número de OC, proveedor..."
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
            {ESTADOS_OC.map((estado) => (
              <option key={estado} value={estado}>
                {ESTADO_OC_LABEL[estado]}
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
            href="/ordenes-compra"
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
              <th className="px-4 py-3 text-left font-medium text-zinc-600">N° OC</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Proveedor</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Estado</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Monto</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">F. emisión</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">F. esperada</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {ordenes.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-zinc-500">
                  No hay órdenes de compra que coincidan con el filtro.
                </td>
              </tr>
            )}
            {ordenes.map((oc) => (
              <tr key={oc.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3 font-medium text-zinc-800">
                  {oc.numeroOc || "—"}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/proveedores/${oc.proveedor.id}/editar`}
                    className="hover:underline"
                  >
                    {oc.proveedor.nombre}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <EstadoOCBadge estado={oc.estado} />
                </td>
                <td className="px-4 py-3 text-zinc-600">{formatearMonto(oc.montoTotal)}</td>
                <td className="px-4 py-3 text-zinc-600">{formatearFecha(oc.fechaEmision)}</td>
                <td className="px-4 py-3 text-zinc-600">
                  {formatearFecha(oc.fechaEntregaEsperada)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/ordenes-compra/${oc.id}/editar`}
                      className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
                    >
                      Editar
                    </Link>
                    <DeleteOrdenCompraButton
                      id={oc.id}
                      descripcion={oc.numeroOc || oc.proveedor.nombre}
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
