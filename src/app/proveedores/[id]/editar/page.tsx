import { notFound } from "next/navigation";
import { ProveedorForm } from "@/components/ProveedorForm";
import { actualizarProveedorAction } from "@/app/proveedores/actions";
import { obtenerProveedor } from "@/db/queries/proveedores";

export default async function EditarProveedorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const proveedor = await obtenerProveedor(id);

  if (!proveedor) {
    notFound();
  }

  const action = actualizarProveedorAction.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Editar proveedor</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Actualiza los datos de &quot;{proveedor.nombre}&quot;.
        </p>
      </div>
      <ProveedorForm action={action} proveedor={proveedor} submitLabel="Guardar cambios" />
    </div>
  );
}
