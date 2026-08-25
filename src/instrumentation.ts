export async function register() {
  // Solo corre en el entorno Node.js del servidor (no en el edge runtime
  // ni durante el build), y solo una vez al arrancar el proceso.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { runMigrations } = await import("./db/migrate");
    await runMigrations();
  }
}
