-- Migración de datos: por cada valor distinto que ya existía como texto
-- libre en despachos.orden_compra_ref, crea una Orden de Compra real
-- (asociada a un proveedor placeholder, porque el texto libre nunca guardó
-- esa información) y enlaza los despachos correspondientes por
-- orden_compra_id. Si no había despachos con orden_compra_ref, este archivo
-- no crea nada.

-- Proveedor placeholder, solo si hace falta.
INSERT INTO "proveedores" ("nombre", "observaciones")
SELECT 'Proveedor sin especificar',
       'Creado automáticamente durante la migración a la tabla de órdenes de compra.'
WHERE EXISTS (
  SELECT 1 FROM "despachos"
  WHERE "orden_compra_ref" IS NOT NULL AND btrim("orden_compra_ref") <> ''
)
AND NOT EXISTS (
  SELECT 1 FROM "proveedores" WHERE "nombre" = 'Proveedor sin especificar'
);
--> statement-breakpoint

-- Una Orden de Compra por cada número distinto que ya existía. La fecha de
-- emisión se estima como la fecha de despacho más antigua entre los
-- despachos que la referencian (no había una fecha de emisión real guardada
-- en el texto libre).
INSERT INTO "ordenes_compra" ("numero_oc", "proveedor_id", "fecha_emision", "observaciones")
SELECT
  d."orden_compra_ref",
  (SELECT "id" FROM "proveedores" WHERE "nombre" = 'Proveedor sin especificar' LIMIT 1),
  MIN(d."fecha_despacho"),
  'Creada automáticamente durante la migración a partir de despachos existentes.'
FROM "despachos" d
WHERE d."orden_compra_ref" IS NOT NULL AND btrim(d."orden_compra_ref") <> ''
GROUP BY d."orden_compra_ref";
--> statement-breakpoint

UPDATE "despachos" AS d
SET "orden_compra_id" = oc."id"
FROM "ordenes_compra" AS oc
WHERE d."orden_compra_ref" = oc."numero_oc"
  AND d."orden_compra_id" IS NULL;
