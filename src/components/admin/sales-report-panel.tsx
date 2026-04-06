"use client";

import { ButtonPush } from "@/components/ui/button-push";
import { Calendar, Filter, Printer } from "lucide-react";
import { useState } from "react";

export function SalesReportPanel() {
  const today = new Date().toISOString().slice(0, 10);
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(today);

  function handlePrint() {
    window.print();
  }

  return (
    <div className="border border-line bg-white">
      <div className="p-6 sm:p-8 print:p-4">
        <h1 className="font-display text-2xl text-ink sm:text-3xl">Sales report</h1>
        <p className="mt-2 text-sm text-muted">
          Filter completed orders by date once the orders table is connected. This layout
          matches how reports will look in production.
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
            <ButtonPush type="button" variant="secondary" className="gap-2">
              <Filter className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              Filter
            </ButtonPush>
            <ButtonPush type="button" onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              Print
            </ButtonPush>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-line bg-subtle text-2xs uppercase tracking-nav text-muted">
              <tr>
                <th className="px-3 py-2 font-medium">#</th>
                <th className="px-3 py-2 font-medium">Date / time</th>
                <th className="px-3 py-2 font-medium">Product</th>
                <th className="px-3 py-2 font-medium">Client</th>
                <th className="px-3 py-2 font-medium">Payment</th>
                <th className="px-3 py-2 font-medium text-right">Price</th>
                <th className="px-3 py-2 font-medium text-right">Qty</th>
                <th className="px-3 py-2 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={8} className="px-3 py-12 text-center text-muted">
                  No sales data yet. Connect orders and payments to populate this report.
                </td>
              </tr>
            </tbody>
            <tfoot className="border-t border-line bg-cream font-medium text-ink">
              <tr>
                <td colSpan={7} className="px-3 py-3 text-right uppercase tracking-nav text-2xs text-muted">
                  Total sales
                </td>
                <td className="px-3 py-3 text-right tabular-nums">—</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
