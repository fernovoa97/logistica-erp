import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  numeric,
  pgEnum,
} from "drizzle-orm/pg-core";

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

export const estadoProveedorEnum = pgEnum("estado_proveedor", [
  "activo",
  "inactivo",
]);

export const estadoOrdenCompraEnum = pgEnum("estado_orden_compra", [
  "pendiente",
  "aprobada",
  "recibida",
  "cancelada",
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

export const proveedores = pgTable("proveedores", {
  id: uuid("id").primaryKey().defaultRandom(),

  nombre: varchar("nombre", { length: 200 }).notNull(),
  documento: varchar("documento", { length: 20 }), // RUC

  contactoNombre: varchar("contacto_nombre", { length: 200 }),
  telefono: varchar("telefono", { length: 50 }),
  email: varchar("email", { length: 200 }),
  direccion: varchar("direccion", { length: 300 }),

  estado: estadoProveedorEnum("estado").notNull().default("activo"),

  observaciones: text("observaciones"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const ordenesCompra = pgTable("ordenes_compra", {
  id: uuid("id").primaryKey().defaultRandom(),

  numeroOc: varchar("numero_oc", { length: 100 }),

  proveedorId: uuid("proveedor_id")
    .notNull()
    .references(() => proveedores.id),

  estado: estadoOrdenCompraEnum("estado").notNull().default("pendiente"),

  fechaEmision: timestamp("fecha_emision", { mode: "date" }).notNull(),
  fechaEntregaEsperada: timestamp("fecha_entrega_esperada", { mode: "date" }),

  montoTotal: numeric("monto_total", { precision: 12, scale: 2 }),

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

  // Orden de compra asociada (relación opcional: no todo despacho viene de
  // una OC registrada en el sistema).
  ordenCompraId: uuid("orden_compra_id").references(() => ordenesCompra.id),

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

export const proveedoresRelations = relations(proveedores, ({ many }) => ({
  ordenesCompra: many(ordenesCompra),
}));

export const ordenesCompraRelations = relations(ordenesCompra, ({ one, many }) => ({
  proveedor: one(proveedores, {
    fields: [ordenesCompra.proveedorId],
    references: [proveedores.id],
  }),
  despachos: many(despachos),
}));

export const despachosRelations = relations(despachos, ({ one }) => ({
  transportista: one(transportistas, {
    fields: [despachos.transportistaId],
    references: [transportistas.id],
  }),
  ordenCompra: one(ordenesCompra, {
    fields: [despachos.ordenCompraId],
    references: [ordenesCompra.id],
  }),
}));

export type Transportista = typeof transportistas.$inferSelect;
export type NuevoTransportista = typeof transportistas.$inferInsert;

export type Proveedor = typeof proveedores.$inferSelect;
export type NuevoProveedor = typeof proveedores.$inferInsert;

export type OrdenCompra = typeof ordenesCompra.$inferSelect;
export type NuevaOrdenCompra = typeof ordenesCompra.$inferInsert;
export type OrdenCompraConProveedor = OrdenCompra & { proveedor: Proveedor };

export type Despacho = typeof despachos.$inferSelect;
export type NuevoDespacho = typeof despachos.$inferInsert;

export type DespachoConRelaciones = Despacho & {
  transportista: Transportista;
  ordenCompra: OrdenCompraConProveedor | null;
};
