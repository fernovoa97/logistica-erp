import { OrdenCompraForm } from "@/components/OrdenCompraForm";
import { crearOrdenCompraAction } from "@/app/ordenes-compra/actions";
import { listarProveedoresActivos } from "@/db/queries/proveedores";

// La lista de proveedores se lee en cada visita para que un proveedor nuevo
// aparezca de inmediato en el selector, sin esperar a un nuevo build.
export const dynamic = "force-dynamic";

export default async function NuevaOrdenCompraPage() {
  const proveedores = await listarProveedoresActivos();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Nueva orden de compra</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Completa los datos de la orden. Los campos marcados con * son obligatorios.
        </p>
      </div>
      <OrdenCompraForm
        action={crearOrdenCompraAction}
        proveedores={proveedores}
        submitLabel="Crear orden de compra"
      />
    </div>
  );
}
