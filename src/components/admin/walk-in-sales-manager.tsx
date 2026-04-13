"use client";

import {
  createWalkInSaleAction,
  deleteWalkInSaleAction,
  updateWalkInSaleAction,
  type WalkInPaymentMethod,
} from "@/app/actions/admin";
import { formatMoney } from "@/lib/format";
import { useRouter } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";

export type WalkInSaleRow = {
  id: string;
  item_name: string;
  quantity: number;
  unit_price_cents: number;
  total_cents: number;
  currency: string;
  payment_method: WalkInPaymentMethod;
  mpesa_code: string | null;
  notes: string | null;
  sold_at: string;
};

const field =
  "mt-1 w-full min-w-0 border border-line bg-white px-3 py-2 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
const label = "text-2xs uppercase tracking-nav text-muted";

function toDateTimeLocal(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day}T${hh}:${mm}`;
}

function SaleRow({ row }: { row: WalkInSaleRow }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<WalkInPaymentMethod>(row.payment_method);

  async function onSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const r = await updateWalkInSaleAction(row.id, fd);
    setPending(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    router.refresh();
  }

  async function onDelete() {
    if (!confirm(`Delete sale entry "${row.item_name}"? This cannot be undone.`)) return;
    setError(null);
    setPending(true);
    const r = await deleteWalkInSaleAction(row.id);
    setPending(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    router.refresh();
  }

  return (
    <tr className="border-b border-line/80 align-top">
      <td className="px-4 py-3 font-mono text-xs text-muted">{row.id.slice(0, 8)}…</td>
      <td className="px-4 py-3">
        <form onSubmit={(e) => void onSave(e)} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor={`item-${row.id}`} className={label}>
                Item
              </label>
              <input
                id={`item-${row.id}`}
                name="itemName"
                required
                defaultValue={row.item_name}
                className={field}
              />
            </div>
            <div>
              <label htmlFor={`sold-at-${row.id}`} className={label}>
                Sold at
              </label>
              <input
                id={`sold-at-${row.id}`}
                name="soldAt"
                type="datetime-local"
                defaultValue={toDateTimeLocal(row.sold_at)}
                className={field}
              />
            </div>
            <div>
              <label htmlFor={`qty-${row.id}`} className={label}>
                Qty
              </label>
              <input
                id={`qty-${row.id}`}
                name="quantity"
                type="number"
                min={1}
                required
                defaultValue={row.quantity}
                className={field}
              />
            </div>
            <div>
              <label htmlFor={`unit-${row.id}`} className={label}>
                Unit price
              </label>
              <input
                id={`unit-${row.id}`}
                name="unitPrice"
                type="number"
                min={0}
                step="0.01"
                required
                defaultValue={(row.unit_price_cents / 100).toFixed(2)}
                className={field}
              />
            </div>
            <div>
              <label htmlFor={`pay-${row.id}`} className={label}>
                Payment
              </label>
              <select
                id={`pay-${row.id}`}
                name="paymentMethod"
                defaultValue={row.payment_method}
                onChange={(e) => setPaymentMethod(e.target.value as WalkInPaymentMethod)}
                className={field}
              >
                <option value="cash">Cash</option>
                <option value="mpesa">M-Pesa</option>
              </select>
            </div>
            <div>
              <label htmlFor={`code-${row.id}`} className={label}>
                M-Pesa code
              </label>
              <input
                id={`code-${row.id}`}
                name="mpesaCode"
                defaultValue={row.mpesa_code ?? ""}
                required={paymentMethod === "mpesa"}
                className={field}
                placeholder={paymentMethod === "mpesa" ? "e.g. RKT1ABC234" : "Leave blank for cash"}
              />
            </div>
          </div>

          <div>
            <label htmlFor={`notes-${row.id}`} className={label}>
              Notes
            </label>
            <textarea
              id={`notes-${row.id}`}
              name="notes"
              rows={2}
              defaultValue={row.notes ?? ""}
              className={field}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={pending}
              className="border border-line bg-white px-4 py-2 text-2xs font-medium uppercase tracking-nav text-ink hover:bg-subtle disabled:opacity-50"
            >
              Save
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => void onDelete()}
              className="text-2xs uppercase tracking-nav text-red-700 underline underline-offset-4 disabled:opacity-50"
            >
              Delete
            </button>
            <span className="text-sm text-muted">
              Total: {formatMoney(row.total_cents, row.currency)}
            </span>
          </div>
        </form>
        {error ? (
          <p className="mt-2 text-xs text-red-700" role="alert">
            {error}
          </p>
        ) : null}
      </td>
    </tr>
  );
}

export function WalkInSalesManager({ initial }: { initial: WalkInSaleRow[] }) {
  const router = useRouter();
  const [addError, setAddError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<WalkInPaymentMethod>("cash");

  const total = useMemo(
    () => initial.reduce((sum, row) => sum + row.total_cents, 0),
    [initial],
  );
  const currency = initial[0]?.currency ?? "KES";

  async function onAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAddError(null);
    setPending(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const r = await createWalkInSaleAction(fd);
    setPending(false);
    if (!r.ok) {
      setAddError(r.error);
      return;
    }
    form.reset();
    setPaymentMethod("cash");
    router.refresh();
  }

  return (
    <div className="space-y-10">
      <section className="border border-line bg-white p-6">
        <h2 className="font-display text-xl text-ink">Record physical shop sale</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
          Use this ledger for items sold in-store (including products not listed on the website).
          Cash and M-Pesa are supported. M-Pesa codes are unique to prevent duplicates.
        </p>

        <form onSubmit={(e) => void onAdd(e)} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2 lg:col-span-1">
              <label htmlFor="new-item-name" className={label}>
                Item name
              </label>
              <input id="new-item-name" name="itemName" required className={field} />
            </div>
            <div>
              <label htmlFor="new-quantity" className={label}>
                Quantity
              </label>
              <input id="new-quantity" name="quantity" type="number" min={1} defaultValue={1} required className={field} />
            </div>
            <div>
              <label htmlFor="new-unit-price" className={label}>
                Unit price
              </label>
              <input
                id="new-unit-price"
                name="unitPrice"
                type="number"
                step="0.01"
                min={0}
                required
                className={field}
              />
            </div>
            <div>
              <label htmlFor="new-currency" className={label}>
                Currency
              </label>
              <input id="new-currency" name="currency" defaultValue="KES" className={field} />
            </div>
            <div>
              <label htmlFor="new-payment-method" className={label}>
                Payment method
              </label>
              <select
                id="new-payment-method"
                name="paymentMethod"
                defaultValue="cash"
                onChange={(e) => setPaymentMethod(e.target.value as WalkInPaymentMethod)}
                className={field}
              >
                <option value="cash">Cash</option>
                <option value="mpesa">M-Pesa</option>
              </select>
            </div>
            <div>
              <label htmlFor="new-mpesa-code" className={label}>
                M-Pesa code
              </label>
              <input
                id="new-mpesa-code"
                name="mpesaCode"
                required={paymentMethod === "mpesa"}
                className={field}
                placeholder={paymentMethod === "mpesa" ? "e.g. RKT1ABC234" : "Leave blank for cash"}
              />
            </div>
            <div>
              <label htmlFor="new-sold-at" className={label}>
                Sold at
              </label>
              <input id="new-sold-at" name="soldAt" type="datetime-local" className={field} />
            </div>
          </div>
          <div>
            <label htmlFor="new-notes" className={label}>
              Notes
            </label>
            <textarea id="new-notes" name="notes" rows={2} className={field} />
          </div>
          {addError ? (
            <p className="text-sm text-red-700" role="alert">
              {addError}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="border border-ink bg-ink px-5 py-2 text-2xs font-medium uppercase tracking-nav text-white disabled:opacity-50"
          >
            {pending ? "Saving…" : "Add sale entry"}
          </button>
        </form>
      </section>

      <section className="border border-line bg-white">
        <div className="border-b border-line bg-subtle px-4 py-3">
          <h2 className="font-display text-lg text-ink">Sales inventory</h2>
          <p className="mt-1 text-2xs text-muted">
            Edit or delete wrong entries. Total recorded: {formatMoney(total, currency)}.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-line text-2xs uppercase tracking-nav text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Sale</th>
                <th className="px-4 py-3 font-medium">Details</th>
              </tr>
            </thead>
            <tbody>
              {initial.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-4 py-10 text-muted">
                    No physical sales recorded yet.
                  </td>
                </tr>
              ) : (
                initial.map((row) => <SaleRow key={row.id} row={row} />)
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
