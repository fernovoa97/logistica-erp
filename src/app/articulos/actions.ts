"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  crearArticulo,
  actualizarArticulo,
  eliminarArticulo,
  contarUsosDeArticulo,
} from "@/db/queries/articulos";
import { ESTADOS_ARTICULO, type EstadoArticulo } from "@/lib/articulos";
import type { NuevoArticulo } from "@/db/schema";

export type EstadoFormularioArticulo = {
  error?: string;
} | null;

function parseFormulario(formData: FormData): NuevoArticulo | { error: string } {
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const estado = String(formData.get("estado") ?? "activo").trim();

  if (!descripcion) return { error: "La descripción del artículo es obligatoria." };
  if (!ESTADOS_ARTICULO.includes(estado as EstadoArticulo)) {
    return { error: "El estado seleccionado no es válido." };
  }

  return {
    codigo: String(formData.get("codigo") ?? "").trim() || null,
    descripcion,
    marca: String(formData.get("marca") ?? "").trim() || null,
    unidadMedida: String(formData.get("unidadMedida") ?? "").trim() || null,
    estado: estado as EstadoArticulo,
    observaciones: String(formData.get("observaciones") ?? "").trim() || null,
  };
}

export async function crearArticuloAction(
  _prevState: EstadoFormularioArticulo,
  formData: FormData
): Promise<EstadoFormularioArticulo> {
  const resultado = parseFormulario(formData);
  if ("error" in resultado) {
    return { error: resultado.error };
  }

  await crearArticulo(resultado);
  revalidatePath("/articulos");
  redirect("/articulos");
}

export async function actualizarArticuloAction(
  id: string,
  _prevState: EstadoFormularioArticulo,
  formData: FormData
): Promise<EstadoFormularioArticulo> {
  const resultado = parseFormulario(formData);
  if ("error" in resultado) {
    return { error: resultado.error };
  }

  await actualizarArticulo(id, resultado);
  revalidatePath("/articulos");
  revalidatePath("/pedidos-venta");
  redirect("/articulos");
}

export async function eliminarArticuloAction(
  id: string
): Promise<{ error?: string }> {
  const usosAsociados = await contarUsosDeArticulo(id);
  if (usosAsociados > 0) {
    return {
      error: `No se puede eliminar: el artículo aparece en ${usosAsociados} línea${
        usosAsociados === 1 ? "" : "s"
      } de pedidos de venta. Márcalo como "Inactivo" en vez de eliminarlo.`,
    };
  }

  await eliminarArticulo(id);
  revalidatePath("/articulos");
  return {};
}
