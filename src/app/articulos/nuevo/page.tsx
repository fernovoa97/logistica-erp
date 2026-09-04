import { ArticuloForm } from "@/components/ArticuloForm";
import { crearArticuloAction } from "@/app/articulos/actions";

export default function NuevoArticuloPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Nuevo artículo</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Completa los datos del artículo. Los campos marcados con * son obligatorios.
        </p>
      </div>
      <ArticuloForm action={crearArticuloAction} submitLabel="Crear artículo" />
    </div>
  );
}
