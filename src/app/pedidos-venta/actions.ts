"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  crearPedidoVenta,
  actualizarPedidoVenta,
  eliminarPedidoVenta,
  contarDespachosDePedidoVenta,
  type ItemEntrada,
} from "@/db/queries/pedidos-venta";
import {
  ESTADOS_PEDIDO_VENTA,
  TIPOS_VENTA,
  MONEDAS,
  CONDICIONES_VENTA,
  DIAS_CREDITO_OPCIONES,
  type EstadoPedidoVenta,
  type TipoVenta,
  type Moneda,
  type CondicionVenta,
} from "@/lib/pedidos-venta";
import type { NuevoPedidoVenta } from "@/db/schema";

export type EstadoFormularioPedidoVenta = {
  error?: string;
} | null;

type ResultadoParseo = {
  data: NuevoPedidoVenta;
  items: ItemEntrada[];
};

function parseItems(raw: string): ItemEntrada[] | { error: string } {
  let bruto: unknown;
  try {
    bruto = JSON.parse(raw || "[]");
  } catch {
    return { error: "No se pudo leer las líneas del pedido. Vuelve a intentarlo." };
  }

  if (!Array.isArray(bruto)) {
    return { error: "No se pudo leer las líneas del pedido. Vuelve a intentarlo." };
  }

  if (bruto.length === 0) {
    return { error: "Agrega al menos un artículo al pedido." };
  }

  const items: ItemEntrada[] = [];

  for (const fila of bruto) {
    if (typeof fila !== "object" || fila === null) {
      return { error: "Una de las líneas del pedido no es válida." };
    }
    const articuloId = String((fila as Record<string, unknown>).articuloId ?? "").trim();
    const cantidadRaw = String((fila as Record<string, unknown>).cantidad ?? "").trim();
    const precioUnitarioRaw = String(
      (fila as Record<string, unknown>).precioUnitario ?? ""
    ).trim();
    const observaciones = String(
      (fila as Record<string, unknown>).observaciones ?? ""
    ).trim();

    if (!articuloId) {
      return { error: "Selecciona un artículo en cada línea del pedido." };
    }

    const cantidad = Number(cantidadRaw);
    if (!cantidadRaw || Number.isNaN(cantidad) || cantidad <= 0) {
      return { error: "La cantidad de cada línea debe ser un número mayor a 0." };
    }

    let precioUnitario: string | null = null;
    if (precioUnitarioRaw) {
      const precio = Number(precioUnitarioRaw);
      if (Number.isNaN(precio) || precio < 0) {
        return { error: "El precio unitario de cada línea debe ser un número válido." };
      }
      precioUnitario = precio.toFixed(2);
    }

    items.push({
      articuloId,
      cantidad: cantidad.toFixed(2),
      precioUnitario,
      observaciones: observaciones || null,
    });
  }

  return items;
}

function parseFormulario(formData: FormData): ResultadoParseo | { error: string } {
  const clienteId = String(formData.get("clienteId") ?? "").trim();
  const fechaRaw = String(formData.get("fecha") ?? "").trim();
  const estado = String(formData.get("estado") ?? "pendiente").trim();
  const tipoVenta = String(formData.get("tipoVenta") ?? "directa").trim();
  const moneda = String(formData.get("moneda") ?? "PEN").trim();
  const condicionVenta = String(formData.get("condicionVenta") ?? "contado").trim();
  const diasCreditoRaw = String(formData.get("diasCredito") ?? "").trim();

  if (!clienteId) return { error: "Debes seleccionar un cliente." };
  if (!fechaRaw) return { error: "La fecha del pedido es obligatoria." };

  const fecha = new Date(fechaRaw);
  if (Number.isNaN(fecha.getTime())) {
    return { error: "La fecha del pedido no es válida." };
  }

  if (!ESTADOS_PEDIDO_VENTA.includes(estado as EstadoPedidoVenta)) {
    return { error: "El estado seleccionado no es válido." };
  }
  if (!TIPOS_VENTA.includes(tipoVenta as TipoVenta)) {
    return { error: "El tipo de venta seleccionado no es válido." };
  }
  if (!MONEDAS.includes(moneda as Moneda)) {
    return { error: "La moneda seleccionada no es válida." };
  }
  if (!CONDICIONES_VENTA.includes(condicionVenta as CondicionVenta)) {
    return { error: "La condición de venta seleccionada no es válida." };
  }

  let diasCredito: number | null = null;
  if (condicionVenta === "credito") {
    const dias = Number(diasCreditoRaw);
    if (!DIAS_CREDITO_OPCIONES.includes(dias as (typeof DIAS_CREDITO_OPCIONES)[number])) {
      return { error: "Selecciona un número de días de crédito válido." };
    }
    diasCredito = dias;
  }

  const itemsRaw = String(formData.get("itemsJson") ?? "[]");
  const items = parseItems(itemsRaw);
  if ("error" in items) {
    return { error: items.error };
  }

  return {
    data: {
      numeroOcCliente: String(formData.get("numeroOcCliente") ?? "").trim() || null,
      clienteId,
      fecha,
      estado: estado as EstadoPedidoVenta,
      tipoVenta: tipoVenta as TipoVenta,
      moneda: moneda as Moneda,
      condicionVenta: condicionVenta as CondicionVenta,
      diasCredito,
      observaciones: String(formData.get("observaciones") ?? "").trim() || null,
    },
    items,
  };
}

export async function crearPedidoVentaAction(
  _prevState: EstadoFormularioPedidoVenta,
  formData: FormData
): Promise<EstadoFormularioPedidoVenta> {
  const resultado = parseFormulario(formData);
  if ("error" in resultado) {
    return { error: resultado.error };
  }

  try {
    await crearPedidoVenta(resultado.data, resultado.items);
  } catch {
    return {
      error:
        "El cliente o alguno de los artículos seleccionados ya no existen. Actualiza la página e inténtalo de nuevo.",
    };
  }

  revalidatePath("/pedidos-venta");
  redirect("/pedidos-venta");
}

export async function actualizarPedidoVentaAction(
  id: string,
  _prevState: EstadoFormularioPedidoVenta,
  formData: FormData
): Promise<EstadoFormularioPedidoVenta> {
  const resultado = parseFormulario(formData);
  if ("error" in resultado) {
    return { error: resultado.error };
  }

  try {
    await actualizarPedidoVenta(id, resultado.data, resultado.items);
  } catch {
    return {
      error:
        "El cliente o alguno de los artículos seleccionados ya no existen. Actualiza la página e inténtalo de nuevo.",
    };
  }

  revalidatePath("/pedidos-venta");
  revalidatePath("/despachos");
  redirect("/pedidos-venta");
}

export async function eliminarPedidoVentaAction(
  id: string
): Promise<{ error?: string }> {
  const despachosAsociados = await contarDespachosDePedidoVenta(id);
  if (despachosAsociados > 0) {
    return {
      error: `No se puede eliminar: tiene ${despachosAsociados} despacho${
        despachosAsociados === 1 ? "" : "s"
      } asociado${
        despachosAsociados === 1 ? "" : "s"
      }. Márcalo como "Cancelado" en vez de eliminarlo, o reasigna esos despachos primero.`,
    };
  }

  await eliminarPedidoVenta(id);
  revalidatePath("/pedidos-venta");
  return {};
}
