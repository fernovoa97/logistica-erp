import { db } from "@/db";
import {
  transportistas,
  despachos,
  type NuevoTransportista,
} from "@/db/schema";
import { and, asc, count, eq, ilike, or } from "drizzle-orm";
import type { EstadoTransportista } from "@/lib/transportistas";

export type FiltrosTransportistas = {
  estado?: EstadoTransportista | "todos";
  q?: string;
};

export async function listarTransportistas(filtros: FiltrosTransportistas = {}) {
  const condiciones = [];

  if (filtros.estado && filtros.estado !== "todos") {
    condiciones.push(eq(transportistas.estado, filtros.estado));
  }

  if (filtros.q && filtros.q.trim() !== "") {
    const termino = `%${filtros.q.trim()}%`;
    condiciones.push(
      or(
        ilike(transportistas.nombre, termino),
        ilike(transportistas.documento, termino),
        ilike(transportistas.contactoNombre, termino),
        ilike(transportistas.vehiculoPlaca, termino)
      )
    );
  }

  return db
    .select({
      id: transportistas.id,
      nombre: transportistas.nombre,
      documento: transportistas.documento,
      contactoNombre: transportistas.contactoNombre,
      telefono: transportistas.telefono,
      email: transportistas.email,
      vehiculoPlaca: transportistas.vehiculoPlaca,
      vehiculoTipo: transportistas.vehiculoTipo,
      estado: transportistas.estado,
      observaciones: transportistas.observaciones,
      createdAt: transportistas.createdAt,
      updatedAt: transportistas.updatedAt,
      despachosCount: count(despachos.id),
    })
    .from(transportistas)
    .leftJoin(despachos, eq(despachos.transportistaId, transportistas.id))
    .where(condiciones.length ? and(...condiciones) : undefined)
    .groupBy(transportistas.id)
    .orderBy(asc(transportistas.nombre));
}

/** Lista simple para poblar el selector del formulario de Despachos. */
export async function listarTransportistasActivos() {
  return db
    .select()
    .from(transportistas)
    .where(eq(transportistas.estado, "activo"))
    .orderBy(asc(transportistas.nombre));
}

export async function obtenerTransportista(id: string) {
  const [transportista] = await db
    .select()
    .from(transportistas)
    .where(eq(transportistas.id, id))
    .limit(1);
  return transportista;
}

export async function crearTransportista(data: NuevoTransportista) {
  const [transportista] = await db.insert(transportistas).values(data).returning();
  return transportista;
}

export async function actualizarTransportista(
  id: string,
  data: Partial<NuevoTransportista>
) {
  const [transportista] = await db
    .update(transportistas)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(transportistas.id, id))
    .returning();
  return transportista;
}

export async function contarDespachosDeTransportista(id: string): Promise<number> {
  const [fila] = await db
    .select({ total: count() })
    .from(despachos)
    .where(eq(despachos.transportistaId, id));
  return fila?.total ?? 0;
}

export async function eliminarTransportista(id: string) {
  await db.delete(transportistas).where(eq(transportistas.id, id));
}
