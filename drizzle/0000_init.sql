CREATE TYPE "public"."estado_despacho" AS ENUM('pendiente', 'en_transito', 'entregado', 'cancelado');--> statement-breakpoint
CREATE TABLE "despachos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"numero_guia" varchar(100),
	"transportista" varchar(200) NOT NULL,
	"origen" varchar(200),
	"destino" varchar(200) NOT NULL,
	"orden_compra_ref" varchar(100),
	"estado" "estado_despacho" DEFAULT 'pendiente' NOT NULL,
	"fecha_despacho" timestamp NOT NULL,
	"fecha_entrega_estimada" timestamp,
	"observaciones" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
