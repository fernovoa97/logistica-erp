import Link from "next/link";
import { listarTransportistas } from "@/db/queries/transportistas";
import {
  ESTADOS_TRANSPORTISTA,
  ESTADO_TRANSPORTISTA_LABEL,
  type EstadoTransportista,
} from "@/lib/transportistas";
import { EstadoTransportistaBadge } from "@/components/EstadoTransportistaBadge";
import { DeleteTransportistaButton } from "@/components/DeleteTransportistaButton";

export default async function TransportistasPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; q?: string }>;
}) {
  const params = await searchParams;
  const estadoFiltro =
    params.estado && ESTADOS_TRANSPORTISTA.includes(params.estado as EstadoTransportista)
      ? (params.estado as EstadoTransportista)
      : "todos";
  const q = params.q ?? "";

  const transportistas = await listarTransportistas({ estado: estadoFiltro, q });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Transportistas</h1>
          <p className="mt-1 text-sm text-zinc-600">
            {transportistas.length} transportista{transportistas.length === 1 ? "" : "s"}{" "}
            registrado{transportistas.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/transportistas/nuevo"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          + Nuevo transportista
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
            placeholder="Nombre, RUC/DNI, contacto, placa..."
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
            {ESTADOS_TRANSPORTISTA.map((estado) => (
              <option key={estado} value={estado}>
                {ESTADO_TRANSPORTISTA_LABEL[estado]}
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
            href="/transportistas"
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
              <th className="px-4 py-3 text-left font-medium text-zinc-600">RUC/DNI</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Contacto</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Vehículo</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Estado</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Despachos</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {transportistas.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-zinc-500">
                  No hay transportistas que coincidan con el filtro.
                </td>
              </tr>
            )}
            {transportistas.map((t) => (
              <tr key={t.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3 font-medium text-zinc-800">{t.nombre}</td>
                <td className="px-4 py-3 text-zinc-600">{t.documento || "—"}</td>
                <td className="px-4 py-3 text-zinc-600">
                  {t.contactoNombre || t.telefono || t.email ? (
                    <div className="flex flex-col">
                      {t.contactoNombre && <span>{t.contactoNombre}</span>}
                      {t.telefono && <span className="text-xs text-zinc-500">{t.telefono}</span>}
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-600">
                  {t.vehiculoPlaca || t.vehiculoTipo ? (
                    <div className="flex flex-col">
                      {t.vehiculoPlaca && <span>{t.vehiculoPlaca}</span>}
                      {t.vehiculoTipo && (
                        <span className="text-xs text-zinc-500">{t.vehiculoTipo}</span>
                      )}
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3">
                  <EstadoTransportistaBadge estado={t.estado} />
                </td>
                <td className="px-4 py-3 text-zinc-600">{t.despachosCount}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/transportistas/${t.id}/editar`}
                      className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
                    >
                      Editar
                    </Link>
                    <DeleteTransportistaButton id={t.id} nombre={t.nombre} />
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
