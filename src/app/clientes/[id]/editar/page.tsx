import { notFound } from "next/navigation";
import { ClienteForm } from "@/components/ClienteForm";
import { actualizarClienteAction } from "@/app/clientes/actions";
import { obtenerCliente } from "@/db/queries/clientes";

export default async function EditarClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cliente = await obtenerCliente(id);

  if (!cliente) {
    notFound();
  }

  const action = actualizarClienteAction.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Editar cliente</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Actualiza los datos de &quot;{cliente.nombre}&quot;.
        </p>
      </div>
      <ClienteForm action={action} cliente={cliente} submitLabel="Guardar cambios" />
    </div>
  );
}
