"use client";

import { accountOrderInvoiceAction } from "@/app/actions/order-invoice";
import { OrderInvoiceDocument } from "@/components/invoice/order-invoice-document";
import { PrintInvoiceButton } from "@/components/invoice/print-invoice-button";
import Link from "next/link";
import { type FormEvent, useId, useState, useTransition } from "react";

export function AccountOrderInvoiceForm() {
  const fieldId = useId();
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Awaited<
    ReturnType<typeof accountOrderInvoiceAction>
  > | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!orderId.trim()) {
      setError("Enter your order ID.");
      return;
    }
    startTransition(async () => {
      const res = await accountOrderInvoiceAction(orderId);
      if (res.ok) {
        setResult(res);
      } else {
        setError(res.error);
      }
    });
  }

  if (result?.ok) {
    return (
      <div className="mt-6 space-y-4 border-t border-line/60 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button
            type="button"
            className="font-sans text-sm text-ink underline decoration-1 underline-offset-4"
            onClick={() => {
              setResult(null);
              setError(null);
            }}
          >
            ← Another order
          </button>
          <PrintInvoiceButton />
        </div>
        <OrderInvoiceDocument data={result.invoice} variant="customer" />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3" noValidate>
      <label htmlFor={fieldId} className="block font-sans text-xs font-medium text-ink">
        Order ID (full UUID)
      </label>
      <input
        id={fieldId}
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        autoComplete="off"
        className="w-full border border-line bg-white px-3 py-2.5 font-mono text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      />
      {error ? (
        <p className="font-sans text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full border border-accent bg-transparent px-4 py-3 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-ink transition-opacity hover:opacity-70 disabled:opacity-50"
      >
        {pending ? "Loading…" : "Open invoice"}
      </button>
      <p className="font-sans text-2xs leading-relaxed text-ink/80">
        Guest checkout or wrong account? Use{" "}
        <Link href="/order-invoice" className="font-medium underline underline-offset-2">
          Order invoice
        </Link>{" "}
        with your email and order ID.
      </p>
    </form>
  );
}
