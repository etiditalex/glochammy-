"use client";

import { createOrderAction } from "@/app/actions/checkout";
import {
  createMpesaCheckoutAction,
  pollOrderPaymentStatusAction,
} from "@/app/actions/checkout-mpesa";
import { CopyOrderIdButton } from "@/components/cart/copy-order-id-button";
import { useCart } from "@/context/cart-context";
import { isBrowserSupabaseConfigured } from "@/lib/supabase/env";
import { ButtonPush } from "@/components/ui/button-push";
import type { Product } from "@/lib/types/commerce";
import { useEffect, useState } from "react";

const MPESA_PENDING_STORAGE_KEY = "glochammy-mpesa-pending-v1";
const MPESA_PENDING_TTL_MS = 15 * 60 * 1000;

type PendingMpesaCheckout = {
  orderId: string;
  nonce: string;
  customerMessage?: string;
  createdAtMs: number;
};

function readPendingMpesaCheckout(): PendingMpesaCheckout | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(MPESA_PENDING_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PendingMpesaCheckout> | null;
    if (!parsed?.orderId || !parsed?.nonce || !Number.isFinite(parsed.createdAtMs)) return null;
    const createdAtMs = Number(parsed.createdAtMs);
    if (Date.now() - createdAtMs > MPESA_PENDING_TTL_MS) {
      window.localStorage.removeItem(MPESA_PENDING_STORAGE_KEY);
      return null;
    }
    return {
      orderId: parsed.orderId,
      nonce: parsed.nonce,
      customerMessage: parsed.customerMessage,
      createdAtMs,
    };
  } catch {
    return null;
  }
}

function writePendingMpesaCheckout(pending: PendingMpesaCheckout): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MPESA_PENDING_STORAGE_KEY, JSON.stringify(pending));
  } catch {
    /* no-op */
  }
}

function clearPendingMpesaCheckout(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(MPESA_PENDING_STORAGE_KEY);
  } catch {
    /* no-op */
  }
}

export type OrderCompleteInfo = { orderId: string; kind: "mpesa" | "later" };

type Props = {
  catalog: Product[];
  checkoutSession?: { email: string; name: string } | null;
  currency: string;
  mpesaConfigured: boolean;
  mpesaAutoComplete: boolean;
  onPlacedOrderAction?: (info: OrderCompleteInfo) => void;
};

