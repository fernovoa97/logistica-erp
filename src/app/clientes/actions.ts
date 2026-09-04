"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  crearCliente,
  actualizarCliente,
  eliminarCliente,
  contarPedidosDeCliente,
} from "@/db/queries/clientes";
import { ESTADOS_CLIENTE, type EstadoCliente } from "@/lib/clientes";
import type { NuevoCliente } from "@/db/schema";

export type EstadoFormularioCliente = {
  error?: string;
} | null;

function parseFormulario(formData: FormData): NuevoCliente | { error: string } {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const estado = String(formData.get("estado") ?? "activo").trim();

  if (!nombre) return { error: "El nombre del cliente es obligatorio." };
  if (!ESTADOS_CLIENTE.includes(estado as EstadoCliente)) {
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
    estado: estado as EstadoCliente,
    observaciones: String(formData.get("observaciones") ?? "").trim() || null,
  };
}

export async function crearClienteAction(
  _prevState: EstadoFormularioCliente,
  formData: FormData
): Promise<EstadoFormularioCliente> {
  const resultado = parseFormulario(formData);
  if ("error" in resultado) {
    return { error: resultado.error };
  }

  await crearCliente(resultado);
  revalidatePath("/clientes");
  redirect("/clientes");
}

export async function actualizarClienteAction(
  id: string,
  _prevState: EstadoFormularioCliente,
  formData: FormData
): Promise<EstadoFormularioCliente> {
  const resultado = parseFormulario(formData);
  if ("error" in resultado) {
    return { error: resultado.error };
  }

  await actualizarCliente(id, resultado);
  revalidatePath("/clientes");
  revalidatePath("/pedidos-venta");
  redirect("/clientes");
}

export async function eliminarClienteAction(
  id: string
): Promise<{ error?: string }> {
  const pedidosAsociados = await contarPedidosDeCliente(id);
  if (pedidosAsociados > 0) {
    return {
      error: `No se puede eliminar: tiene ${pedidosAsociados} pedido${
        pedidosAsociados === 1 ? "" : "s"
      } de venta asociado${
        pedidosAsociados === 1 ? "" : "s"
      }. Márcalo como "Inactivo" en vez de eliminarlo, o reasigna esos pedidos primero.`,
    };
  }

  await eliminarCliente(id);
  revalidatePath("/clientes");
  return {};
}
