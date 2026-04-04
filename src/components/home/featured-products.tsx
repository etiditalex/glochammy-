import { FadeIn } from "@/components/motion/fade-in";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/lib/types/commerce";

type FeaturedProductsProps = {
  products: Product[];
};

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="w-full border-b border-line bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto min-w-0 w-full max-w-content px-4 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
          {products.map((p, i) => (
            <FadeIn key={p.id} delay={i * 0.05} className="min-w-0">
              <ProductCard product={p} priority={i < 2} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
