"use client";

import { trackOrderLookupAction } from "@/app/actions/track-order";
import { BRAND } from "@/lib/constants";
import { formatMoney } from "@/lib/format";
import { HelpCircle } from "lucide-react";
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

function statusLabel(status: string): string {
  const s = status.replace(/_/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function TrackOrderForm() {
  const orderIdField = useId();
  const emailField = useId();
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [result, setResult] = useState<Awaited<
    ReturnType<typeof trackOrderLookupAction>
  > | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLookupError(null);
    setResult(null);
    const next = validate(orderId, email);
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    startTransition(async () => {
      const res = await trackOrderLookupAction({
        orderId,
        email: email.trim(),
      });
      if (res.ok) {
        setResult(res);
      } else {
        setLookupError(res.error);
      }
    });
  }

  if (result?.ok) {
    const { order } = result;
    return (
      <div className="mt-8 space-y-6" role="region" aria-label="Order details">
        <p className="font-sans text-sm text-neutral-600">
          <button
            type="button"
            className="text-ink underline decoration-1 underline-offset-4"
            onClick={() => {
              setResult(null);
              setLookupError(null);
            }}
          >
            ← Look up another order
          </button>
        </p>
        <div className="border border-line bg-neutral-50/80 px-4 py-5 sm:px-6">
          <p className="font-sans text-2xs font-medium uppercase tracking-nav text-neutral-600">
            Order
          </p>
          <p className="mt-1 font-mono text-sm text-ink">{order.id.slice(0, 8)}…</p>
          <p className="mt-4 font-sans text-sm text-neutral-700">
            <span className="font-medium text-ink">Status:</span> {statusLabel(order.status)}
          </p>
          <p className="mt-2 font-sans text-sm text-neutral-700">
            <span className="font-medium text-ink">Placed:</span>{" "}
            {new Date(order.created_at).toLocaleString()}
          </p>
          <p className="mt-2 font-sans text-sm text-neutral-700">
            <span className="font-medium text-ink">Total:</span>{" "}
            {formatMoney(order.total_cents, order.currency)}
          </p>
        </div>
        {order.items.length > 0 ? (
          <div className="overflow-x-auto border border-line">
            <table className="w-full min-w-[280px] text-left font-sans text-sm">
              <thead className="border-b border-line bg-neutral-100 text-2xs uppercase tracking-wide text-neutral-600">
                <tr>
                  <th className="px-3 py-2 font-medium">Item</th>
                  <th className="px-3 py-2 font-medium">Qty</th>
                  <th className="px-3 py-2 font-medium text-right">Line</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((line, i) => (
                  <tr key={i} className="border-b border-line/80 last:border-0">
                    <td className="px-3 py-2.5">{line.product_name}</td>
                    <td className="px-3 py-2.5 tabular-nums">{line.quantity}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">
                      {formatMoney(line.line_total_cents, order.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
        <p className="font-sans text-sm leading-relaxed text-neutral-700">
          Questions?{" "}
          <Link href="/contact" className="font-medium text-orange-600 underline underline-offset-2">
            Contact us
          </Link>{" "}
          or email{" "}
          <a href={`mailto:${BRAND.email}`} className="font-medium text-orange-600 underline underline-offset-2">
            {BRAND.email}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-6" noValidate>
      <h3 className="font-sans text-lg font-semibold text-ink sm:text-xl">
        Track Orders
      </h3>

      {lookupError ? (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2.5 font-sans text-sm text-red-900" role="alert">
          {lookupError}
        </p>
      ) : null}

      <div className="grid gap-2 sm:grid-cols-[minmax(0,10rem)_1fr] sm:items-center sm:gap-6">
        <div className="flex items-center gap-1.5 font-sans text-sm text-ink sm:text-base">
          <span>Order ID</span>
          <span
            className="inline-flex text-orange-600"
            title="Paste the full order ID (UUID) from your confirmation email or receipt."
          >
            <HelpCircle className="h-4 w-4" strokeWidth={2} aria-hidden />
            <span className="sr-only">Help: full UUID required</span>
          </span>
        </div>
        <div>
          <input
            id={orderIdField}
            name="orderId"
            autoComplete="off"
            value={orderId}
            onChange={(e) => {
              setOrderId(e.target.value);
              setErrors((x) => ({ ...x, orderId: undefined }));
            }}
            placeholder="e.g. a1b2c3d4-e5f6-7890-abcd-ef1234567890"
            className="w-full border border-line bg-white px-3 py-2.5 font-mono text-sm text-ink placeholder:text-neutral-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 sm:text-base"
            aria-invalid={errors.orderId ? true : undefined}
            aria-describedby={errors.orderId ? `${orderIdField}-err` : undefined}
            disabled={pending}
          />
          {errors.orderId ? (
            <p id={`${orderIdField}-err`} className="mt-1 text-sm text-red-700">
              {errors.orderId}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-1.5 font-sans text-sm text-ink sm:text-base">
          <span>Email</span>
          <span
            className="inline-flex text-orange-600"
            title="Use the same email address you entered when you placed the order."
          >
            <HelpCircle className="h-4 w-4" strokeWidth={2} aria-hidden />
            <span className="sr-only">Help: email</span>
          </span>
        </div>
        <div>
          <input
            id={emailField}
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((x) => ({ ...x, email: undefined }));
            }}
            className="w-full border border-line bg-white px-3 py-2.5 font-sans text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 sm:text-base"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? `${emailField}-err` : undefined}
            disabled={pending}
          />
          {errors.email ? (
            <p id={`${emailField}-err`} className="mt-1 text-sm text-red-700">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex justify-end sm:pl-[calc(10rem+1.5rem)]">
        <button
          type="submit"
          disabled={pending}
          className="min-w-[9rem] bg-orange-600 px-6 py-3 font-sans text-sm font-semibold text-white transition-colors hover:bg-orange-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:opacity-60"
        >
          {pending ? "Looking up…" : "Track Order"}
        </button>
      </div>
    </form>
  );
}
