import { OrderInvoiceLookupForm } from "@/components/order-invoice/order-invoice-lookup-form";
import { BRAND } from "@/lib/constants";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Order invoice",
  description: `View and print your ${BRAND.shortName} order invoice.`,
};

export default function OrderInvoicePage() {
  return (
    <div className="min-h-[70vh] w-full min-w-0 bg-[#fafaf8] pb-20 pt-12 sm:pb-24 sm:pt-16">
      <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 md:px-8">
        <p className="font-sans text-sm text-neutral-600">
          <Link
            href="/shop"
            className="text-ink underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
          >
            ← Shop
          </Link>
          <span className="mx-2 text-neutral-400">·</span>
          <Link
            href="/track-order"
            className="text-ink underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
          >
            Track order
          </Link>
        </p>

        <h1 className="mt-8 font-display text-3xl font-medium text-ink sm:text-4xl">
          Order invoice
        </h1>
        <p className="mt-4 font-sans text-sm leading-relaxed text-neutral-700 sm:text-base">
          Enter the full order ID and the email you used at checkout. You can then print or save the
          invoice from your browser.
        </p>

        <div className="mt-10 border border-line/60 bg-white px-6 py-8 sm:px-8 sm:py-10">
          <OrderInvoiceLookupForm />
        </div>
      </div>
    </div>
  );
}
