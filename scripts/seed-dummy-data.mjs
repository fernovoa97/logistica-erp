// Script de datos de prueba (dummy data) para ver el sistema con información
// realista: transportistas, proveedores, órdenes de compra, clientes,
// artículos, pedidos de venta (con líneas) y despachos, todos enlazados
// entre sí como se usarían en la operación real de Drillco.
//
// Uso:
//   node scripts/seed-dummy-data.mjs            # agrega los datos de prueba
//   node scripts/seed-dummy-data.mjs --reset    # borra TODO lo que haya en
//                                                 las tablas y luego siembra
//                                                 datos de prueba limpios
//
// Lee la conexión desde la variable de entorno DATABASE_URL, o desde tu
// archivo .env en la raíz del proyecto. No depende del paquete `dotenv` (así
// funciona aunque no lo tengas instalado): este script lee el .env a mano.
//
// ⚠️ Pensado para una base de datos de desarrollo/pruebas. Con --reset borra
// TODOS los datos existentes (despachos, pedidos, órdenes de compra,
// catálogos). No lo corras contra tu base de datos de producción a menos
// que quieras empezar de cero.

import { Pool } from "pg";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const RESET = process.argv.includes("--reset");

// Carga .env a mano (sin depender del paquete `dotenv`): busca primero en el
// directorio desde donde se ejecuta el comando, y si no, en la raíz del
// proyecto (un nivel arriba de esta carpeta scripts/).
function cargarEnv() {
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const candidatos = [join(process.cwd(), ".env"), join(scriptDir, "..", ".env")];

  for (const ruta of candidatos) {
    if (!existsSync(ruta)) continue;
    const contenido = readFileSync(ruta, "utf-8");
    for (const linea of contenido.split("\n")) {
      const limpia = linea.trim();
      if (!limpia || limpia.startsWith("#")) continue;
      const idx = limpia.indexOf("=");
      if (idx === -1) continue;
      const clave = limpia.slice(0, idx).trim();
      let valor = limpia.slice(idx + 1).trim();
      if (
        (valor.startsWith('"') && valor.endsWith('"')) ||
        (valor.startsWith("'") && valor.endsWith("'"))
      ) {
        valor = valor.slice(1, -1);
      }
      if (!(clave in process.env)) {
        process.env[clave] = valor;
      }
    }
    return; // usamos el primer .env que encontremos
  }
}

cargarEnv();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error(
    "Falta DATABASE_URL. Define la variable de entorno o crea un archivo .env en la raíz del proyecto (ver .env.example)."
  );
  process.exit(1);
}

const pool = new Pool({ connectionString });

