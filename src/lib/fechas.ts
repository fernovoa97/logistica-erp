/** Convierte una fecha a formato "yyyy-mm-dd" para un <input type="date">,
 * preservando el día local (sin desfase de zona horaria). */
export function aFechaInput(fecha: Date | null | undefined): string {
  if (!fecha) return "";
  const d = new Date(fecha);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}
