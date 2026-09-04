import { notFound } from "next/navigation";
import { DespachoForm } from "@/components/DespachoForm";
import { actualizarDespachoAction } from "@/app/despachos/actions";
import { obtenerDespacho } from "@/db/queries/despachos";
import { listarTransportistasActivos } from "@/db/queries/transportistas";

export default async function EditarDespachoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const despacho = await obtenerDespacho(id);

  if (!despacho) {
    notFound();
  }

  const transportistasActivos = await listarTransportistasActivos();

  // Si el transportista asignado quedó inactivo, lo incluimos igual en la
  // lista para no perder la selección actual del despacho al editar.
  const transportistas = transportistasActivos.some(
    (t) => t.id === despacho.transportistaId
  )
    ? transportistasActivos
    : [despacho.transportista, ...transportistasActivos];

  const action = actualizarDespachoAction.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Editar despacho</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Actualiza los datos del despacho{" "}
          {despacho.numeroGuia ? `"${despacho.numeroGuia}"` : ""}.
        </p>
      </div>
      <DespachoForm
        action={action}
        despacho={despacho}
        transportistas={transportistas}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}
