/** Normalize to Safaricom API format: 2547XXXXXXXX (12 digits) */
export function normalizeKenyaMsisdnForStk(input: string): string | null {
  const d = input.replace(/\D/g, "");
  if (d.startsWith("254") && d.length === 12) return d;
  if (d.startsWith("254") && d.length > 12) return null;
  if (d.startsWith("0") && d.length === 10) return `254${d.slice(1)}`;
  if (d.length === 9 && d.startsWith("7")) return `254${d}`;
  return null;
}
