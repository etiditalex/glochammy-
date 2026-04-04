export function formatMoney(
  priceCents: number,
  currency: string,
  locale = "en-KE",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(priceCents / 100);
}
