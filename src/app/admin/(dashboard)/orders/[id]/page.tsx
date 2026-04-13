import { OrderStatusPicker } from "@/components/admin/order-status-picker";
import { formatMoney } from "@/lib/format";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/app/actions/admin";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

export default async function AdminOrderDetailPage({ params }: Props) {
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

  const status = order.status as OrderStatus;

  return (
    <div className="space-y-8">
      <nav className="text-2xs uppercase tracking-nav text-muted">
        <Link href="/admin/orders" className="hover:text-ink">
          Orders
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{(order.id as string).slice(0, 8)}…</span>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Order detail</h1>
          <p className="mt-2 text-sm text-muted">
            Placed{" "}
            {order.created_at
              ? new Date(order.created_at as string).toLocaleString()
              : ""}
          </p>
        </div>
        <div className="flex max-w-xs flex-col items-end gap-2 text-right">
          <span className="text-2xs uppercase tracking-nav text-muted">Status</span>
          <OrderStatusPicker orderId={params.id} current={status} />
          <p className="text-[11px] leading-snug text-muted">
            After you verify payment, advance the order through processing, shipped, then delivered—or
            cancel if needed.
          </p>
        </div>
      </div>

      <div className="grid gap-6 border border-line bg-white p-6 sm:grid-cols-2">
        <div>
          <h2 className="text-2xs font-semibold uppercase tracking-nav text-muted">Customer</h2>
          <p className="mt-2 font-medium text-ink">{order.customer_name as string}</p>
          <p className="text-sm text-muted">{order.customer_email as string}</p>
          {order.phone ? (
            <p className="mt-1 text-sm text-muted">{order.phone as string}</p>
          ) : null}
        </div>
        <div>
          <h2 className="text-2xs font-semibold uppercase tracking-nav text-muted">Total</h2>
          <p className="mt-2 font-display text-2xl text-ink">
            {formatMoney(order.total_cents as number, order.currency as string)}
          </p>
          {order.mpesa_receipt_number ? (
            <p className="mt-3 text-2xs text-muted">
              M-Pesa receipt:{" "}
              <span className="font-mono text-ink">{order.mpesa_receipt_number as string}</span>
            </p>
          ) : null}
          {order.mpesa_checkout_request_id ? (
            <p className="mt-1 text-2xs text-muted">
              STK checkout ID:{" "}
              <span className="font-mono text-[10px] text-ink">
                {(order.mpesa_checkout_request_id as string).slice(0, 16)}…
              </span>
            </p>
          ) : null}
        </div>
      </div>

      <div className="overflow-x-auto border border-line bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line bg-subtle text-2xs uppercase tracking-nav text-muted">
            <tr>
              <th className="px-4 py-2 font-medium">Product</th>
              <th className="px-4 py-2 font-medium text-right">Price</th>
              <th className="px-4 py-2 font-medium text-right">Qty</th>
              <th className="px-4 py-2 font-medium text-right">Line total</th>
            </tr>
          </thead>
          <tbody>
            {(items ?? []).map((row) => (
              <tr key={row.id as string} className="border-b border-line/80">
                <td className="px-4 py-3">{row.product_name as string}</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {formatMoney(row.unit_price_cents as number, order.currency as string)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{row.quantity as number}</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {formatMoney(row.line_total_cents as number, order.currency as string)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
