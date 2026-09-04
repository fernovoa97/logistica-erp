-- Migración de datos: crea un registro en "transportistas" por cada nombre
-- distinto que ya existía como texto libre en despachos.transportista, y
-- enlaza cada despacho a su transportista correspondiente por
-- transportista_id. Si la tabla despachos está vacía (instalación nueva),
-- este archivo no hace nada.

INSERT INTO "transportistas" ("nombre")
SELECT DISTINCT "transportista"
FROM "despachos"
WHERE "transportista" IS NOT NULL AND btrim("transportista") <> ''
ON CONFLICT DO NOTHING;
--> statement-breakpoint

UPDATE "despachos" AS d
SET "transportista_id" = t."id"
FROM "transportistas" AS t
WHERE d."transportista" = t."nombre"
  AND d."transportista_id" IS NULL;
--> statement-breakpoint

-- Cualquier despacho que por algún motivo haya quedado sin transportista
-- (texto vacío/nulo) se enlaza a un transportista placeholder para poder
-- volver transportista_id NOT NULL en el siguiente paso de migración.
INSERT INTO "transportistas" ("nombre", "observaciones")
SELECT 'Transportista sin especificar', 'Creado automáticamente durante la migración a la tabla de transportistas.'
WHERE EXISTS (
  SELECT 1 FROM "despachos" WHERE "transportista_id" IS NULL
);
--> statement-breakpoint

UPDATE "despachos"
SET "transportista_id" = (
  SELECT "id" FROM "transportistas" WHERE "nombre" = 'Transportista sin especificar' LIMIT 1
)
WHERE "transportista_id" IS NULL;
