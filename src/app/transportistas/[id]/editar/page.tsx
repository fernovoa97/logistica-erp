import { notFound } from "next/navigation";
import { TransportistaForm } from "@/components/TransportistaForm";
import { actualizarTransportistaAction } from "@/app/transportistas/actions";
import { obtenerTransportista } from "@/db/queries/transportistas";

export default async function EditarTransportistaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const transportista = await obtenerTransportista(id);

  if (!transportista) {
    notFound();
  }

  const action = actualizarTransportistaAction.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Editar transportista</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Actualiza los datos de &quot;{transportista.nombre}&quot;.
        </p>
      </div>
      <TransportistaForm
        action={action}
        transportista={transportista}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}
