import { ClienteForm } from "@/components/ClienteForm";
import { crearClienteAction } from "@/app/clientes/actions";

export default function NuevoClientePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Nuevo cliente</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Completa los datos del cliente (mina). Los campos marcados con * son obligatorios.
        </p>
      </div>
      <ClienteForm action={crearClienteAction} submitLabel="Crear cliente" />
    </div>
  );
}
