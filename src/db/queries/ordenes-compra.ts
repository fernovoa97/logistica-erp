import { db } from "@/db";
import {
  ordenesCompra,
  proveedores,
  type NuevaOrdenCompra,
  type OrdenCompraConProveedor,
} from "@/db/schema";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import type { EstadoOC } from "@/lib/ordenes-compra";

export type FiltrosOrdenesCompra = {
  estado?: EstadoOC | "todos";
  q?: string;
};

export async function listarOrdenesCompra(
  filtros: FiltrosOrdenesCompra = {}
): Promise<OrdenCompraConProveedor[]> {
  const condiciones = [];

  if (filtros.estado && filtros.estado !== "todos") {
    condiciones.push(eq(ordenesCompra.estado, filtros.estado));
  }

  if (filtros.q && filtros.q.trim() !== "") {
    const termino = `%${filtros.q.trim()}%`;
    condiciones.push(
      or(ilike(ordenesCompra.numeroOc, termino), ilike(proveedores.nombre, termino))
    );
  }

  const filas = await db
    .select({
      ordenCompra: ordenesCompra,
      proveedor: proveedores,
    })
    .from(ordenesCompra)
    .innerJoin(proveedores, eq(ordenesCompra.proveedorId, proveedores.id))
    .where(condiciones.length ? and(...condiciones) : undefined)
    .orderBy(desc(ordenesCompra.fechaEmision), desc(ordenesCompra.createdAt));

  return filas.map((f) => ({ ...f.ordenCompra, proveedor: f.proveedor }));
}

export async function obtenerOrdenCompra(
  id: string
): Promise<OrdenCompraConProveedor | undefined> {
  return db.query.ordenesCompra.findFirst({
    where: eq(ordenesCompra.id, id),
    with: { proveedor: true },
  });
}

/** Lista simple para poblar el selector del formulario de Despachos. */
export async function listarOrdenesCompraSelector() {
  const filas = await db
    .select({ ordenCompra: ordenesCompra, proveedor: proveedores })
    .from(ordenesCompra)
    .innerJoin(proveedores, eq(ordenesCompra.proveedorId, proveedores.id))
    .orderBy(desc(ordenesCompra.fechaEmision));

  return filas.map((f) => ({ ...f.ordenCompra, proveedor: f.proveedor }));
}

export async function crearOrdenCompra(data: NuevaOrdenCompra) {
  const [orden] = await db.insert(ordenesCompra).values(data).returning();
  return orden;
}

export async function actualizarOrdenCompra(
  id: string,
  data: Partial<NuevaOrdenCompra>
) {
  const [orden] = await db
    .update(ordenesCompra)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(ordenesCompra.id, id))
    .returning();
  return orden;
}

export async function eliminarOrdenCompra(id: string) {
  await db.delete(ordenesCompra).where(eq(ordenesCompra.id, id));
}
