"use client";

import { customerOrderInvoiceAction } from "@/app/actions/order-invoice";
import { OrderInvoiceDocument } from "@/components/invoice/order-invoice-document";
import { PrintInvoiceButton } from "@/components/invoice/print-invoice-button";
import Link from "next/link";
import { type FormEvent, useId, useState, useTransition } from "react";

type Errors = Partial<{ orderId: string; email: string }>;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(orderId: string, email: string): Errors {
  const errors: Errors = {};
  if (!orderId.trim()) errors.orderId = "Enter your order ID.";
  if (!email.trim()) errors.email = "Enter the email used for your order.";
  else if (!emailRe.test(email.trim())) errors.email = "Enter a valid email.";
  return errors;
}

export function OrderInvoiceLookupForm() {
  const orderIdField = useId();
  const emailField = useId();
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<Awaited<
    ReturnType<typeof customerOrderInvoiceAction>
  > | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLookupError(null);
    setInvoice(null);
    const next = validate(orderId, email);
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    startTransition(async () => {
      const res = await customerOrderInvoiceAction({
        orderId,
        email: email.trim(),
      });
      if (res.ok) {
        setInvoice(res);
      } else {
        setLookupError(res.error);
      }
    });
  }

  if (invoice?.ok) {
    return (
      <div className="mt-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button
            type="button"
            className="font-sans text-sm text-neutral-600 underline decoration-1 underline-offset-4"
            onClick={() => {
              setInvoice(null);
              setLookupError(null);
            }}
          >
            ← Look up another invoice
          </button>
          <PrintInvoiceButton />
        </div>
        <OrderInvoiceDocument data={invoice.invoice} variant="customer" />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
      <div>
        <label htmlFor={orderIdField} className="block font-sans text-xs font-medium text-neutral-600">
          Order ID (full UUID)
        </label>
        <input
          id={orderIdField}
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          autoComplete="off"
          placeholder="e.g. a1b2c3d4-e5f6-7890-abcd-ef1234567890"
          className="mt-2 w-full border border-line bg-white px-3 py-2.5 font-mono text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          aria-invalid={Boolean(errors.orderId)}
 />
        {errors.orderId ? (
          <p className="mt-1 font-sans text-sm text-red-700">{errors.orderId}</p>
        ) : null}
      </div>
      <div>
        <label htmlFor={emailField} className="block font-sans text-xs font-medium text-neutral-600">
          Email used at checkout
        </label>
        <input
          id={emailField}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="mt-2 w-full border border-line bg-white px-3 py-2.5 font-sans text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email ? (
          <p className="mt-1 font-sans text-sm text-red-700">{errors.email}</p>
        ) : null}
      </div>
      {lookupError ? (
        <p className="font-sans text-sm text-red-700" role="alert">
          {lookupError}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full border border-ink bg-ink px-6 py-3.5 font-sans text-sm font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Loading…" : "View invoice"}
      </button>
      <p className="font-sans text-2xs text-neutral-600">
        Signed in and the order is on your account? You can use{" "}
        <Link href="/account" className="underline underline-offset-2">
          My account
        </Link>{" "}
        to open an invoice with your order ID only.
      </p>
    </form>
  );
}
