import { CopyOrderIdButton } from "@/components/cart/copy-order-id-button";
import { ButtonLink } from "@/components/ui/button-link";
import { BRAND } from "@/lib/constants";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

type Props = {
  orderId: string;
  kind: "mpesa" | "later";
};

export function OrderThankYou({ orderId, kind }: Props) {
  const statusLine =
    kind === "mpesa"
      ? "Your payment was confirmed and your order is in our system."
      : "Your order is in our system.";

  return (
    <div
      className="border border-line bg-white p-8 text-center sm:p-12"
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-lg flex-col items-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-line bg-subtle text-ink">
          <CheckCircle2 className="h-8 w-8" strokeWidth={1.25} aria-hidden />
        </span>
        <p className="mt-6 font-display text-xl text-ink sm:text-2xl">
          Your order is confirmed
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          {statusLine} We appreciate you shopping with {BRAND.shortName}. You&apos;ll hear from us by
          email about confirmation and delivery updates.
        </p>
        <p className="mt-5 text-sm text-muted">
          Save your order ID below—you&apos;ll need it with the email you used at checkout on{" "}
          <Link href="/track-order" className="font-medium text-ink underline underline-offset-2">
            Track order
          </Link>{" "}
          if a confirmation email doesn&apos;t arrive.
        </p>
        <div className="mt-4 w-full max-w-xl text-left">
          <p className="text-2xs font-semibold uppercase tracking-nav text-muted">
            Order ID (for tracking)
          </p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-stretch">
            <code className="min-w-0 flex-1 break-all rounded border border-line bg-subtle px-3 py-2.5 font-mono text-xs leading-relaxed text-ink">
              {orderId}
            </code>
            <CopyOrderIdButton orderId={orderId} />
          </div>
        </div>
        <p className="mt-6 text-2xs leading-relaxed text-muted">
          When your products arrive, open each item in the shop to leave a star rating and a short
          review—we read every one.
        </p>
        <div className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
          <ButtonLink href="/shop" variant="primary" className="sm:min-w-[11rem]">
            Continue shopping
          </ButtonLink>
          <ButtonLink href="/track-order" variant="secondary" className="sm:min-w-[11rem]">
            Track your order
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
