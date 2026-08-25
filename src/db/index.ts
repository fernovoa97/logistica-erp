import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

declare global {
  var __pgPool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // Solo advertimos (en vez de lanzar) para no romper el análisis estático
  // de rutas de Next.js durante `next build`. En tiempo de ejecución, un
  // intento real de consulta fallará con un error de conexión claro si
  // DATABASE_URL sigue sin definirse.
  console.warn(
    "[db] Falta la variable de entorno DATABASE_URL. Define la conexión a PostgreSQL (ver .env.example)."
  );
}

// Reutilizamos el pool entre recargas en desarrollo para no agotar
// las conexiones disponibles de Postgres.
const pool =
  global.__pgPool ??
  new Pool({
    connectionString,
    max: 10,
  });

if (process.env.NODE_ENV !== "production") {
  global.__pgPool = pool;
}

export const db = drizzle(pool, { schema });
