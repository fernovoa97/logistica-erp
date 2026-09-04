"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor,
  contarOrdenesDeProveedor,
} from "@/db/queries/proveedores";
import { ESTADOS_PROVEEDOR, type EstadoProveedor } from "@/lib/proveedores";
import type { NuevoProveedor } from "@/db/schema";

export type EstadoFormularioProveedor = {
  error?: string;
} | null;

function parseFormulario(formData: FormData): NuevoProveedor | { error: string } {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const estado = String(formData.get("estado") ?? "activo").trim();

  if (!nombre) return { error: "El nombre del proveedor es obligatorio." };
  if (!ESTADOS_PROVEEDOR.includes(estado as EstadoProveedor)) {
    return { error: "El estado seleccionado no es válido." };
  }

  const email = String(formData.get("email") ?? "").trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "El correo electrónico no es válido." };
  }

  return {
    nombre,
    documento: String(formData.get("documento") ?? "").trim() || null,
    contactoNombre: String(formData.get("contactoNombre") ?? "").trim() || null,
    telefono: String(formData.get("telefono") ?? "").trim() || null,
    email: email || null,
    direccion: String(formData.get("direccion") ?? "").trim() || null,
    estado: estado as EstadoProveedor,
    observaciones: String(formData.get("observaciones") ?? "").trim() || null,
  };
}

export async function crearProveedorAction(
  _prevState: EstadoFormularioProveedor,
  formData: FormData
): Promise<EstadoFormularioProveedor> {
  const resultado = parseFormulario(formData);
  if ("error" in resultado) {
    return { error: resultado.error };
  }

  await crearProveedor(resultado);
  revalidatePath("/proveedores");
  redirect("/proveedores");
}

export async function actualizarProveedorAction(
  id: string,
  _prevState: EstadoFormularioProveedor,
  formData: FormData
): Promise<EstadoFormularioProveedor> {
  const resultado = parseFormulario(formData);
  if ("error" in resultado) {
    return { error: resultado.error };
  }

  await actualizarProveedor(id, resultado);
  revalidatePath("/proveedores");
  revalidatePath("/ordenes-compra");
  redirect("/proveedores");
}

export async function eliminarProveedorAction(
  id: string
): Promise<{ error?: string }> {
  const ordenesAsociadas = await contarOrdenesDeProveedor(id);
  if (ordenesAsociadas > 0) {
    return {
      error: `No se puede eliminar: tiene ${ordenesAsociadas} orden${
        ordenesAsociadas === 1 ? "" : "es"
      } de compra asociada${
        ordenesAsociadas === 1 ? "" : "s"
      }. Márcalo como "Inactivo" en vez de eliminarlo, o reasigna esas órdenes primero.`,
    };
  }

  await eliminarProveedor(id);
  revalidatePath("/proveedores");
  return {};
}
