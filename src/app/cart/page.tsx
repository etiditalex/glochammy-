import { CartView } from "@/components/cart/cart-view";
import { FadeIn } from "@/components/motion/fade-in";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review items in your bag and adjust quantities.",
};

export default function CartPage() {
  return (
    <div className="bg-white">
      <section className="border-b border-line bg-cream">
        <div className="mx-auto min-w-0 max-w-content px-4 py-14 sm:px-8 sm:py-16">
          <FadeIn>
            <p className="text-2xs font-medium uppercase tracking-nav text-muted">
              Cart
            </p>
            <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
              Your bag
            </h1>
          </FadeIn>
        </div>
      </section>
      <div className="mx-auto min-w-0 max-w-content px-4 py-12 sm:px-8 sm:py-16">
        <CartView />
      </div>
    </div>
  );
}
