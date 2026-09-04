CREATE TYPE "public"."condicion_venta" AS ENUM('contado', 'credito');--> statement-breakpoint
CREATE TYPE "public"."estado_articulo" AS ENUM('activo', 'inactivo');--> statement-breakpoint
CREATE TYPE "public"."estado_cliente" AS ENUM('activo', 'inactivo');--> statement-breakpoint
CREATE TYPE "public"."estado_pedido_venta" AS ENUM('pendiente', 'en_preparacion', 'despachado', 'completado', 'cancelado');--> statement-breakpoint
CREATE TYPE "public"."moneda" AS ENUM('PEN', 'USD');--> statement-breakpoint
CREATE TYPE "public"."tipo_venta" AS ENUM('directa', 'consignacion');--> statement-breakpoint
CREATE TABLE "articulos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"codigo" varchar(50),
	"descripcion" varchar(300) NOT NULL,
	"marca" varchar(100),
	"unidad_medida" varchar(20),
	"estado" "estado_articulo" DEFAULT 'activo' NOT NULL,
	"observaciones" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clientes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(200) NOT NULL,
	"documento" varchar(20),
	"contacto_nombre" varchar(200),
	"telefono" varchar(50),
	"email" varchar(200),
	"direccion" varchar(300),
	"estado" "estado_cliente" DEFAULT 'activo' NOT NULL,
	"observaciones" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pedido_venta_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pedido_venta_id" uuid NOT NULL,
	"articulo_id" uuid NOT NULL,
	"cantidad" numeric(12, 2) NOT NULL,
	"precio_unitario" numeric(12, 2),
	"observaciones" varchar(300),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pedidos_venta" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"numero_oc_cliente" varchar(100),
	"cliente_id" uuid NOT NULL,
	"fecha" timestamp NOT NULL,
	"estado" "estado_pedido_venta" DEFAULT 'pendiente' NOT NULL,
	"tipo_venta" "tipo_venta" DEFAULT 'directa' NOT NULL,
	"moneda" "moneda" DEFAULT 'PEN' NOT NULL,
	"condicion_venta" "condicion_venta" DEFAULT 'contado' NOT NULL,
	"dias_credito" integer,
	"observaciones" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "despachos" DROP CONSTRAINT "despachos_orden_compra_id_ordenes_compra_id_fk";
--> statement-breakpoint
ALTER TABLE "pedido_venta_items" ADD CONSTRAINT "pedido_venta_items_pedido_venta_id_pedidos_venta_id_fk" FOREIGN KEY ("pedido_venta_id") REFERENCES "public"."pedidos_venta"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pedido_venta_items" ADD CONSTRAINT "pedido_venta_items_articulo_id_articulos_id_fk" FOREIGN KEY ("articulo_id") REFERENCES "public"."articulos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pedidos_venta" ADD CONSTRAINT "pedidos_venta_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "despachos" DROP COLUMN "orden_compra_id";