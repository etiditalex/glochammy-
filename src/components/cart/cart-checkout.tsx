"use client";

import { createOrderAction } from "@/app/actions/checkout";
import { useCart } from "@/context/cart-context";
import { isBrowserSupabaseConfigured } from "@/lib/supabase/env";
import { ButtonPush } from "@/components/ui/button-push";
import type { Product } from "@/lib/types/commerce";
import { useState } from "react";

type Props = {
  catalog: Product[];
  /** Prefill when the shopper is signed in */
  checkoutSession?: { email: string; name: string } | null;
};

export function CartCheckout({ catalog, checkoutSession }: Props) {
  const { lines, clear } = useCart();
  const [email, setEmail] = useState(checkoutSession?.email ?? "");
  const [name, setName] = useState(checkoutSession?.name ?? "");
  const [phone, setPhone] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneId, setDoneId] = useState<string | null>(null);

  const configured = isBrowserSupabaseConfigured();

  async function submit() {
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
      setError("Your bag only contains items that are not in the live catalog. Remove them and add products from the shop.");
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
    setDoneId(result.orderId);
    clear();
  }

  if (doneId) {
    return (
      <div className="rounded-none border border-line bg-cream p-4" role="status">
        <p className="text-sm font-medium text-ink">Order placed</p>
        <p className="mt-2 text-sm text-muted">
          Thank you. Your order reference starts with{" "}
          <span className="font-mono text-ink">{doneId.slice(0, 8)}</span>. We will follow up by
          email.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium uppercase tracking-nav text-muted">Checkout</h3>
      <p className="text-2xs leading-relaxed text-muted">
        Enter your details below. We will email you about your order and any updates.
      </p>

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
          Phone (optional)
        </label>
        <input
          id="co-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
          className="mt-1 w-full border border-line bg-white px-3 py-2 text-sm text-ink"
        />
      </div>

      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <ButtonPush
        type="button"
        className="w-full"
        disabled={pending || lines.length === 0}
        onClick={() => void submit()}
      >
        {pending ? "Placing order…" : "Place order"}
      </ButtonPush>
    </div>
  );
}
