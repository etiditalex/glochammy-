export type CheckoutLine = {
  productId: string;
  quantity: number;
};

export type ParsedStorefrontOrder = {
  orderId: string;
  mpesaNonce: string;
  totalCents: number;
  currency: string;
};

export function parseCreateStorefrontOrderResult(
  data: unknown,
): ParsedStorefrontOrder | null {
  if (typeof data === "string") {
    const id = data.trim();
    if (
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        id,
      )
    ) {
      return { orderId: id, mpesaNonce: "", totalCents: 0, currency: "KES" };
    }
    return null;
  }
  if (!data || typeof data !== "object" || !("order_id" in data)) return null;
  const o = data as Record<string, unknown>;
  const orderId = String(o.order_id);
  const mpesaNonce =
    o.mpesa_nonce != null ? String(o.mpesa_nonce) : "";
  const totalCents =
    typeof o.total_cents === "number"
      ? o.total_cents
      : Number(o.total_cents ?? 0);
  const currency = o.currency != null ? String(o.currency) : "KES";
  if (!orderId) return null;
  return { orderId, mpesaNonce, totalCents, currency };
}

export function mapCreateStorefrontOrderError(message: string | undefined): string {
  const raw = message?.trim() ?? "";
  const m = raw.toLowerCase();
  if (!raw) return "Could not create order.";
  if (m.includes("product not found")) {
    return "Could not load one or more products. Remove old demo items from your bag and add products from the shop again.";
  }
  if (m.includes("mixed currency")) {
    return "Your bag mixes currencies. Remove items and add only products priced in one currency.";
  }
  if (m.includes("invalid quantity")) {
    return "One or more line items have an invalid quantity.";
  }
  if (m.includes("out of stock")) {
    return "One or more items are out of stock. Update your bag and try again.";
  }
  if (m.includes("insufficient stock")) {
    return "Some items no longer have enough stock for your selected quantity.";
  }
  if (m.includes("no items")) return "Your bag is empty.";
  if (m.includes("email required") || m.includes("name required")) {
    return "Enter your name and email.";
  }
  if (m.includes("create_storefront_order")) {
    return "Run the Supabase migration that adds create_storefront_order (see supabase/migrations).";
  }
  return raw;
}
