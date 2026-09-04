import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  numeric,
  integer,
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

export const estadoClienteEnum = pgEnum("estado_cliente", ["activo", "inactivo"]);

export const estadoArticuloEnum = pgEnum("estado_articulo", ["activo", "inactivo"]);

export const tipoVentaEnum = pgEnum("tipo_venta", ["directa", "consignacion"]);

export const monedaEnum = pgEnum("moneda", ["PEN", "USD"]);

export const condicionVentaEnum = pgEnum("condicion_venta", ["contado", "credito"]);

export const estadoPedidoVentaEnum = pgEnum("estado_pedido_venta", [
  "pendiente",
  "en_preparacion",
  "despachado",
  "completado",
  "cancelado",
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

/** Clientes: las minas a las que Drillco les vende. */
export const clientes = pgTable("clientes", {
  id: uuid("id").primaryKey().defaultRandom(),

  nombre: varchar("nombre", { length: 200 }).notNull(),
  documento: varchar("documento", { length: 20 }), // RUC

  contactoNombre: varchar("contacto_nombre", { length: 200 }),
  telefono: varchar("telefono", { length: 50 }),
  email: varchar("email", { length: 200 }),
  direccion: varchar("direccion", { length: 300 }), // sede / ubicación de la mina

  estado: estadoClienteEnum("estado").notNull().default("activo"),

  observaciones: text("observaciones"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/** Maestro de artículos: productos de perforación que Drillco importa y vende. */
export const articulos = pgTable("articulos", {
  id: uuid("id").primaryKey().defaultRandom(),

  codigo: varchar("codigo", { length: 50 }),
  descripcion: varchar("descripcion", { length: 300 }).notNull(),
  marca: varchar("marca", { length: 100 }),
  unidadMedida: varchar("unidad_medida", { length: 20 }), // Ej. UND, PZA, SET, M

  estado: estadoArticuloEnum("estado").notNull().default("activo"),

  observaciones: text("observaciones"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/**
 * Pedido de Venta: la OC que envía la mina (cliente), ingresada al sistema.
 * Es lo que luego se despacha.
 */
export const pedidosVenta = pgTable("pedidos_venta", {
  id: uuid("id").primaryKey().defaultRandom(),

  numeroOcCliente: varchar("numero_oc_cliente", { length: 100 }),

  clienteId: uuid("cliente_id")
    .notNull()
    .references(() => clientes.id),

  fecha: timestamp("fecha", { mode: "date" }).notNull(),
  estado: estadoPedidoVentaEnum("estado").notNull().default("pendiente"),

  tipoVenta: tipoVentaEnum("tipo_venta").notNull().default("directa"),
  moneda: monedaEnum("moneda").notNull().default("PEN"),
  condicionVenta: condicionVentaEnum("condicion_venta").notNull().default("contado"),
  diasCredito: integer("dias_credito"), // solo aplica si condicionVenta = 'credito'

  observaciones: text("observaciones"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/** Línea de detalle (artículo + cantidad) de un Pedido de Venta. */
export const pedidoVentaItems = pgTable("pedido_venta_items", {
  id: uuid("id").primaryKey().defaultRandom(),

  pedidoVentaId: uuid("pedido_venta_id")
    .notNull()
    .references(() => pedidosVenta.id, { onDelete: "cascade" }),

  articuloId: uuid("articulo_id")
    .notNull()
    .references(() => articulos.id),

  cantidad: numeric("cantidad", { precision: 12, scale: 2 }).notNull(),
  precioUnitario: numeric("precio_unitario", { precision: 12, scale: 2 }),

  observaciones: varchar("observaciones", { length: 300 }),

  createdAt: timestamp("created_at").notNull().defaultNow(),
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

  // Pedido de Venta que se está despachando (la OC de la mina, ya
  // ingresada al sistema).
  pedidoVentaId: uuid("pedido_venta_id")
    .notNull()
    .references(() => pedidosVenta.id),

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

export const ordenesCompraRelations = relations(ordenesCompra, ({ one }) => ({
  proveedor: one(proveedores, {
    fields: [ordenesCompra.proveedorId],
    references: [proveedores.id],
  }),
}));

export const clientesRelations = relations(clientes, ({ many }) => ({
  pedidosVenta: many(pedidosVenta),
}));

export const articulosRelations = relations(articulos, ({ many }) => ({
  items: many(pedidoVentaItems),
}));

export const pedidosVentaRelations = relations(pedidosVenta, ({ one, many }) => ({
  cliente: one(clientes, {
    fields: [pedidosVenta.clienteId],
    references: [clientes.id],
  }),
  items: many(pedidoVentaItems),
  despachos: many(despachos),
}));

export const pedidoVentaItemsRelations = relations(pedidoVentaItems, ({ one }) => ({
  pedidoVenta: one(pedidosVenta, {
    fields: [pedidoVentaItems.pedidoVentaId],
    references: [pedidosVenta.id],
  }),
  articulo: one(articulos, {
    fields: [pedidoVentaItems.articuloId],
    references: [articulos.id],
  }),
}));

export const despachosRelations = relations(despachos, ({ one }) => ({
  transportista: one(transportistas, {
    fields: [despachos.transportistaId],
    references: [transportistas.id],
  }),
  pedidoVenta: one(pedidosVenta, {
    fields: [despachos.pedidoVentaId],
    references: [pedidosVenta.id],
  }),
}));

export type Transportista = typeof transportistas.$inferSelect;
export type NuevoTransportista = typeof transportistas.$inferInsert;

export type Proveedor = typeof proveedores.$inferSelect;
export type NuevoProveedor = typeof proveedores.$inferInsert;

export type OrdenCompra = typeof ordenesCompra.$inferSelect;
export type NuevaOrdenCompra = typeof ordenesCompra.$inferInsert;
export type OrdenCompraConProveedor = OrdenCompra & { proveedor: Proveedor };

export type Cliente = typeof clientes.$inferSelect;
export type NuevoCliente = typeof clientes.$inferInsert;

export type Articulo = typeof articulos.$inferSelect;
export type NuevoArticulo = typeof articulos.$inferInsert;

export type PedidoVenta = typeof pedidosVenta.$inferSelect;
export type NuevoPedidoVenta = typeof pedidosVenta.$inferInsert;

export type PedidoVentaItem = typeof pedidoVentaItems.$inferSelect;
export type NuevoPedidoVentaItem = typeof pedidoVentaItems.$inferInsert;
export type PedidoVentaItemConArticulo = PedidoVentaItem & { articulo: Articulo };

export type PedidoVentaConCliente = PedidoVenta & { cliente: Cliente };
export type PedidoVentaConRelaciones = PedidoVenta & {
  cliente: Cliente;
  items: PedidoVentaItemConArticulo[];
};

export type Despacho = typeof despachos.$inferSelect;
export type NuevoDespacho = typeof despachos.$inferInsert;

export type DespachoConRelaciones = Despacho & {
  transportista: Transportista;
  pedidoVenta: PedidoVentaConCliente;
};
