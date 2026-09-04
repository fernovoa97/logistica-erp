import { db } from "@/db";
import {
  despachos,
  transportistas,
  type NuevoDespacho,
  type DespachoConTransportista,
} from "@/db/schema";
import { and, desc, eq, ilike, inArray, or } from "drizzle-orm";
import type { EstadoDespacho } from "@/lib/estados";

export type FiltrosDespachos = {
  estado?: EstadoDespacho | "todos";
  q?: string;
};

export async function listarDespachos(
  filtros: FiltrosDespachos = {}
): Promise<DespachoConTransportista[]> {
  const condiciones = [];

  if (filtros.estado && filtros.estado !== "todos") {
    condiciones.push(eq(despachos.estado, filtros.estado));
  }

  if (filtros.q && filtros.q.trim() !== "") {
    const termino = `%${filtros.q.trim()}%`;

    // El nombre del transportista vive en otra tabla; buscamos primero los
    // IDs de transportistas que calzan con el término de búsqueda.
    const transportistasCoincidentes = await db
      .select({ id: transportistas.id })
      .from(transportistas)
      .where(ilike(transportistas.nombre, termino));
    const idsTransportistas = transportistasCoincidentes.map((t) => t.id);

    condiciones.push(
      or(
        ilike(despachos.numeroGuia, termino),
        ilike(despachos.destino, termino),
        ilike(despachos.origen, termino),
        ilike(despachos.ordenCompraRef, termino),
        idsTransportistas.length
          ? inArray(despachos.transportistaId, idsTransportistas)
          : undefined
      )
    );
  }

  return db.query.despachos.findMany({
    where: condiciones.length ? and(...condiciones) : undefined,
    with: { transportista: true },
    orderBy: [desc(despachos.fechaDespacho), desc(despachos.createdAt)],
  });
}

export async function obtenerDespacho(
  id: string
): Promise<DespachoConTransportista | undefined> {
  return db.query.despachos.findFirst({
    where: eq(despachos.id, id),
    with: { transportista: true },
  });
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
