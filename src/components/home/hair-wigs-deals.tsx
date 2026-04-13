import { FadeIn } from "@/components/motion/fade-in";
import { ProductCard } from "@/components/product/product-card";
import { ButtonLink } from "@/components/ui/button-link";
import type { Product } from "@/lib/types/commerce";

type HairWigsDealsProps = {
  products: Product[];
};

export function HairWigsDeals({ products }: HairWigsDealsProps) {
  if (!products.length) return null;

  return (
    <section className="border-b border-line bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto min-w-0 max-w-content px-4 sm:px-8">
        <FadeIn>
          <div className="max-w-2xl text-left">
            <p className="text-2xs font-medium uppercase tracking-nav text-accent">
              Curated offers
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              Best Deals in Hair &amp; Wigs
            </h2>
          </div>
        </FadeIn>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product, i) => (
            <FadeIn key={product.id} delay={i * 0.05}>
              <ProductCard product={product} priority={i < 2} />
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mt-10 flex justify-center">
          <ButtonLink href="/shop" variant="secondary">
            Shop all hair products
          </ButtonLink>
        </FadeIn>
      </div>
    </section>
  );
}
