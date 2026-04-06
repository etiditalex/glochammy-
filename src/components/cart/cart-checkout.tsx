"use client";

import { createOrderAction } from "@/app/actions/checkout";
import {
  createMpesaCheckoutAction,
  pollOrderPaymentStatusAction,
} from "@/app/actions/checkout-mpesa";
import { useCart } from "@/context/cart-context";
import { isBrowserSupabaseConfigured } from "@/lib/supabase/env";
import { ButtonPush } from "@/components/ui/button-push";
import type { Product } from "@/lib/types/commerce";
import { useEffect, useState } from "react";

type Props = {
  catalog: Product[];
  checkoutSession?: { email: string; name: string } | null;
  currency: string;
  mpesaConfigured: boolean;
  mpesaAutoComplete: boolean;
};

export function CartCheckout({
  catalog,
  checkoutSession,
  currency,
  mpesaConfigured,
  mpesaAutoComplete,
}: Props) {
  const { lines, clear } = useCart();
  const [email, setEmail] = useState(checkoutSession?.email ?? "");
  const [name, setName] = useState(checkoutSession?.name ?? "");
  const [phone, setPhone] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneId, setDoneId] = useState<string | null>(null);
  const [successKind, setSuccessKind] = useState<"mpesa" | "later" | null>(null);
  const [mpesaPhase, setMpesaPhase] = useState<"idle" | "waiting" | "timed_out">("idle");
  const [mpesaHint, setMpesaHint] = useState<string | null>(null);
  const [pollOrderId, setPollOrderId] = useState<string | null>(null);
  const [pollNonce, setPollNonce] = useState<string | null>(null);

  const configured = isBrowserSupabaseConfigured();
  const showMpesa = mpesaConfigured && currency === "KES";

  useEffect(() => {
    if (mpesaPhase !== "waiting" || !pollOrderId || !pollNonce) return;
    let cancelled = false;
    let paid = false;

    const tick = async () => {
      const pr = await pollOrderPaymentStatusAction({
        orderId: pollOrderId,
        nonce: pollNonce,
      });
      if (cancelled || paid) return;
      if (!pr.ok) return;
      if (pr.paid) {
        paid = true;
        setMpesaPhase("idle");
        setPollOrderId(null);
        setPollNonce(null);
        setSuccessKind("mpesa");
        setDoneId(pollOrderId);
        setMpesaHint(null);
        clear();
      }
    };

    void tick();
    const interval = setInterval(() => void tick(), 2500);
    const timeout = setTimeout(() => {
      if (cancelled || paid) return;
      setMpesaPhase("timed_out");
    }, 90_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [mpesaPhase, pollOrderId, pollNonce, clear]);

  async function submitPayLater() {
    setError(null);
    if (!configured) {
      setError("Connect Supabase in your environment to place orders.");
      return;
    }
    if (!email.trim() || !name.trim()) {
      setError("Enter your name and email to place the order.");
      return;
    }

    const catalogIds = new Set(catalog.map((p) => p.id));
    const linesToSend = lines.filter((l) => l.quantity > 0 && catalogIds.has(l.productId));
    if (!linesToSend.length) {
      setError(
        "Your bag only contains items that are not in the live catalog. Remove them and add products from the shop.",
      );
      return;
    }

    setPending(true);
    const result = await createOrderAction({
      lines: linesToSend.map((l) => ({
        productId: l.productId,
        quantity: l.quantity,
      })),
      customerEmail: email.trim(),
      customerName: name.trim(),
      phone: phone.trim() || undefined,
    });
    setPending(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSuccessKind("later");
    setDoneId(result.orderId);
    clear();
  }

  async function submitMpesa() {
    setError(null);
    if (!configured) {
      setError("Connect Supabase in your environment to place orders.");
      return;
    }
    if (!email.trim() || !name.trim()) {
      setError("Enter your name and email.");
      return;
    }
    if (!phone.trim()) {
      setError("Enter the Safaricom number you will use for M-Pesa (e.g. 07XXXXXXXX).");
      return;
    }

    const catalogIds = new Set(catalog.map((p) => p.id));
    const linesToSend = lines.filter((l) => l.quantity > 0 && catalogIds.has(l.productId));
    if (!linesToSend.length) {
      setError(
        "Your bag only contains items that are not in the live catalog. Remove them and add products from the shop.",
      );
      return;
    }

    setPending(true);
    const result = await createMpesaCheckoutAction({
      lines: linesToSend.map((l) => ({
        productId: l.productId,
        quantity: l.quantity,
      })),
      customerEmail: email.trim(),
      customerName: name.trim(),
      phone: phone.trim(),
    });
    setPending(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    clear();
    setMpesaHint(result.customerMessage);
    setPollOrderId(result.orderId);
    setPollNonce(result.nonce);
    setMpesaPhase("waiting");
  }

  if (doneId) {
    const headline =
      successKind === "mpesa" ? "Payment confirmed" : "Order placed";
    return (
      <div className="rounded-none border border-line bg-cream p-4" role="status">
        <p className="text-sm font-medium text-ink">{headline}</p>
        <p className="mt-2 text-sm text-muted">
          Thank you. Your order reference starts with{" "}
          <span className="font-mono text-ink">{doneId.slice(0, 8)}</span>. We will follow up by
          email.
        </p>
        <p className="mt-3 text-2xs leading-relaxed text-muted">
          After you try your products, open them in the shop to leave a star rating and a short review.
        </p>
      </div>
    );
  }

  if (mpesaPhase === "waiting" || mpesaPhase === "timed_out") {
    const oid = pollOrderId ?? "";
    return (
      <div className="space-y-4" role="status">
        <p className="text-sm font-medium text-ink">Complete payment on your phone</p>
        <p className="text-sm text-muted">{mpesaHint}</p>
        <p className="text-2xs text-muted">
          Order reference: <span className="font-mono text-ink">{oid.slice(0, 8)}</span>… — your
          order is already in our system and will show as paid when M-Pesa confirms.
        </p>
        {mpesaPhase === "waiting" ? (
          <p className="text-2xs text-muted">
            Waiting for M-Pesa confirmation…{" "}
            {!mpesaAutoComplete
              ? "Without the service role key, this screen may not flip to success even if you paid—check Admin for the order."
              : null}
          </p>
        ) : (
          <p className="text-2xs text-muted">
            This is taking longer than usual. If you already entered your PIN, payment can still
            complete in the background. Keep this page open or check your email; the admin dashboard
            will update when Safaricom confirms
            {mpesaAutoComplete ? "" : " (after you add SUPABASE_SERVICE_ROLE_KEY for auto-updates)"}.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium uppercase tracking-nav text-muted">Checkout</h3>
      <p className="text-2xs leading-relaxed text-muted">
        {showMpesa
          ? "Pay with M-Pesa using Safaricom (Daraja). Your order is saved as soon as you start payment; the team sees it in Admin → Orders."
          : "Enter your details below. We will email you about your order and any updates."}{" "}
        Product ratings and reviews are on each item&apos;s page in the shop—not on this screen.
      </p>
      {showMpesa && !mpesaAutoComplete ? (
        <p className="rounded border border-amber-200/80 bg-amber-50/90 p-2 text-2xs leading-relaxed text-amber-950">
          Trial / dev: STK push is enabled. Add{" "}
          <span className="font-mono text-[10px]">SUPABASE_SERVICE_ROLE_KEY</span> on the server
          so the payment callback can set orders to <span className="font-medium">paid</span>{" "}
          automatically. Without it, new orders stay <span className="font-medium">pending</span>{" "}
          until you update them in Admin.
        </p>
      ) : null}

      <div>
        <label htmlFor="co-name" className="text-2xs uppercase tracking-nav text-muted">
          Full name
        </label>
        <input
          id="co-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          className="mt-1 w-full border border-line bg-white px-3 py-2 text-sm text-ink"
        />
      </div>
      <div>
        <label htmlFor="co-email" className="text-2xs uppercase tracking-nav text-muted">
          Email
        </label>
        <input
          id="co-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="mt-1 w-full border border-line bg-white px-3 py-2 text-sm text-ink"
        />
      </div>
      <div>
        <label htmlFor="co-phone" className="text-2xs uppercase tracking-nav text-muted">
          {showMpesa ? "M-Pesa phone (Safaricom)" : "Phone (optional)"}
        </label>
        <input
          id="co-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
          placeholder={showMpesa ? "e.g. 07XXXXXXXX or 2547…" : undefined}
          className="mt-1 w-full border border-line bg-white px-3 py-2 text-sm text-ink"
        />
      </div>

      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      {showMpesa ? (
        <div className="space-y-2">
          <ButtonPush
            type="button"
            className="w-full"
            disabled={pending || lines.length === 0}
            onClick={() => void submitMpesa()}
          >
            {pending ? "Starting M-Pesa…" : "Pay with M-Pesa"}
          </ButtonPush>
          <ButtonPush
            type="button"
            variant="secondary"
            className="w-full"
            disabled={pending || lines.length === 0}
            onClick={() => void submitPayLater()}
          >
            Place order (pay later / other method)
          </ButtonPush>
        </div>
      ) : (
        <ButtonPush
          type="button"
          className="w-full"
          disabled={pending || lines.length === 0}
          onClick={() => void submitPayLater()}
        >
          {pending ? "Placing order…" : "Place order"}
        </ButtonPush>
      )}
    </div>
  );
}
