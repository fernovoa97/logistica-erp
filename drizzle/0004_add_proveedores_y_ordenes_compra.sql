CREATE TYPE "public"."estado_orden_compra" AS ENUM('pendiente', 'aprobada', 'recibida', 'cancelada');--> statement-breakpoint
CREATE TYPE "public"."estado_proveedor" AS ENUM('activo', 'inactivo');--> statement-breakpoint
CREATE TABLE "ordenes_compra" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"numero_oc" varchar(100),
	"proveedor_id" uuid NOT NULL,
	"estado" "estado_orden_compra" DEFAULT 'pendiente' NOT NULL,
	"fecha_emision" timestamp NOT NULL,
	"fecha_entrega_esperada" timestamp,
	"monto_total" numeric(12, 2),
	"observaciones" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "proveedores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(200) NOT NULL,
	"documento" varchar(20),
	"contacto_nombre" varchar(200),
	"telefono" varchar(50),
	"email" varchar(200),
	"direccion" varchar(300),
	"estado" "estado_proveedor" DEFAULT 'activo' NOT NULL,
	"observaciones" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "despachos" ADD COLUMN "orden_compra_id" uuid;--> statement-breakpoint
ALTER TABLE "ordenes_compra" ADD CONSTRAINT "ordenes_compra_proveedor_id_proveedores_id_fk" FOREIGN KEY ("proveedor_id") REFERENCES "public"."proveedores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "despachos" ADD CONSTRAINT "despachos_orden_compra_id_ordenes_compra_id_fk" FOREIGN KEY ("orden_compra_id") REFERENCES "public"."ordenes_compra"("id") ON DELETE no action ON UPDATE no action;