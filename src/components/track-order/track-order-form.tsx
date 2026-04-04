"use client";

import { HelpCircle } from "lucide-react";
import { type FormEvent, useId, useState } from "react";

type Errors = Partial<{ orderId: string; email: string }>;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(orderId: string, email: string): Errors {
  const errors: Errors = {};
  if (!orderId.trim()) errors.orderId = "Enter your order ID.";
  if (!email.trim()) errors.email = "Enter the email used for your order.";
  else if (!emailRe.test(email.trim())) errors.email = "Enter a valid email.";
  return errors;
}

export function TrackOrderForm() {
  const orderIdField = useId();
  const emailField = useId();
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = validate(orderId, email);
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSent(true);
  }

  if (sent) {
    return (
      <p className="font-sans text-sm leading-relaxed text-ink" role="status">
        Tracking will connect to your orders database once Supabase is set up.
        For now, contact us with your order ID if you need help.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-6" noValidate>
      <h3 className="font-sans text-lg font-semibold text-ink sm:text-xl">
        Track Orders
      </h3>

      <div className="grid gap-2 sm:grid-cols-[minmax(0,10rem)_1fr] sm:items-center sm:gap-6">
        <div className="flex items-center gap-1.5 font-sans text-sm text-ink sm:text-base">
          <span>Order ID</span>
          <span
            className="inline-flex text-orange-600"
            title="You can find your order ID in your confirmation email or receipt."
          >
            <HelpCircle className="h-4 w-4" strokeWidth={2} aria-hidden />
            <span className="sr-only">Help: order ID location</span>
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
            className="w-full border border-line bg-white px-3 py-2.5 font-sans text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 sm:text-base"
            aria-invalid={errors.orderId ? true : undefined}
            aria-describedby={errors.orderId ? `${orderIdField}-err` : undefined}
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
          className="min-w-[9rem] bg-orange-600 px-6 py-3 font-sans text-sm font-semibold text-white transition-colors hover:bg-orange-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        >
          Track Order
        </button>
      </div>
    </form>
  );
}
