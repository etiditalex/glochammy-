import { FadeIn } from "@/components/motion/fade-in";
import { ShopFilters } from "@/components/shop/shop-filters";
import { getProductCategories } from "@/lib/products/categories";
import { getShopProducts } from "@/lib/products/catalog";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shop",
  description: "Skincare, hair, body, and fragrance—an intentional edit.",
};

function parseCategory(
  raw: string | string[] | undefined,
  validSlugs: string[],
): string {
  const s = Array.isArray(raw) ? raw[0] : raw;
  if (s && validSlugs.includes(s)) return s;
  return "all";
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string | string[]; featured?: string | string[] };
}) {
  const [products, categoryRows] = await Promise.all([
    getShopProducts(),
    getProductCategories(),
  ]);
  const validSlugs = categoryRows.map((c) => c.slug);
  const initialCategory = parseCategory(searchParams.category, validSlugs);
  const featuredRaw = searchParams.featured;
  const featuredStr = Array.isArray(featuredRaw) ? featuredRaw[0] : featuredRaw;
  const initialFeaturedOnly =
    featuredStr === "1" || featuredStr === "true";

  return (
    <div className="bg-white">
      <section className="bg-white">
        <div className="mx-auto flex min-w-0 max-w-content flex-col items-center justify-center px-4 py-20 text-center sm:px-8 sm:py-24 lg:py-32">
          <FadeIn className="flex w-full flex-col items-center">
            <p className="text-2xs font-medium uppercase tracking-nav text-muted">
              Shop
            </p>
            <h1 className="mt-4 font-display text-4xl font-medium leading-tight text-ink sm:mt-5 sm:text-5xl">
              The shelf
            </h1>
            <p className="mt-6 max-w-2xl text-base font-normal leading-relaxed text-ink/80 sm:mt-7 sm:text-[1.0625rem] sm:leading-[1.65]">
              Filters stay simple—pick a category and a comfortable price
              ceiling. Every product page includes texture notes and how we use
              it in-studio.
            </p>
          </FadeIn>
        </div>
      </section>
      <ShopFilters
        products={products}
        categoryOptions={categoryRows}
        initialCategory={initialCategory}
        initialFeaturedOnly={initialFeaturedOnly}
      />
    </div>
  );
}
