import Link from "next/link";
import { listarClientes } from "@/db/queries/clientes";
import {
  ESTADOS_CLIENTE,
  ESTADO_CLIENTE_LABEL,
  type EstadoCliente,
} from "@/lib/clientes";
import { EstadoClienteBadge } from "@/components/EstadoClienteBadge";
import { DeleteClienteButton } from "@/components/DeleteClienteButton";

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; q?: string }>;
}) {
  const params = await searchParams;
  const estadoFiltro =
    params.estado && ESTADOS_CLIENTE.includes(params.estado as EstadoCliente)
      ? (params.estado as EstadoCliente)
      : "todos";
  const q = params.q ?? "";

  const clientes = await listarClientes({ estado: estadoFiltro, q });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
          <p className="mt-1 text-sm text-zinc-600">
            {clientes.length} cliente{clientes.length === 1 ? "" : "s"} registrado
            {clientes.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/clientes/nuevo"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          + Nuevo cliente
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
            placeholder="Nombre, RUC, contacto..."
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
            {ESTADOS_CLIENTE.map((estado) => (
              <option key={estado} value={estado}>
                {ESTADO_CLIENTE_LABEL[estado]}
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
            href="/clientes"
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
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Nombre</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">RUC</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Contacto</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Estado</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Pedidos</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {clientes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-zinc-500">
                  No hay clientes que coincidan con el filtro.
                </td>
              </tr>
            )}
            {clientes.map((c) => (
              <tr key={c.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3 font-medium text-zinc-800">{c.nombre}</td>
                <td className="px-4 py-3 text-zinc-600">{c.documento || "—"}</td>
                <td className="px-4 py-3 text-zinc-600">
                  {c.contactoNombre || c.telefono || c.email ? (
                    <div className="flex flex-col">
                      {c.contactoNombre && <span>{c.contactoNombre}</span>}
                      {c.telefono && <span className="text-xs text-zinc-500">{c.telefono}</span>}
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3">
                  <EstadoClienteBadge estado={c.estado} />
                </td>
                <td className="px-4 py-3 text-zinc-600">{c.pedidosCount}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/clientes/${c.id}/editar`}
                      className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
                    >
                      Editar
                    </Link>
                    <DeleteClienteButton id={c.id} nombre={c.nombre} />
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