async function main() {
  const client = await pool.connect();
  try {
    if (RESET) {
      console.log("Borrando datos existentes (--reset)...");
      await client.query(`
        TRUNCATE
          despachos,
          pedido_venta_items,
          pedidos_venta,
          ordenes_compra,
          articulos,
          clientes,
          proveedores,
          transportistas
        RESTART IDENTITY CASCADE;
      `);
    }

    console.log("Creando transportistas...");
    const transportistas = await insertMany(
      client,
      "transportistas",
      ["nombre", "documento", "contacto_nombre", "telefono", "vehiculo_placa", "vehiculo_tipo", "estado"],
      [
        ["Transportes Andinos SAC", "20456789123", "Jorge Ramírez", "987 111 222", "ABC-101", "Camión 20 toneladas", "activo"],
        ["Logística del Sur EIRL", "20456789456", "Rosa Medina", "987 222 333", "ABC-202", "Tráiler plataforma", "activo"],
        ["Carga Pesada Perú SAC", "20456789789", "Luis Contreras", "987 333 444", "ABC-303", "Camión 30 toneladas", "activo"],
        ["Transportes Huaytará SRL", "20456780123", "Milagros Soto", null, "ABC-404", "Furgón", "inactivo"],
      ]
    );

    console.log("Creando proveedores...");
    const proveedores = await insertMany(
      client,
      "proveedores",
      ["nombre", "documento", "contacto_nombre", "telefono", "email", "direccion", "estado"],
      [
        ["Herramientas de Perforación del Pacífico SAC", "20512345671", "Marco Villanueva", "01 555 1234", "ventas@hpp.pe", "Av. Argentina 2450, Callao", "activo"],
        ["Importadora Técnica Andina SAC", "20512345672", "Carla Injante", "01 555 5678", "contacto@ita.pe", "Av. Industrial 890, Lima", "activo"],
        ["Repuestos y Aceros del Norte SAC", "20512345673", "Fernando Quispe", "074 234 567", "repuestos@ran.pe", "Carretera Panamericana Norte Km 780, Chiclayo", "activo"],
        ["Global Drilling Supplies Inc.", null, "Peter Lang", "+1 713 555 0199", "sales@globaldrilling.com", "Houston, TX, USA", "activo"],
      ]
    );

    console.log("Creando órdenes de compra (compras a proveedores)...");
    await insertMany(
      client,
      "ordenes_compra",
      ["numero_oc", "proveedor_id", "estado", "fecha_emision", "fecha_entrega_esperada", "monto_total", "observaciones"],
      [
        ["OC-2026-0031", proveedores[0], "recibida", "2026-06-10", "2026-06-25", "48500.00", "Reposición de stock de brocas y coronas."],
        ["OC-2026-0032", proveedores[1], "aprobada", "2026-07-02", "2026-07-20", "125300.00", null],
        ["OC-2026-0033", proveedores[3], "pendiente", "2026-08-05", "2026-09-15", "302750.00", "Importación desde EE.UU., incluye flete y seguro."],
        ["OC-2026-0034", proveedores[2], "recibida", "2026-08-12", "2026-08-18", "9600.00", "Compra local urgente."],
        ["OC-2026-0035", proveedores[0], "cancelada", "2026-07-15", null, "15200.00", "Cancelada: proveedor sin stock."],
      ]
    );

    console.log("Creando clientes (minas)...");
    const clientes = await insertMany(
      client,
      "clientes",
      ["nombre", "documento", "contacto_nombre", "telefono", "email", "direccion", "estado"],
      [
        ["Compañía Minera Los Andes S.A.A.", "20601122331", "Ing. Patricia Fernández", "01 411 2200", "compras@minalosandes.pe", "Unidad Minera Los Andes, Junín", "activo"],
        ["Minera Altiplano SAC", "20601122332", "Ing. Rubén Salinas", "084 233 445", "logistica@altiplano.pe", "Unidad Minera Altiplano, Puno", "activo"],
        ["Sociedad Minera Cordillera Azul SAC", "20601122333", "Ing. Karina Torres", "01 622 8800", "scm@cordilleraazul.pe", "Unidad Minera Cordillera Azul, Áncash", "activo"],
        ["Compañía de Minas del Sur S.A.", "20601122334", "Ing. Walter Huamán", "054 288 900", "abastecimiento@minasdelsur.pe", "Unidad Minera del Sur, Arequipa", "activo"],
        ["Minera Antawara SAC", "20601122335", "Ing. Sofía Delgado", "01 700 1100", "compras@antawara.pe", "Unidad Minera Antawara, Cajamarca", "inactivo"],
      ]
    );

    console.log("Creando artículos (maestro de productos)...");
    const articulos = await insertMany(
      client,
      "articulos",
      ["codigo", "descripcion", "marca", "unidad_medida", "estado"],
      [
        ["ART-0001", 'Broca tricónica 8 1/2" IADC 537', "Sandvik", "UND", "activo"],
        ["ART-0002", 'Broca tricónica 12 1/4" IADC 517', "Sandvik", "UND", "activo"],
        ["ART-0003", "Barra de perforación integral 3 metros", "Atlas Copco", "UND", "activo"],
        ["ART-0004", "Corona diamantada NQ", "Boart Longyear", "UND", "activo"],
        ["ART-0005", "Corona diamantada HQ", "Boart Longyear", "UND", "activo"],
        ["ART-0006", "Manguito de perforación R32", "Epiroc", "UND", "activo"],
        ["ART-0007", "Adaptador de culata R32-T38", "Epiroc", "UND", "activo"],
        ["ART-0008", "Varilla extensión T38 x 4.3m", "Sandvik", "UND", "activo"],
        ["ART-0009", "Estabilizador de perforación 6 3/4\"", "Atlas Copco", "UND", "activo"],
        ["ART-0010", "Aceite para martillo de perforación", "Shell", "GAL", "activo"],
        ["ART-0011", "Broca de botones 6 1/2\" (descontinuada)", "Sandvik", "UND", "inactivo"],
      ]
    );

    console.log("Creando pedidos de venta con líneas...");
    const pedidos = await insertMany(
      client,
      "pedidos_venta",
      ["numero_oc_cliente", "cliente_id", "fecha", "estado", "tipo_venta", "moneda", "condicion_venta", "dias_credito", "observaciones"],
      [
        ["OC-4500987001", clientes[0], "2026-08-01", "completado", "directa", "USD", "credito", 30, null],
        ["OC-4500987002", clientes[1], "2026-08-05", "despachado", "directa", "PEN", "contado", null, null],
        ["OC-4500987003", clientes[2], "2026-08-10", "en_preparacion", "consignacion", "USD", "credito", 60, "Cliente solicita entrega parcial."],
        ["OC-4500987004", clientes[0], "2026-08-15", "pendiente", "directa", "USD", "credito", 15, null],
        ["OC-4500987005", clientes[3], "2026-08-18", "despachado", "directa", "PEN", "contado", null, null],
        ["OC-4500987006", clientes[1], "2026-08-22", "pendiente", "consignacion", "USD", "credito", 90, "Pendiente confirmación de precios."],
        ["OC-4500987007", clientes[2], "2026-08-28", "cancelado", "directa", "PEN", "contado", null, "Cliente canceló el pedido."],
      ]
    );

    const itemsPorPedido = [
      [
        [articulos[0], "20.00", "185.50", null],
        [articulos[7], "10.00", "410.00", null],
      ],
      [
        [articulos[3], "6.00", "1250.00", null],
        [articulos[5], "12.00", "95.00", "Verificar disponibilidad de stock."],
      ],
      [
        [articulos[4], "4.00", "1480.00", null],
      ],
      [
        [articulos[1], "8.00", "210.75", null],
        [articulos[6], "15.00", "68.00", null],
        [articulos[9], "30.00", "22.50", null],
      ],
      [
        [articulos[2], "5.00", "980.00", null],
      ],
      [
        [articulos[3], "10.00", "1250.00", null],
        [articulos[4], "10.00", "1480.00", null],
      ],
      [
        [articulos[8], "2.00", "1600.00", null],
      ],
    ];

    for (let i = 0; i < pedidos.length; i++) {
      const filas = itemsPorPedido[i].map(([articuloId, cantidad, precio, obs]) => [
        pedidos[i],
        articuloId,
        cantidad,
        precio,
        obs,
      ]);
      await insertMany(
        client,
        "pedido_venta_items",
        ["pedido_venta_id", "articulo_id", "cantidad", "precio_unitario", "observaciones"],
        filas
      );
    }

    console.log("Creando despachos enlazados a los pedidos de venta...");
    await insertMany(
      client,
      "despachos",
      ["numero_guia", "transportista_id", "origen", "destino", "pedido_venta_id", "estado", "fecha_despacho", "fecha_entrega_estimada", "observaciones"],
      [
        ["T001-000501", transportistas[0], "Almacén Lima", "Junín", pedidos[0], "entregado", "2026-08-03", "2026-08-05", null],
        ["T001-000502", transportistas[1], "Almacén Lima", "Puno", pedidos[1], "en_transito", "2026-08-07", "2026-08-11", null],
        ["T001-000503", transportistas[2], "Almacén Callao", "Arequipa", pedidos[4], "entregado", "2026-08-19", "2026-08-22", "Entrega parcial, saldo pendiente."],
        ["T001-000504", transportistas[0], "Almacén Lima", "Áncash", pedidos[2], "pendiente", "2026-08-29", "2026-09-02", "En espera de confirmación de la mina."],
      ]
    );

    console.log("\n✅ Datos de prueba creados con éxito:");
    console.log(`   ${transportistas.length} transportistas, ${proveedores.length} proveedores, 5 órdenes de compra`);
    console.log(`   ${clientes.length} clientes, ${articulos.length} artículos, ${pedidos.length} pedidos de venta, 4 despachos`);
  } finally {
    client.release();
  }
}

/** Inserta varias filas en `tabla` y devuelve el array de ids generados, en el mismo orden que `filas`. */
async function insertMany(client, tabla, columnas, filas) {
  const ids = [];
  for (const valores of filas) {
    const placeholders = valores.map((_, i) => `$${i + 1}`).join(", ");
    const { rows } = await client.query(
      `INSERT INTO "${tabla}" (${columnas.map((c) => `"${c}"`).join(", ")}) VALUES (${placeholders}) RETURNING id`,
      valores
    );
    ids.push(rows[0].id);
  }
  return ids;
}

main()
  .catch((err) => {
    console.error("Error al crear los datos de prueba:", err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
