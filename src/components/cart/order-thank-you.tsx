import { ButtonLink } from "@/components/ui/button-link";
import { BRAND } from "@/lib/constants";
import { CheckCircle2 } from "lucide-react";

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
        <p className="mt-4 text-sm text-ink">
          Order reference:{" "}
          <span className="font-mono font-medium tabular-nums">{orderId.slice(0, 8)}</span>
          …
        </p>
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
