import { FadeIn } from "@/components/motion/fade-in";
import { ProductCard } from "@/components/product/product-card";
import { ButtonLink } from "@/components/ui/button-link";
import type { Product } from "@/lib/types/commerce";

type FeaturedProductsProps = {
  products: Product[];
};

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="w-full border-b border-line bg-white py-12 sm:py-16 lg:py-20">
      <div className="min-w-0 w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-4 xl:gap-5">
          {products.map((p, i) => (
            <FadeIn
              key={p.id}
              delay={i * 0.05}
              className={[
                "min-w-0",
                // 2 rows max at each breakpoint:
                // - base: 2 cols → 4 items
                // - md: 3 cols → 6 items
                // - lg: 4 cols → 8 items
                i >= 8 ? "hidden" : "",
                i >= 6 ? "hidden lg:block" : "",
                i >= 4 ? "hidden md:block" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <ProductCard product={p} priority={i < 2} />
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mt-10 flex justify-center">
          <ButtonLink href="/shop" variant="secondary">
            Discover more
          </ButtonLink>
        </FadeIn>
      </div>
    </section>
  );
}
