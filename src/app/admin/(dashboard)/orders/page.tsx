import type { OrderStatus } from "@/app/actions/admin";
import { OrdersAutoRefresh } from "@/components/admin/orders-auto-refresh";
import { OrderStatusPicker } from "@/components/admin/order-status-picker";
import { formatMoney } from "@/lib/format";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminOrdersPage() {
  const supabase = createServerSupabaseClient();
  const { data: rows } = await supabase
    .from("orders")
    .select("id, customer_name, customer_email, total_cents, currency, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <OrdersAutoRefresh />
      <div>
        <h1 className="font-display text-3xl text-ink">Order list</h1>
        <p className="mt-2 text-sm text-muted">
          Orders created when customers complete checkout from the cart. Guest orders match by
          email; signed-in customers are linked to their account. Use the status menu on each row to
          move orders through fulfillment (for example paid → processing → shipped → delivered).
        </p>
      </div>

      <div className="overflow-x-auto border border-line bg-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-line bg-subtle text-2xs uppercase tracking-nav text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">Order</th>
              <th className="px-3 py-2 font-medium">Customer</th>
              <th className="px-3 py-2 font-medium">Total</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Date</th>
              <th className="px-3 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-10 text-center text-muted">
                  No orders yet. When shoppers place orders from the cart, they will appear here.
                </td>
              </tr>
            ) : (
              (rows ?? []).map((o) => (
                <tr key={o.id as string} className="border-b border-line/80">
                  <td className="px-3 py-3 font-mono text-xs text-muted">
                    {(o.id as string).slice(0, 8)}…
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-medium text-ink">{o.customer_name as string}</div>
                    <div className="text-xs text-muted">{o.customer_email as string}</div>
                  </td>
                  <td className="px-3 py-3 tabular-nums">
                    {formatMoney(o.total_cents as number, o.currency as string)}
                  </td>
                  <td className="px-3 py-3 align-top">
                    <OrderStatusPicker
                      orderId={o.id as string}
                      current={o.status as OrderStatus}
                    />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-xs text-muted">
                    {o.created_at
                      ? new Date(o.created_at as string).toLocaleString()
                      : "—"}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="text-2xs uppercase tracking-nav text-ink underline underline-offset-4"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
