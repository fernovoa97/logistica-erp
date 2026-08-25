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

export const despachos = pgTable("despachos", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Identificación del despacho
  numeroGuia: varchar("numero_guia", { length: 100 }),

  // Datos de transporte (por ahora texto libre; cuando construyamos el
  // módulo de Transportistas, este campo pasará a ser una relación).
  transportista: varchar("transportista", { length: 200 }).notNull(),

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

export type Despacho = typeof despachos.$inferSelect;
export type NuevoDespacho = typeof despachos.$inferInsert;
