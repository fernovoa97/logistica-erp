"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { eliminarArticuloAction } from "@/app/articulos/actions";

export function DeleteArticuloButton({
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
            `¿Eliminar el artículo "${descripcion}"? Esta acción no se puede deshacer.`
          );
          if (!confirmado) return;

          setError(null);
          startTransition(async () => {
            const resultado = await eliminarArticuloAction(id);
            if (resultado.error) {
              setError(resultado.error);
            } else {
              router.refresh();
            }
          });
        }}
        className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
      >
        {isPending ? "Eliminando..." : "Eliminar"}
      </button>
      {error && <p className="max-w-[220px] text-right text-xs text-red-600">{error}</p>}
    </div>
  );
}
