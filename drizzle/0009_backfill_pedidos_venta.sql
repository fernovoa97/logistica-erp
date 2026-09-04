-- Migración de datos: Despachos pasa de apuntar a una Orden de Compra (que
-- en realidad es para compras a proveedores) a apuntar a un Pedido de Venta
-- (la OC que envía el cliente/mina). Como esa relación no existía antes, no
-- hay un dato real que migrar uno a uno: los despachos que ya existan sin
-- pedido de venta se enlazan a un cliente y pedido de venta "placeholder"
-- para no dejar despachos huérfanos, y quedan disponibles para reasignarlos
-- al pedido de venta correcto desde la pantalla de edición.
-- Si no hay despachos pendientes de enlazar, este archivo no crea nada.

INSERT INTO "clientes" ("nombre", "observaciones")
SELECT 'Cliente sin especificar',
       'Creado automáticamente durante la migración a Pedidos de Venta. Reasigna los despachos afectados al cliente y pedido de venta correctos.'
WHERE EXISTS (SELECT 1 FROM "despachos" WHERE "pedido_venta_id" IS NULL)
  AND NOT EXISTS (SELECT 1 FROM "clientes" WHERE "nombre" = 'Cliente sin especificar');
--> statement-breakpoint

INSERT INTO "pedidos_venta" ("cliente_id", "fecha", "observaciones")
SELECT (SELECT "id" FROM "clientes" WHERE "nombre" = 'Cliente sin especificar' LIMIT 1),
       now(),
       'Creado automáticamente durante la migración a Pedidos de Venta. Reasigna los despachos afectados al pedido de venta correcto.'
WHERE EXISTS (SELECT 1 FROM "despachos" WHERE "pedido_venta_id" IS NULL)
  AND NOT EXISTS (
    SELECT 1 FROM "pedidos_venta"
    WHERE "observaciones" = 'Creado automáticamente durante la migración a Pedidos de Venta. Reasigna los despachos afectados al pedido de venta correcto.'
  );
--> statement-breakpoint

UPDATE "despachos"
SET "pedido_venta_id" = (
  SELECT pv."id"
  FROM "pedidos_venta" pv
  WHERE pv."observaciones" = 'Creado automáticamente durante la migración a Pedidos de Venta. Reasigna los despachos afectados al pedido de venta correcto.'
  LIMIT 1
)
WHERE "pedido_venta_id" IS NULL;
