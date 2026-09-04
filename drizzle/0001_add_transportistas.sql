CREATE TYPE "public"."estado_transportista" AS ENUM('activo', 'inactivo');--> statement-breakpoint
CREATE TABLE "transportistas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(200) NOT NULL,
	"documento" varchar(20),
	"contacto_nombre" varchar(200),
	"telefono" varchar(50),
	"email" varchar(200),
	"vehiculo_placa" varchar(20),
	"vehiculo_tipo" varchar(100),
	"estado" "estado_transportista" DEFAULT 'activo' NOT NULL,
	"observaciones" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "despachos" ALTER COLUMN "transportista" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "despachos" ADD COLUMN "transportista_id" uuid;--> statement-breakpoint
ALTER TABLE "despachos" ADD CONSTRAINT "despachos_transportista_id_transportistas_id_fk" FOREIGN KEY ("transportista_id") REFERENCES "public"."transportistas"("id") ON DELETE no action ON UPDATE no action;