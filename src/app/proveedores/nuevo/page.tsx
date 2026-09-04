import { ProveedorForm } from "@/components/ProveedorForm";
import { crearProveedorAction } from "@/app/proveedores/actions";

export default function NuevoProveedorPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Nuevo proveedor</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Completa los datos del proveedor. Los campos marcados con * son obligatorios.
        </p>
      </div>
      <ProveedorForm action={crearProveedorAction} submitLabel="Crear proveedor" />
    </div>
  );
}
