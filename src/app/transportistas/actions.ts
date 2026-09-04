"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  crearTransportista,
  actualizarTransportista,
  eliminarTransportista,
  contarDespachosDeTransportista,
} from "@/db/queries/transportistas";
import {
  ESTADOS_TRANSPORTISTA,
  type EstadoTransportista,
} from "@/lib/transportistas";
import type { NuevoTransportista } from "@/db/schema";

export type EstadoFormularioTransportista = {
  error?: string;
} | null;

function parseFormulario(
  formData: FormData
): NuevoTransportista | { error: string } {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const estado = String(formData.get("estado") ?? "activo").trim();

  if (!nombre) return { error: "El nombre del transportista es obligatorio." };
  if (!ESTADOS_TRANSPORTISTA.includes(estado as EstadoTransportista)) {
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
    vehiculoPlaca: String(formData.get("vehiculoPlaca") ?? "").trim() || null,
    vehiculoTipo: String(formData.get("vehiculoTipo") ?? "").trim() || null,
    estado: estado as EstadoTransportista,
    observaciones: String(formData.get("observaciones") ?? "").trim() || null,
  };
}

export async function crearTransportistaAction(
  _prevState: EstadoFormularioTransportista,
  formData: FormData
): Promise<EstadoFormularioTransportista> {
  const resultado = parseFormulario(formData);
  if ("error" in resultado) {
    return { error: resultado.error };
  }

  await crearTransportista(resultado);
  revalidatePath("/transportistas");
  redirect("/transportistas");
}

export async function actualizarTransportistaAction(
  id: string,
  _prevState: EstadoFormularioTransportista,
  formData: FormData
): Promise<EstadoFormularioTransportista> {
  const resultado = parseFormulario(formData);
  if ("error" in resultado) {
    return { error: resultado.error };
  }

  await actualizarTransportista(id, resultado);
  revalidatePath("/transportistas");
  revalidatePath("/despachos");
  redirect("/transportistas");
}

export async function eliminarTransportistaAction(
  id: string
): Promise<{ error?: string }> {
  const despachosAsociados = await contarDespachosDeTransportista(id);
  if (despachosAsociados > 0) {
    return {
      error: `No se puede eliminar: tiene ${despachosAsociados} despacho${
        despachosAsociados === 1 ? "" : "s"
      } asociado${despachosAsociados === 1 ? "" : "s"}. Márcalo como "Inactivo" en vez de eliminarlo, o reasigna esos despachos primero.`,
    };
  }

  await eliminarTransportista(id);
  revalidatePath("/transportistas");
  return {};
}
