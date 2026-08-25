"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { eliminarDespachoAction } from "@/app/despachos/actions";

export function DeleteDespachoButton({
  id,
  descripcion,
}: {
  id: string;
  descripcion: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          const confirmado = window.confirm(
            `¿Eliminar el despacho "${descripcion}"? Esta acción no se puede deshacer.`
          );
          if (!confirmado) return;

          setError(null);
          startTransition(async () => {
            try {
              await eliminarDespachoAction(id);
              router.refresh();
            } catch {
              setError("No se pudo eliminar el despacho.");
            }
          });
        }}
        className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
      >
        {isPending ? "Eliminando..." : "Eliminar"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