export function CartCheckout({
  catalog,
  checkoutSession,
  currency,
  mpesaConfigured,
  mpesaAutoComplete,
  onPlacedOrderAction,
}: Props) {
  const { lines, clear } = useCart();
  const [email, setEmail] = useState(checkoutSession?.email ?? "");
  const [name, setName] = useState(checkoutSession?.name ?? "");
  const [phone, setPhone] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mpesaPhase, setMpesaPhase] = useState<"idle" | "waiting" | "timed_out" | "failed">("idle");
  const [mpesaHint, setMpesaHint] = useState<string | null>(null);
  const [pollOrderId, setPollOrderId] = useState<string | null>(null);
  const [pollNonce, setPollNonce] = useState<string | null>(null);

  const configured = isBrowserSupabaseConfigured();
  const showMpesa = mpesaConfigured && currency === "KES";

  function resetPendingMpesaState() {
    clearPendingMpesaCheckout();
    setMpesaPhase("idle");
    setMpesaHint(null);
    setPollOrderId(null);
    setPollNonce(null);
  }

  useEffect(() => {
    const pendingCheckout = readPendingMpesaCheckout();
    if (!pendingCheckout) return;

    setMpesaHint(
      pendingCheckout.customerMessage ?? "Complete payment on your phone to finish the order.",
    );
    setPollOrderId(pendingCheckout.orderId);
    setPollNonce(pendingCheckout.nonce);
    setMpesaPhase("waiting");
  }, []);

  useEffect(() => {
    if ((mpesaPhase !== "waiting" && mpesaPhase !== "timed_out") || !pollOrderId || !pollNonce) return;
    let cancelled = false;
    let paid = false;

    const tick = async () => {
      const pr = await pollOrderPaymentStatusAction({
        orderId: pollOrderId,
        nonce: pollNonce,
      });
      if (cancelled || paid) return;
      if (!pr.ok) {
        setError(pr.error);
        return;
      }
      if (pr.paid) {
        paid = true;
        setMpesaPhase("idle");
        setPollOrderId(null);
        setPollNonce(null);
        setMpesaHint(null);
        clearPendingMpesaCheckout();
        onPlacedOrderAction?.({ orderId: pollOrderId, kind: "mpesa" });
        clear();
        return;
      }

      const resultCode = pr.resultCode ?? null;
      if (resultCode === 4999) {
        setMpesaPhase("timed_out");
        setError(null);
        setMpesaHint("Payment processing. Waiting for M-Pesa confirmation...");
        return;
      }

      if (pr.status === "cancelled" || resultCode === 1032) {
        setMpesaPhase("failed");
        setError("Payment canceled.");
        clearPendingMpesaCheckout();
        setMpesaHint(null);
        setPollOrderId(null);
        setPollNonce(null);
        return;
      }

      if (pr.status === "failed" || (resultCode ?? 0) !== 0) {
        setMpesaPhase("failed");
        setError("Payment canceled or failed. Please try again.");
        clearPendingMpesaCheckout();
        setMpesaHint(null);
        setPollOrderId(null);
        setPollNonce(null);
      }
    };

    void tick();
    const interval = setInterval(() => void tick(), mpesaPhase === "waiting" ? 2500 : 4000);
    const timeout =
      mpesaPhase === "waiting"
        ? setTimeout(() => {
            if (cancelled || paid) return;
            setMpesaPhase("timed_out");
          }, 90_000)
        : null;

    return () => {
      cancelled = true;
      clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [mpesaPhase, pollOrderId, pollNonce, clear, onPlacedOrderAction]);

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
    onPlacedOrderAction?.({ orderId: result.orderId, kind: "later" });
    clear();
  }

  async function submitMpesa() {
    setError(null);
    const existingPending = readPendingMpesaCheckout();
    if (existingPending) {
      setMpesaPhase("waiting");
      setPollOrderId(existingPending.orderId);
      setPollNonce(existingPending.nonce);
      setMpesaHint(
        existingPending.customerMessage ??
          "You already started M-Pesa payment for this order. Complete it on your phone.",
      );
      return;
    }
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

    writePendingMpesaCheckout({
      orderId: result.orderId,
      nonce: result.nonce,
      customerMessage: result.customerMessage,
      createdAtMs: Date.now(),
    });
    setMpesaHint(result.customerMessage);
    setPollOrderId(result.orderId);
    setPollNonce(result.nonce);
    setMpesaPhase("waiting");
  }

  if (mpesaPhase === "waiting" || mpesaPhase === "timed_out" || mpesaPhase === "failed") {
    const oid = pollOrderId ?? "";
    const txStatusLabel =
      mpesaPhase === "failed"
        ? "Canceled or failed"
        : mpesaPhase === "timed_out"
          ? "Payment processing"
          : "Awaiting approval";
    return (
      <div className="space-y-4" role="status">
        <p className="text-sm font-medium text-ink">
          {mpesaPhase === "failed"
            ? "Payment not completed"
            : mpesaPhase === "timed_out"
              ? "Payment processing"
              : "Complete payment on your phone"}
        </p>
        <p className="text-2xs uppercase tracking-nav text-muted">Transaction status: {txStatusLabel}</p>
        {mpesaPhase !== "failed" && mpesaHint ? <p className="text-sm text-muted">{mpesaHint}</p> : null}
        {mpesaPhase !== "failed" ? (
          <div className="rounded border border-line bg-subtle p-3 text-left">
            <p className="text-2xs font-semibold uppercase tracking-nav text-muted">
              Order ID (save for tracking)
            </p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-stretch">
              {oid ? (
                <>
                  <code className="min-w-0 flex-1 break-all font-mono text-[11px] leading-relaxed text-ink">
                    {oid}
                  </code>
                  <CopyOrderIdButton orderId={oid} />
                </>
              ) : (
                <span className="text-2xs text-muted">—</span>
              )}
            </div>
            <p className="mt-2 text-2xs text-muted">
              Your order is already in our system and will show as paid when M-Pesa confirms.
            </p>
          </div>
        ) : null}
        {mpesaPhase === "waiting" ? (
          <p className="text-2xs text-muted">
            Waiting for M-Pesa confirmation…{" "}
            {!mpesaAutoComplete
              ? "Without the service role key, this screen may not flip to success even if you paid—check Admin for the order."
              : null}
          </p>
        ) : mpesaPhase === "failed" ? (
          <div className="space-y-3">
            <p className="text-sm text-red-700" role="alert">
              {error ?? "M-Pesa payment was not completed. Confirm your phone number and try again."}
            </p>
            <ButtonPush type="button" variant="secondary" className="w-full" onClick={resetPendingMpesaState}>
              Try checkout again
            </ButtonPush>
          </div>
        ) : null}
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
            {pending ? "Starting M-Pesa…" : "Place order"}
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