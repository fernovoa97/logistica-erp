import { notFound } from "next/navigation";
import { OrdenCompraForm } from "@/components/OrdenCompraForm";
import { actualizarOrdenCompraAction } from "@/app/ordenes-compra/actions";
import { obtenerOrdenCompra } from "@/db/queries/ordenes-compra";
import { listarProveedoresActivos } from "@/db/queries/proveedores";

export default async function EditarOrdenCompraPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ordenCompra = await obtenerOrdenCompra(id);

  if (!ordenCompra) {
    notFound();
  }

  const proveedoresActivos = await listarProveedoresActivos();

  // Si el proveedor asignado quedó inactivo, lo incluimos igual en la lista
  // para no perder la selección actual al editar.
  const proveedores = proveedoresActivos.some((p) => p.id === ordenCompra.proveedorId)
    ? proveedoresActivos
    : [ordenCompra.proveedor, ...proveedoresActivos];

  const action = actualizarOrdenCompraAction.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Editar orden de compra</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Actualiza los datos de{" "}
          {ordenCompra.numeroOc ? `"${ordenCompra.numeroOc}"` : "esta orden de compra"}.
        </p>
      </div>
      <OrdenCompraForm
        action={action}
        ordenCompra={ordenCompra}
        proveedores={proveedores}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}
