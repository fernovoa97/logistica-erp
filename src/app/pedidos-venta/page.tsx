import Link from "next/link";
import { listarPedidosVenta } from "@/db/queries/pedidos-venta";
import {
  ESTADOS_PEDIDO_VENTA,
  ESTADO_PEDIDO_VENTA_LABEL,
  TIPO_VENTA_LABEL,
  MONEDA_SIMBOLO,
  type EstadoPedidoVenta,
} from "@/lib/pedidos-venta";
import { EstadoPedidoVentaBadge } from "@/components/EstadoPedidoVentaBadge";
import { DeletePedidoVentaButton } from "@/components/DeletePedidoVentaButton";

function formatearFecha(fecha: Date | null): string {
  if (!fecha) return "—";
  return new Date(fecha).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function PedidosVentaPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; q?: string }>;
}) {
  const params = await searchParams;
  const estadoFiltro =
    params.estado && ESTADOS_PEDIDO_VENTA.includes(params.estado as EstadoPedidoVenta)
      ? (params.estado as EstadoPedidoVenta)
      : "todos";
  const q = params.q ?? "";

  const pedidos = await listarPedidosVenta({ estado: estadoFiltro, q });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pedidos de venta</h1>
          <p className="mt-1 text-sm text-zinc-600">
            {pedidos.length} pedido{pedidos.length === 1 ? "" : "s"} registrado
            {pedidos.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/pedidos-venta/nuevo"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          + Nuevo pedido de venta
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
            placeholder="N° OC, cliente..."
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
            {ESTADOS_PEDIDO_VENTA.map((estado) => (
              <option key={estado} value={estado}>
                {ESTADO_PEDIDO_VENTA_LABEL[estado]}
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
            href="/pedidos-venta"
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
              <th className="px-4 py-3 text-left font-medium text-zinc-600">N° OC cliente</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Cliente</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Fecha</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Tipo</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Moneda</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Estado</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {pedidos.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-zinc-500">
                  No hay pedidos de venta que coincidan con el filtro.
                </td>
              </tr>
            )}
            {pedidos.map((pedido) => (
              <tr key={pedido.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3 font-medium text-zinc-800">
                  {pedido.numeroOcCliente || "—"}
                </td>
                <td className="px-4 py-3 text-zinc-600">{pedido.cliente.nombre}</td>
                <td className="px-4 py-3 text-zinc-600">{formatearFecha(pedido.fecha)}</td>
                <td className="px-4 py-3 text-zinc-600">{TIPO_VENTA_LABEL[pedido.tipoVenta]}</td>
                <td className="px-4 py-3 text-zinc-600">{MONEDA_SIMBOLO[pedido.moneda]}</td>
                <td className="px-4 py-3">
                  <EstadoPedidoVentaBadge estado={pedido.estado} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/pedidos-venta/${pedido.id}/editar`}
                      className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
                    >
                      Editar
                    </Link>
                    <DeletePedidoVentaButton
                      id={pedido.id}
                      descripcion={pedido.numeroOcCliente || pedido.cliente.nombre}
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
