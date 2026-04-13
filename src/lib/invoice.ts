export type OrderInvoiceLine = {
  product_name: string;
  quantity: number;
  unit_price_cents: number;
  line_total_cents: number;
};

export type OrderInvoiceData = {
  id: string;
  status: string;
  total_cents: number;
  currency: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  phone: string | null;
  notes: string | null;
  mpesa_receipt_number: string | null;
  items: OrderInvoiceLine[];
};

export function formatInvoiceNumber(orderId: string, createdAtIso: string | null): string {
  const d = createdAtIso ? new Date(createdAtIso) : new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const short = orderId.replace(/-/g, "").slice(0, 8).toUpperCase();
  return `INV-${y}${m}${day}-${short}`;
}
