/** Align with RFC-style UUIDs used in Postgres (versions 1–8). */
export const ORDER_UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function normalizeOrderUuid(raw: string): string | null {
  const s = raw.trim().replace(/\s+/g, "");
  if (!ORDER_UUID_RE.test(s)) return null;
  return s.toLowerCase();
}
