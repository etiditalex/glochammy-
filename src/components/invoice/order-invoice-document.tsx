import { BRAND } from "@/lib/constants";
import { formatInvoiceNumber, type OrderInvoiceData } from "@/lib/invoice";
import { formatMoney } from "@/lib/format";
import Image from "next/image";

type Props = {
  data: OrderInvoiceData;
  variant: "admin" | "customer";
};

export function OrderInvoiceDocument({ data, variant }: Props) {
  const invNo = formatInvoiceNumber(data.id, data.created_at);
  const placed = data.created_at
    ? new Date(data.created_at).toLocaleString("en-KE", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";
  const subtotalCents = data.items.reduce((sum, r) => sum + r.line_total_cents, 0);
  const footerSecondLine =
    variant === "admin"
      ? "This document was generated from your store admin for fulfilment and records."
      : "Keep this invoice for your records. Questions? Contact us with your order ID.";

  return (
    <article className="mx-auto max-w-3xl border border-line bg-white p-6 shadow-sm print:max-w-none print:border-0 print:p-0 print:shadow-none sm:p-10">
      <header className="flex flex-col gap-6 border-b border-line pb-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-line bg-cream">
            <Image
              src={BRAND.logoSrc}
              alt=""
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
          <div>
            <p className="font-display text-xl text-ink">{BRAND.name}</p>
            <p className="mt-1 text-sm text-muted">{BRAND.addressLine}</p>
            <p className="mt-0.5 text-sm text-muted">{BRAND.region}</p>
            <p className="mt-1 text-sm text-muted">{BRAND.email}</p>
            <p className="text-sm text-muted">{BRAND.phone}</p>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-2xs font-semibold uppercase tracking-nav text-muted">Tax invoice</p>
          <p className="mt-2 font-mono text-lg font-medium text-ink">{invNo}</p>
          <p className="mt-3 text-2xs uppercase tracking-nav text-muted">Order ID</p>
          <p className="mt-0.5 break-all font-mono text-xs text-ink">{data.id}</p>
          <p className="mt-3 text-2xs uppercase tracking-nav text-muted">Date</p>
          <p className="mt-0.5 text-sm text-ink">{placed}</p>
          <p className="mt-3 text-2xs uppercase tracking-nav text-muted">Status</p>
          <p className="mt-0.5 text-sm capitalize text-ink">{data.status}</p>
        </div>
      </header>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="text-2xs font-semibold uppercase tracking-nav text-muted">Bill to</h2>
          <p className="mt-2 font-medium text-ink">{data.customer_name}</p>
          <p className="mt-1 text-sm text-muted">{data.customer_email}</p>
          {data.phone ? <p className="mt-1 text-sm text-muted">{data.phone}</p> : null}
        </div>
        <div className="sm:text-right">
          <h2 className="text-2xs font-semibold uppercase tracking-nav text-muted sm:text-right">
            Payment reference
          </h2>
          {data.mpesa_receipt_number ? (
            <p className="mt-2 font-mono text-sm text-ink">M-Pesa: {data.mpesa_receipt_number}</p>
          ) : (
            <p className="mt-2 text-sm text-muted">—</p>
          )}
        </div>
      </div>

      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="border-b border-line bg-subtle text-2xs uppercase tracking-nav text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">Description</th>
              <th className="px-3 py-2 font-medium text-right">Unit</th>
              <th className="px-3 py-2 font-medium text-right">Qty</th>
              <th className="px-3 py-2 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((row, idx) => (
              <tr key={`${row.product_name}-${idx}`} className="border-b border-line/80">
                <td className="px-3 py-3">{row.product_name}</td>
                <td className="px-3 py-3 text-right tabular-nums">
                  {formatMoney(row.unit_price_cents, data.currency)}
                </td>
                <td className="px-3 py-3 text-right tabular-nums">{row.quantity}</td>
                <td className="px-3 py-3 text-right tabular-nums">
                  {formatMoney(row.line_total_cents, data.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex flex-col items-end gap-2 border-t border-line pt-6">
        <div className="flex w-full max-w-xs justify-between text-sm text-muted sm:w-72">
          <span>Subtotal</span>
          <span className="tabular-nums text-ink">{formatMoney(subtotalCents, data.currency)}</span>
        </div>
        <div className="flex w-full max-w-xs justify-between text-base font-medium text-ink sm:w-72">
          <span>Total due</span>
          <span className="tabular-nums">{formatMoney(data.total_cents, data.currency)}</span>
        </div>
      </div>

      {data.notes ? (
        <div className="mt-8 border-t border-line pt-6">
          <h2 className="text-2xs font-semibold uppercase tracking-nav text-muted">Notes</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-muted">{data.notes}</p>
        </div>
      ) : null}

      <footer className="mt-12 border-t border-line pt-6 text-center text-2xs text-muted">
        <p>Thank you for shopping with {BRAND.shortName}.</p>
        <p className="mt-1">{footerSecondLine}</p>
      </footer>
    </article>
  );
}
