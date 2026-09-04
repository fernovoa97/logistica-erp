import { TransportistaForm } from "@/components/TransportistaForm";
import { crearTransportistaAction } from "@/app/transportistas/actions";

export default function NuevoTransportistaPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Nuevo transportista</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Completa los datos del transportista. Los campos marcados con * son obligatorios.
        </p>
      </div>
      <TransportistaForm action={crearTransportistaAction} submitLabel="Crear transportista" />
    </div>
  );
}
