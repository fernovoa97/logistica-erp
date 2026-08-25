import { db } from "@/db";
import { despachos, type Despacho, type NuevoDespacho } from "@/db/schema";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import type { EstadoDespacho } from "@/lib/estados";

export type FiltrosDespachos = {
  estado?: EstadoDespacho | "todos";
  q?: string;
};

export async function listarDespachos(
  filtros: FiltrosDespachos = {}
): Promise<Despacho[]> {
  const condiciones = [];

  if (filtros.estado && filtros.estado !== "todos") {
    condiciones.push(eq(despachos.estado, filtros.estado));
  }

  if (filtros.q && filtros.q.trim() !== "") {
    const termino = `%${filtros.q.trim()}%`;
    condiciones.push(
      or(
        ilike(despachos.numeroGuia, termino),
        ilike(despachos.transportista, termino),
        ilike(despachos.destino, termino),
        ilike(despachos.origen, termino),
        ilike(despachos.ordenCompraRef, termino)
      )
    );
  }

  return db
    .select()
    .from(despachos)
    .where(condiciones.length ? and(...condiciones) : undefined)
    .orderBy(desc(despachos.fechaDespacho), desc(despachos.createdAt));
}

export async function obtenerDespacho(id: string): Promise<Despacho | undefined> {
  const [despacho] = await db
    .select()
    .from(despachos)
    .where(eq(despachos.id, id))
    .limit(1);
  return despacho;
}

export async function crearDespacho(data: NuevoDespacho) {
  const [despacho] = await db.insert(despachos).values(data).returning();
  return despacho;
}

export async function actualizarDespacho(
  id: string,
  data: Partial<NuevoDespacho>
) {
  const [despacho] = await db
    .update(despachos)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(despachos.id, id))
    .returning();
  return despacho;
}

export async function eliminarDespacho(id: string) {
  await db.delete(despachos).where(eq(despachos.id, id));
}
