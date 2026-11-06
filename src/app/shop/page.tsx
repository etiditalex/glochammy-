import { ShopFilters } from "@/components/shop/shop-filters";
import { getProductCategories } from "@/lib/products/categories";
import { getShopProducts } from "@/lib/products/catalog";
import type { Metadata } from "next";
import { Suspense } from "react";
import ShopLoading from "./loading";

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
  const initialFeaturedOnly = featuredStr === "1" || featuredStr === "true";

  return (
    <div className="bg-white">
      <Suspense fallback={<ShopLoading />}>
        <ShopFilters
          products={products}
          categoryOptions={categoryRows}
          initialCategory={initialCategory}
          initialFeaturedOnly={initialFeaturedOnly}
        />
      </Suspense>
    </div>
  );
}
