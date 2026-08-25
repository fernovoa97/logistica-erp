import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import path from "node:path";

/**
 * Aplica las migraciones pendientes contra DATABASE_URL.
 * Se ejecuta automáticamente una vez al iniciar el servidor
 * (ver src/instrumentation.ts), así que desplegar en Railway
 * no requiere ningún paso manual de base de datos.
 */
export async function runMigrations() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn(
      "[db] DATABASE_URL no está definida; se omiten las migraciones."
    );
    return;
  }

  const pool = new Pool({ connectionString, max: 1 });
  const db = drizzle(pool);

  try {
    console.log("[db] Aplicando migraciones pendientes...");
    await migrate(db, {
      migrationsFolder: path.join(process.cwd(), "drizzle"),
    });
    console.log("[db] Migraciones al día.");
  } catch (err) {
    console.error("[db] Error aplicando migraciones:", err);
    throw err;
  } finally {
    await pool.end();
  }
}
