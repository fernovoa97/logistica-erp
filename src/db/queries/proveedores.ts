import { db } from "@/db";
import { proveedores, ordenesCompra, type NuevoProveedor } from "@/db/schema";
import { and, asc, count, eq, ilike, or } from "drizzle-orm";
import type { EstadoProveedor } from "@/lib/proveedores";

export type FiltrosProveedores = {
  estado?: EstadoProveedor | "todos";
  q?: string;
};

export async function listarProveedores(filtros: FiltrosProveedores = {}) {
  const condiciones = [];

  if (filtros.estado && filtros.estado !== "todos") {
    condiciones.push(eq(proveedores.estado, filtros.estado));
  }

  if (filtros.q && filtros.q.trim() !== "") {
    const termino = `%${filtros.q.trim()}%`;
    condiciones.push(
      or(
        ilike(proveedores.nombre, termino),
        ilike(proveedores.documento, termino),
        ilike(proveedores.contactoNombre, termino)
      )
    );
  }

  return db
    .select({
      id: proveedores.id,
      nombre: proveedores.nombre,
      documento: proveedores.documento,
      contactoNombre: proveedores.contactoNombre,
      telefono: proveedores.telefono,
      email: proveedores.email,
      direccion: proveedores.direccion,
      estado: proveedores.estado,
      observaciones: proveedores.observaciones,
      createdAt: proveedores.createdAt,
      updatedAt: proveedores.updatedAt,
      ordenesCount: count(ordenesCompra.id),
    })
    .from(proveedores)
    .leftJoin(ordenesCompra, eq(ordenesCompra.proveedorId, proveedores.id))
    .where(condiciones.length ? and(...condiciones) : undefined)
    .groupBy(proveedores.id)
    .orderBy(asc(proveedores.nombre));
}

/** Lista simple para poblar el selector del formulario de Órdenes de Compra. */
export async function listarProveedoresActivos() {
  return db
    .select()
    .from(proveedores)
    .where(eq(proveedores.estado, "activo"))
    .orderBy(asc(proveedores.nombre));
}

export async function obtenerProveedor(id: string) {
  const [proveedor] = await db
    .select()
    .from(proveedores)
    .where(eq(proveedores.id, id))
    .limit(1);
  return proveedor;
}

export async function crearProveedor(data: NuevoProveedor) {
  const [proveedor] = await db.insert(proveedores).values(data).returning();
  return proveedor;
}

export async function actualizarProveedor(id: string, data: Partial<NuevoProveedor>) {
  const [proveedor] = await db
    .update(proveedores)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(proveedores.id, id))
    .returning();
  return proveedor;
}

export async function contarOrdenesDeProveedor(id: string): Promise<number> {
  const [fila] = await db
    .select({ total: count() })
    .from(ordenesCompra)
    .where(eq(ordenesCompra.proveedorId, id));
  return fila?.total ?? 0;
}

export async function eliminarProveedor(id: string) {
  await db.delete(proveedores).where(eq(proveedores.id, id));
}
