"use client";

import { ButtonPush } from "@/components/ui/button-push";
import { formatMoney } from "@/lib/format";
import { Calendar, Printer } from "lucide-react";
import { useMemo, useState } from "react";

export type SalesReportRow = {
  id: string;
  sold_at: string;
  item_name: string;
  quantity: number;
  unit_price_cents: number;
  total_cents: number;
  currency: string;
  payment_method: "cash" | "mpesa";
  mpesa_code: string | null;
};

type Props = {
  rows: SalesReportRow[];
};

export function SalesReportPanel({ rows }: Props) {
  const today = new Date();
  const defaultStart = new Date(today);
  defaultStart.setDate(today.getDate() - 6);
  const [start, setStart] = useState(defaultStart.toISOString().slice(0, 10));
  const [end, setEnd] = useState(today.toISOString().slice(0, 10));

  function handlePrint() {
    window.print();
  }

  const filtered = useMemo(() => {
    const startDate = start ? new Date(`${start}T00:00:00`).getTime() : Number.NEGATIVE_INFINITY;
    const endDate = end ? new Date(`${end}T23:59:59`).getTime() : Number.POSITIVE_INFINITY;
    return rows.filter((r) => {
      const t = new Date(r.sold_at).getTime();
      return t >= startDate && t <= endDate;
    });
  }, [rows, start, end]);

  const totals = useMemo(() => {
    return filtered.reduce(
      (acc, r) => {
        acc.all += r.total_cents;
        if (r.payment_method === "cash") acc.cash += r.total_cents;
        if (r.payment_method === "mpesa") acc.mpesa += r.total_cents;
        return acc;
      },
      { all: 0, cash: 0, mpesa: 0 },
    );
  }, [filtered]);

  const currency = filtered[0]?.currency ?? rows[0]?.currency ?? "KES";

  return (
    <div className="border border-line bg-white">
      <div className="p-6 sm:p-8 print:p-4">
        <h1 className="font-display text-2xl text-ink sm:text-3xl">Sales report</h1>
        <p className="mt-2 text-sm text-muted">
          Generated from physical shop sales recorded under Inventory list.
        </p>

        <div className="mt-8 flex flex-col gap-4 border-b border-line pb-8 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="min-w-[160px]">
            <label
              htmlFor="sales-start"
              className="text-2xs font-medium uppercase tracking-nav text-muted"
            >
              Date start
            </label>
            <div className="relative mt-2">
              <input
                id="sales-start"
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full border border-line bg-white px-3 py-2.5 pr-10 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              />
              <Calendar
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden
              />
            </div>
          </div>
          <div className="min-w-[160px]">
            <label
              htmlFor="sales-end"
              className="text-2xs font-medium uppercase tracking-nav text-muted"
            >
              Date end
            </label>
            <div className="relative mt-2">
              <input
                id="sales-end"
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full border border-line bg-white px-3 py-2.5 pr-10 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              />
              <Calendar
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <ButtonPush type="button" onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              Print
            </ButtonPush>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3 print:mt-4">
          <div className="border border-line bg-subtle px-4 py-3">
            <p className="text-2xs uppercase tracking-nav text-muted">Total sales</p>
            <p className="mt-1 text-lg font-medium text-ink">{formatMoney(totals.all, currency)}</p>
          </div>
          <div className="border border-line bg-subtle px-4 py-3">
            <p className="text-2xs uppercase tracking-nav text-muted">Cash</p>
            <p className="mt-1 text-lg font-medium text-ink">{formatMoney(totals.cash, currency)}</p>
          </div>
          <div className="border border-line bg-subtle px-4 py-3">
            <p className="text-2xs uppercase tracking-nav text-muted">M-Pesa</p>
            <p className="mt-1 text-lg font-medium text-ink">{formatMoney(totals.mpesa, currency)}</p>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-line bg-subtle text-2xs uppercase tracking-nav text-muted">
              <tr>
                <th className="px-3 py-2 font-medium">#</th>
                <th className="px-3 py-2 font-medium">Date / time</th>
                <th className="px-3 py-2 font-medium">Product</th>
                <th className="px-3 py-2 font-medium">Payment</th>
                <th className="px-3 py-2 font-medium text-right">Price</th>
                <th className="px-3 py-2 font-medium text-right">Qty</th>
                <th className="px-3 py-2 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-12 text-center text-muted">
                    No sales entries in this date range.
                  </td>
                </tr>
              ) : (
                filtered.map((row, idx) => (
                  <tr key={row.id} className="border-b border-line/70">
                    <td className="px-3 py-2">{idx + 1}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-muted">
                      {new Date(row.sold_at).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">{row.item_name}</td>
                    <td className="px-3 py-2">
                      <span className="capitalize">{row.payment_method}</span>
                      {row.mpesa_code ? (
                        <span className="ml-2 font-mono text-xs text-muted">{row.mpesa_code}</span>
                      ) : null}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {formatMoney(row.unit_price_cents, row.currency)}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">{row.quantity}</td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {formatMoney(row.total_cents, row.currency)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="border-t border-line bg-cream font-medium text-ink">
              <tr>
                <td colSpan={6} className="px-3 py-3 text-right uppercase tracking-nav text-2xs text-muted">
                  Total sales
                </td>
                <td className="px-3 py-3 text-right tabular-nums">
                  {formatMoney(totals.all, currency)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
