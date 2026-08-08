import { FadeIn } from "@/components/motion/fade-in";
import { ProductCarousel } from "@/components/home/product-carousel";
import { ButtonLink } from "@/components/ui/button-link";
import type { Product } from "@/lib/types/commerce";

type FeaturedProductsProps = {
  products: Product[];
};

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="w-full border-b border-line bg-white py-12 sm:py-16 lg:py-20">
      <div className="min-w-0 w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <FadeIn>
          <ProductCarousel products={products} />
        </FadeIn>

        <FadeIn className="mt-10 flex justify-center">
          <ButtonLink href="/shop" variant="secondary">
            Discover more
          </ButtonLink>
        </FadeIn>
      </div>
    </section>
  );
}
