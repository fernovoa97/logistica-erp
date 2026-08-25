import { DespachoForm } from "@/components/DespachoForm";
import { crearDespachoAction } from "@/app/despachos/actions";

export default function NuevoDespachoPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Nuevo despacho</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Completa los datos del despacho. Los campos marcados con * son obligatorios.
        </p>
      </div>
      <DespachoForm action={crearDespachoAction} submitLabel="Crear despacho" />
    </div>
  );
}
