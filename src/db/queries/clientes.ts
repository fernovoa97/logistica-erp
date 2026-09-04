import { db } from "@/db";
import { clientes, pedidosVenta, type NuevoCliente } from "@/db/schema";
import { and, asc, count, eq, ilike, or } from "drizzle-orm";
import type { EstadoCliente } from "@/lib/clientes";

export type FiltrosClientes = {
  estado?: EstadoCliente | "todos";
  q?: string;
};

export async function listarClientes(filtros: FiltrosClientes = {}) {
  const condiciones = [];

  if (filtros.estado && filtros.estado !== "todos") {
    condiciones.push(eq(clientes.estado, filtros.estado));
  }

  if (filtros.q && filtros.q.trim() !== "") {
    const termino = `%${filtros.q.trim()}%`;
    condiciones.push(
      or(
        ilike(clientes.nombre, termino),
        ilike(clientes.documento, termino),
        ilike(clientes.contactoNombre, termino)
      )
    );
  }

  return db
    .select({
      id: clientes.id,
      nombre: clientes.nombre,
      documento: clientes.documento,
      contactoNombre: clientes.contactoNombre,
      telefono: clientes.telefono,
      email: clientes.email,
      direccion: clientes.direccion,
      estado: clientes.estado,
      observaciones: clientes.observaciones,
      createdAt: clientes.createdAt,
      updatedAt: clientes.updatedAt,
      pedidosCount: count(pedidosVenta.id),
    })
    .from(clientes)
    .leftJoin(pedidosVenta, eq(pedidosVenta.clienteId, clientes.id))
    .where(condiciones.length ? and(...condiciones) : undefined)
    .groupBy(clientes.id)
    .orderBy(asc(clientes.nombre));
}

/** Lista simple para poblar el selector del formulario de Pedidos de Venta. */
export async function listarClientesActivos() {
  return db
    .select()
    .from(clientes)
    .where(eq(clientes.estado, "activo"))
    .orderBy(asc(clientes.nombre));
}

export async function obtenerCliente(id: string) {
  const [cliente] = await db.select().from(clientes).where(eq(clientes.id, id)).limit(1);
  return cliente;
}

export async function crearCliente(data: NuevoCliente) {
  const [cliente] = await db.insert(clientes).values(data).returning();
  return cliente;
}

export async function actualizarCliente(id: string, data: Partial<NuevoCliente>) {
  const [cliente] = await db
    .update(clientes)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(clientes.id, id))
    .returning();
  return cliente;
}

export async function contarPedidosDeCliente(id: string): Promise<number> {
  const [fila] = await db
    .select({ total: count() })
    .from(pedidosVenta)
    .where(eq(pedidosVenta.clienteId, id));
  return fila?.total ?? 0;
}

export async function eliminarCliente(id: string) {
  await db.delete(clientes).where(eq(clientes.id, id));
}
