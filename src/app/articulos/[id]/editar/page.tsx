import { notFound } from "next/navigation";
import { ArticuloForm } from "@/components/ArticuloForm";
import { actualizarArticuloAction } from "@/app/articulos/actions";
import { obtenerArticulo } from "@/db/queries/articulos";

export default async function EditarArticuloPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const articulo = await obtenerArticulo(id);

  if (!articulo) {
    notFound();
  }

  const action = actualizarArticuloAction.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Editar artículo</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Actualiza los datos de &quot;{articulo.descripcion}&quot;.
        </p>
      </div>
      <ArticuloForm action={action} articulo={articulo} submitLabel="Guardar cambios" />
    </div>
  );
}
