import { db } from "@/db";
import {
  pedidosVenta,
  pedidoVentaItems,
  clientes,
  despachos,
  type NuevoPedidoVenta,
  type NuevoPedidoVentaItem,
  type PedidoVentaConCliente,
  type PedidoVentaConRelaciones,
} from "@/db/schema";
import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import type { EstadoPedidoVenta } from "@/lib/pedidos-venta";

export type FiltrosPedidosVenta = {
  estado?: EstadoPedidoVenta | "todos";
  q?: string;
};

export type ItemEntrada = {
  articuloId: string;
  cantidad: string;
  precioUnitario: string | null;
  observaciones: string | null;
};

export async function listarPedidosVenta(
  filtros: FiltrosPedidosVenta = {}
): Promise<PedidoVentaConCliente[]> {
  const condiciones = [];

  if (filtros.estado && filtros.estado !== "todos") {
    condiciones.push(eq(pedidosVenta.estado, filtros.estado));
  }

  if (filtros.q && filtros.q.trim() !== "") {
    const termino = `%${filtros.q.trim()}%`;
    condiciones.push(
      or(ilike(pedidosVenta.numeroOcCliente, termino), ilike(clientes.nombre, termino))
    );
  }

  const filas = await db
    .select({ pedido: pedidosVenta, cliente: clientes })
    .from(pedidosVenta)
    .innerJoin(clientes, eq(pedidosVenta.clienteId, clientes.id))
    .where(condiciones.length ? and(...condiciones) : undefined)
    .orderBy(desc(pedidosVenta.fecha), desc(pedidosVenta.createdAt));

  return filas.map((f) => ({ ...f.pedido, cliente: f.cliente }));
}

/** Lista simple para poblar el selector del formulario de Despachos. */
export async function listarPedidosVentaSelector(): Promise<PedidoVentaConCliente[]> {
  const filas = await db
    .select({ pedido: pedidosVenta, cliente: clientes })
    .from(pedidosVenta)
    .innerJoin(clientes, eq(pedidosVenta.clienteId, clientes.id))
    .orderBy(desc(pedidosVenta.fecha));

  return filas.map((f) => ({ ...f.pedido, cliente: f.cliente }));
}

export async function obtenerPedidoVenta(
  id: string
): Promise<PedidoVentaConRelaciones | undefined> {
  return db.query.pedidosVenta.findFirst({
    where: eq(pedidosVenta.id, id),
    with: { cliente: true, items: { with: { articulo: true } } },
  });
}

export async function crearPedidoVenta(
  data: NuevoPedidoVenta,
  items: ItemEntrada[]
) {
  return db.transaction(async (tx) => {
    const [pedido] = await tx.insert(pedidosVenta).values(data).returning();

    if (items.length > 0) {
      const filas: NuevoPedidoVentaItem[] = items.map((item) => ({
        pedidoVentaId: pedido.id,
        articuloId: item.articuloId,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        observaciones: item.observaciones,
      }));
      await tx.insert(pedidoVentaItems).values(filas);
    }

    return pedido;
  });
}

export async function actualizarPedidoVenta(
  id: string,
  data: Partial<NuevoPedidoVenta>,
  items: ItemEntrada[]
) {
  return db.transaction(async (tx) => {
    const [pedido] = await tx
      .update(pedidosVenta)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(pedidosVenta.id, id))
      .returning();

    // Reemplazamos todas las líneas: más simple y confiable que hacer un
    // diff fila por fila para un formulario con filas dinámicas.
    await tx.delete(pedidoVentaItems).where(eq(pedidoVentaItems.pedidoVentaId, id));

    if (items.length > 0) {
      const filas: NuevoPedidoVentaItem[] = items.map((item) => ({
        pedidoVentaId: id,
        articuloId: item.articuloId,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        observaciones: item.observaciones,
      }));
      await tx.insert(pedidoVentaItems).values(filas);
    }

    return pedido;
  });
}

export async function contarDespachosDePedidoVenta(id: string): Promise<number> {
  const [fila] = await db
    .select({ total: count() })
    .from(despachos)
    .where(eq(despachos.pedidoVentaId, id));
  return fila?.total ?? 0;
}

export async function eliminarPedidoVenta(id: string) {
  // Las líneas (pedido_venta_items) se eliminan solas por ON DELETE CASCADE.
  await db.delete(pedidosVenta).where(eq(pedidosVenta.id, id));
}
