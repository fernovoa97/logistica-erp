import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

/**
 * Estados posibles de un despacho.
 * Si en el futuro se necesitan más estados, agregarlos aquí y correr
 * `npm run db:generate` para crear la migración correspondiente.
 */
export const estadoDespachoEnum = pgEnum("estado_despacho", [
  "pendiente",
  "en_transito",
  "entregado",
  "cancelado",
]);

export const estadoTransportistaEnum = pgEnum("estado_transportista", [
  "activo",
  "inactivo",
]);

export const transportistas = pgTable("transportistas", {
  id: uuid("id").primaryKey().defaultRandom(),

  nombre: varchar("nombre", { length: 200 }).notNull(),
  documento: varchar("documento", { length: 20 }), // RUC / DNI

  contactoNombre: varchar("contacto_nombre", { length: 200 }),
  telefono: varchar("telefono", { length: 50 }),
  email: varchar("email", { length: 200 }),

  vehiculoPlaca: varchar("vehiculo_placa", { length: 20 }),
  vehiculoTipo: varchar("vehiculo_tipo", { length: 100 }),

  estado: estadoTransportistaEnum("estado").notNull().default("activo"),

  observaciones: text("observaciones"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const despachos = pgTable("despachos", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Identificación del despacho
  numeroGuia: varchar("numero_guia", { length: 100 }),

  // Transportista asignado (relación con el catálogo de Transportistas).
  transportistaId: uuid("transportista_id")
    .notNull()
    .references(() => transportistas.id),

  // Origen / destino
  origen: varchar("origen", { length: 200 }),
  destino: varchar("destino", { length: 200 }).notNull(),

  // Referencia a la orden de compra asociada (texto libre por ahora;
  // se enlazará al módulo de Órdenes de Compra más adelante).
  ordenCompraRef: varchar("orden_compra_ref", { length: 100 }),

  estado: estadoDespachoEnum("estado").notNull().default("pendiente"),

  fechaDespacho: timestamp("fecha_despacho", { mode: "date" }).notNull(),
  fechaEntregaEstimada: timestamp("fecha_entrega_estimada", { mode: "date" }),

  observaciones: text("observaciones"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const transportistasRelations = relations(transportistas, ({ many }) => ({
  despachos: many(despachos),
}));

export const despachosRelations = relations(despachos, ({ one }) => ({
  transportista: one(transportistas, {
    fields: [despachos.transportistaId],
    references: [transportistas.id],
  }),
}));

export type Transportista = typeof transportistas.$inferSelect;
export type NuevoTransportista = typeof transportistas.$inferInsert;

export type Despacho = typeof despachos.$inferSelect;
export type NuevoDespacho = typeof despachos.$inferInsert;

export type DespachoConTransportista = Despacho & { transportista: Transportista };
