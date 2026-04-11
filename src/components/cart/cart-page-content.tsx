"use client";

import { CartView } from "@/components/cart/cart-view";
import type { OrderCompleteInfo } from "@/components/cart/cart-checkout";
import { FadeIn } from "@/components/motion/fade-in";
import type { Product } from "@/lib/types/commerce";
import { useState } from "react";

type Props = {
  catalog: Product[];
  checkoutSession: { email: string; name: string } | null;
  mpesaConfigured: boolean;
  mpesaAutoComplete: boolean;
};

export function CartPageContent({
  catalog,
  checkoutSession,
  mpesaConfigured,
  mpesaAutoComplete,
}: Props) {
  const [orderComplete, setOrderComplete] = useState<OrderCompleteInfo | null>(null);

  return (
    <>
      <section className="border-b border-line bg-cream">
        <div className="mx-auto min-w-0 max-w-content px-4 py-14 sm:px-8 sm:py-16">
          <FadeIn>
            <p className="text-2xs font-medium uppercase tracking-nav text-muted">
              {orderComplete ? "Order confirmed" : "Cart"}
            </p>
            <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
              {orderComplete ? "Thank you" : "Your bag"}
            </h1>
            {orderComplete ? (
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
                Your order is placed—we&apos;ll email you with updates.
              </p>
            ) : (
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
                Review items and checkout when you&apos;re ready.
              </p>
            )}
          </FadeIn>
        </div>
      </section>
      <div className="mx-auto min-w-0 max-w-content px-4 py-12 sm:px-8 sm:py-16">
        <CartView
          catalog={catalog}
          checkoutSession={checkoutSession}
          mpesaConfigured={mpesaConfigured}
          mpesaAutoComplete={mpesaAutoComplete}
          orderComplete={orderComplete}
          onOrderComplete={setOrderComplete}
        />
      </div>
    </>
  );
}
