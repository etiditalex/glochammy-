import { OrderInvoiceDocument } from "@/components/invoice/order-invoice-document";
import { PrintInvoiceButton } from "@/components/invoice/print-invoice-button";
import type { OrderInvoiceData } from "@/lib/invoice";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Invoice · Order ${params.id.slice(0, 8)}…`,
  };
}

export default async function AdminOrderInvoicePage({ params }: Props) {
  const supabase = createServerSupabaseClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (!order) notFound();

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", params.id)
    .order("id", { ascending: true });

  const rows = (items ?? []) as Record<string, unknown>[];
  const o = order as Record<string, unknown>;

  const data: OrderInvoiceData = {
    id: String(o.id),
    status: String(o.status ?? ""),
    total_cents: Number(o.total_cents ?? 0),
    currency: String(o.currency ?? "KES"),
    created_at: String(o.created_at ?? ""),
    customer_name: String(o.customer_name ?? ""),
    customer_email: String(o.customer_email ?? ""),
    phone: o.phone != null && String(o.phone).trim() !== "" ? String(o.phone) : null,
    notes: o.notes != null && String(o.notes).trim() !== "" ? String(o.notes) : null,
    mpesa_receipt_number:
      o.mpesa_receipt_number != null && String(o.mpesa_receipt_number).trim() !== ""
        ? String(o.mpesa_receipt_number)
        : null,
    items: rows.map((r) => ({
      product_name: String(r.product_name ?? ""),
      quantity: Number(r.quantity ?? 0),
      unit_price_cents: Number(r.unit_price_cents ?? 0),
      line_total_cents: Number(r.line_total_cents ?? 0),
    })),
  };

  return (
    <div className="print:max-w-none print:p-0">
      <nav className="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="text-2xs uppercase tracking-nav text-muted">
          <Link href="/admin/orders" className="hover:text-ink">
            Orders
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/admin/orders/${params.id}`} className="hover:text-ink">
            Order
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">Invoice</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <PrintInvoiceButton />
          <Link
            href={`/admin/orders/${params.id}`}
            className="border border-line bg-white px-4 py-2.5 text-2xs font-medium uppercase tracking-nav text-ink hover:bg-subtle"
          >
            Back to order
          </Link>
        </div>
      </nav>

      <OrderInvoiceDocument data={data} variant="admin" />
    </div>
  );
}
