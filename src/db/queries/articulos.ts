import { db } from "@/db";
import { articulos, pedidoVentaItems, type NuevoArticulo } from "@/db/schema";
import { and, asc, count, eq, ilike, or } from "drizzle-orm";
import type { EstadoArticulo } from "@/lib/articulos";

export type FiltrosArticulos = {
  estado?: EstadoArticulo | "todos";
  q?: string;
};

export async function listarArticulos(filtros: FiltrosArticulos = {}) {
  const condiciones = [];

  if (filtros.estado && filtros.estado !== "todos") {
    condiciones.push(eq(articulos.estado, filtros.estado));
  }

  if (filtros.q && filtros.q.trim() !== "") {
    const termino = `%${filtros.q.trim()}%`;
    condiciones.push(
      or(
        ilike(articulos.codigo, termino),
        ilike(articulos.descripcion, termino),
        ilike(articulos.marca, termino)
      )
    );
  }

  return db
    .select({
      id: articulos.id,
      codigo: articulos.codigo,
      descripcion: articulos.descripcion,
      marca: articulos.marca,
      unidadMedida: articulos.unidadMedida,
      estado: articulos.estado,
      observaciones: articulos.observaciones,
      createdAt: articulos.createdAt,
      updatedAt: articulos.updatedAt,
      usosCount: count(pedidoVentaItems.id),
    })
    .from(articulos)
    .leftJoin(pedidoVentaItems, eq(pedidoVentaItems.articuloId, articulos.id))
    .where(condiciones.length ? and(...condiciones) : undefined)
    .groupBy(articulos.id)
    .orderBy(asc(articulos.descripcion));
}

/** Lista simple para poblar el selector de artículos en Pedidos de Venta. */
export async function listarArticulosActivos() {
  return db
    .select()
    .from(articulos)
    .where(eq(articulos.estado, "activo"))
    .orderBy(asc(articulos.descripcion));
}

export async function obtenerArticulo(id: string) {
  const [articulo] = await db.select().from(articulos).where(eq(articulos.id, id)).limit(1);
  return articulo;
}

export async function crearArticulo(data: NuevoArticulo) {
  const [articulo] = await db.insert(articulos).values(data).returning();
  return articulo;
}

export async function actualizarArticulo(id: string, data: Partial<NuevoArticulo>) {
  const [articulo] = await db
    .update(articulos)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(articulos.id, id))
    .returning();
  return articulo;
}

export async function contarUsosDeArticulo(id: string): Promise<number> {
  const [fila] = await db
    .select({ total: count() })
    .from(pedidoVentaItems)
    .where(eq(pedidoVentaItems.articuloId, id));
  return fila?.total ?? 0;
}

export async function eliminarArticulo(id: string) {
  await db.delete(articulos).where(eq(articulos.id, id));
}
