import { PedidoVentaForm } from "@/components/PedidoVentaForm";
import { crearPedidoVentaAction } from "@/app/pedidos-venta/actions";
import { listarClientesActivos } from "@/db/queries/clientes";
import { listarArticulosActivos } from "@/db/queries/articulos";

// Se lee en cada visita (no se prerenderiza como estática) para que un
// cliente o artículo nuevo aparezca de inmediato en los selectores.
export const dynamic = "force-dynamic";

export default async function NuevoPedidoVentaPage() {
  const [clientes, articulos] = await Promise.all([
    listarClientesActivos(),
    listarArticulosActivos(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Nuevo pedido de venta</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Ingresa la OC del cliente como pedido de venta. Los campos marcados con * son
          obligatorios.
        </p>
      </div>
      <PedidoVentaForm
        action={crearPedidoVentaAction}
        clientes={clientes}
        articulos={articulos}
        submitLabel="Crear pedido de venta"
      />
    </div>
  );
}
