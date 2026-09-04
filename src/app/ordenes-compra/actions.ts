"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  crearOrdenCompra,
  actualizarOrdenCompra,
  eliminarOrdenCompra,
} from "@/db/queries/ordenes-compra";
import { ESTADOS_OC, type EstadoOC } from "@/lib/ordenes-compra";
import type { NuevaOrdenCompra } from "@/db/schema";

export type EstadoFormularioOC = {
  error?: string;
} | null;

function parseFormulario(formData: FormData): NuevaOrdenCompra | { error: string } {
  const proveedorId = String(formData.get("proveedorId") ?? "").trim();
  const estado = String(formData.get("estado") ?? "pendiente").trim();
  const fechaEmisionRaw = String(formData.get("fechaEmision") ?? "").trim();

  if (!proveedorId) return { error: "Debes seleccionar un proveedor." };
  if (!fechaEmisionRaw) return { error: "La fecha de emisión es obligatoria." };

  const fechaEmision = new Date(fechaEmisionRaw);
  if (Number.isNaN(fechaEmision.getTime())) {
    return { error: "La fecha de emisión no es válida." };
  }

  if (!ESTADOS_OC.includes(estado as EstadoOC)) {
    return { error: "El estado seleccionado no es válido." };
  }

  const fechaEntregaEsperadaRaw = String(
    formData.get("fechaEntregaEsperada") ?? ""
  ).trim();
  const fechaEntregaEsperada = fechaEntregaEsperadaRaw
    ? new Date(fechaEntregaEsperadaRaw)
    : null;

  const montoTotalRaw = String(formData.get("montoTotal") ?? "").trim();
  let montoTotal: string | null = null;
  if (montoTotalRaw) {
    const monto = Number(montoTotalRaw);
    if (Number.isNaN(monto) || monto < 0) {
      return { error: "El monto total no es válido." };
    }
    montoTotal = monto.toFixed(2);
  }

  return {
    numeroOc: String(formData.get("numeroOc") ?? "").trim() || null,
    proveedorId,
    estado: estado as EstadoOC,
    fechaEmision,
    fechaEntregaEsperada,
    montoTotal,
    observaciones: String(formData.get("observaciones") ?? "").trim() || null,
  };
}

export async function crearOrdenCompraAction(
  _prevState: EstadoFormularioOC,
  formData: FormData
): Promise<EstadoFormularioOC> {
  const resultado = parseFormulario(formData);
  if ("error" in resultado) {
    return { error: resultado.error };
  }

  try {
    await crearOrdenCompra(resultado);
  } catch {
    return {
      error: "El proveedor seleccionado ya no existe. Actualiza la página e inténtalo de nuevo.",
    };
  }

  revalidatePath("/ordenes-compra");
  redirect("/ordenes-compra");
}

export async function actualizarOrdenCompraAction(
  id: string,
  _prevState: EstadoFormularioOC,
  formData: FormData
): Promise<EstadoFormularioOC> {
  const resultado = parseFormulario(formData);
  if ("error" in resultado) {
    return { error: resultado.error };
  }

  try {
    await actualizarOrdenCompra(id, resultado);
  } catch {
    return {
      error: "El proveedor seleccionado ya no existe. Actualiza la página e inténtalo de nuevo.",
    };
  }

  revalidatePath("/ordenes-compra");
  revalidatePath("/despachos");
  redirect("/ordenes-compra");
}

export async function eliminarOrdenCompraAction(
  id: string
): Promise<{ error?: string }> {
  await eliminarOrdenCompra(id);
  revalidatePath("/ordenes-compra");
  return {};
}
