"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  crearDespacho,
  actualizarDespacho,
  eliminarDespacho,
} from "@/db/queries";
import { ESTADOS, type EstadoDespacho } from "@/lib/estados";
import type { NuevoDespacho } from "@/db/schema";

export type EstadoFormulario = {
  error?: string;
  campos?: Record<string, string>;
} | null;

function parseFormulario(formData: FormData): NuevoDespacho | { error: string } {
  const transportista = String(formData.get("transportista") ?? "").trim();
  const destino = String(formData.get("destino") ?? "").trim();
  const fechaDespachoRaw = String(formData.get("fechaDespacho") ?? "").trim();
  const estado = String(formData.get("estado") ?? "pendiente").trim();

  if (!transportista) return { error: "El transportista es obligatorio." };
  if (!destino) return { error: "El destino es obligatorio." };
  if (!fechaDespachoRaw) return { error: "La fecha de despacho es obligatoria." };

  const fechaDespacho = new Date(fechaDespachoRaw);
  if (Number.isNaN(fechaDespacho.getTime())) {
    return { error: "La fecha de despacho no es válida." };
  }

  if (!ESTADOS.includes(estado as EstadoDespacho)) {
    return { error: "El estado seleccionado no es válido." };
  }

  const fechaEntregaEstimadaRaw = String(
    formData.get("fechaEntregaEstimada") ?? ""
  ).trim();
  const fechaEntregaEstimada = fechaEntregaEstimadaRaw
    ? new Date(fechaEntregaEstimadaRaw)
    : null;

  return {
    numeroGuia: String(formData.get("numeroGuia") ?? "").trim() || null,
    transportista,
    origen: String(formData.get("origen") ?? "").trim() || null,
    destino,
    ordenCompraRef: String(formData.get("ordenCompraRef") ?? "").trim() || null,
    estado: estado as EstadoDespacho,
    fechaDespacho,
    fechaEntregaEstimada,
    observaciones: String(formData.get("observaciones") ?? "").trim() || null,
  };
}

export async function crearDespachoAction(
  _prevState: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const resultado = parseFormulario(formData);
  if ("error" in resultado) {
    return { error: resultado.error };
  }

  await crearDespacho(resultado);
  revalidatePath("/despachos");
  redirect("/despachos");
}

export async function actualizarDespachoAction(
  id: string,
  _prevState: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const resultado = parseFormulario(formData);
  if ("error" in resultado) {
    return { error: resultado.error };
  }

  await actualizarDespacho(id, resultado);
  revalidatePath("/despachos");
  redirect("/despachos");
}

export async function eliminarDespachoAction(id: string) {
  await eliminarDespacho(id);
  revalidatePath("/despachos");
}
