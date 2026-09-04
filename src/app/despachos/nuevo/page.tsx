import { DespachoForm } from "@/components/DespachoForm";
import { crearDespachoAction } from "@/app/despachos/actions";
import { listarTransportistasActivos } from "@/db/queries/transportistas";
import { listarOrdenesCompraSelector } from "@/db/queries/ordenes-compra";

// La lista de transportistas y órdenes de compra se lee en cada visita (no
// se prerenderiza como estática) para que un registro nuevo aparezca de
// inmediato en los selectores, sin esperar a un nuevo build.
export const dynamic = "force-dynamic";

export default async function NuevoDespachoPage() {
  const [transportistas, ordenesCompra] = await Promise.all([
    listarTransportistasActivos(),
    listarOrdenesCompraSelector(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Nuevo despacho</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Completa los datos del despacho. Los campos marcados con * son obligatorios.
        </p>
      </div>
      <DespachoForm
        action={crearDespachoAction}
        transportistas={transportistas}
        ordenesCompra={ordenesCompra}
        submitLabel="Crear despacho"
      />
    </div>
  );
}
