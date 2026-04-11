import { FadeIn } from "@/components/motion/fade-in";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/lib/types/commerce";

type FeaturedProductsProps = {
  products: Product[];
};

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="w-full border-b border-line bg-white py-12 sm:py-16 lg:py-20">
      <div className="min-w-0 w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-5 lg:gap-4 xl:gap-5">
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
