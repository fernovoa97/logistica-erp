import { notFound } from "next/navigation";
import { PedidoVentaForm } from "@/components/PedidoVentaForm";
import { actualizarPedidoVentaAction } from "@/app/pedidos-venta/actions";
import { obtenerPedidoVenta } from "@/db/queries/pedidos-venta";
import { listarClientesActivos } from "@/db/queries/clientes";
import { listarArticulosActivos } from "@/db/queries/articulos";

export const dynamic = "force-dynamic";

export default async function EditarPedidoVentaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pedidoVenta = await obtenerPedidoVenta(id);

  if (!pedidoVenta) {
    notFound();
  }

  const [clientesActivos, articulosActivos] = await Promise.all([
    listarClientesActivos(),
    listarArticulosActivos(),
  ]);

  // Si el cliente asignado quedó inactivo, lo incluimos igual para no perder
  // la selección actual del pedido al editar. Lo mismo para los artículos
  // que ya están en las líneas del pedido.
  const clientes = clientesActivos.some((c) => c.id === pedidoVenta.clienteId)
    ? clientesActivos
    : [pedidoVenta.cliente, ...clientesActivos];

  const idsArticulosActivos = new Set(articulosActivos.map((a) => a.id));
  const articulosFaltantes = pedidoVenta.items
    .map((item) => item.articulo)
    .filter((a) => !idsArticulosActivos.has(a.id));
  const articulosPorId = new Map(articulosFaltantes.map((a) => [a.id, a]));
  const articulos = [...articulosPorId.values(), ...articulosActivos];

  const action = actualizarPedidoVentaAction.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Editar pedido de venta</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Actualiza los datos del pedido{" "}
          {pedidoVenta.numeroOcCliente ? `"${pedidoVenta.numeroOcCliente}"` : ""}.
        </p>
      </div>
      <PedidoVentaForm
        action={action}
        pedidoVenta={pedidoVenta}
        clientes={clientes}
        articulos={articulos}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}
