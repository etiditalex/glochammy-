import { Hero } from "@/components/home/hero";
import { HomeProductRail } from "@/components/home/home-product-rail";
import { ProductSpotlightBanner } from "@/components/home/product-spotlight-banner";
import { SalonPreview } from "@/components/home/salon-preview";
import { BRAND } from "@/lib/constants";
import { getShopProducts } from "@/lib/products/catalog";
import { getProductCategories } from "@/lib/products/categories";
import { salonServices } from "@/lib/data/services";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

/** Client form — split so its JS isn't in the critical hero path. */
const Newsletter = dynamic(
  () => import("@/components/home/newsletter").then((m) => m.Newsletter),
  {
    loading: () => (
      <div className="h-36 animate-pulse bg-subtle" aria-hidden />
    ),
  },
);

export const metadata: Metadata = {
  title: "Home",
  description: BRAND.tagline,
};

export const revalidate = 60;

export default async function HomePage() {
  const [shopProducts, categories] = await Promise.all([
    getShopProducts(),
    getProductCategories(),
  ]);
  const featured = shopProducts.filter((p) => p.featured).slice(0, 12);
  const topSelling = featured.length ? featured : shopProducts.slice(0, 12);
  const knownSlugs = new Set(categories.map((category) => category.slug));
  const categoryRails = categories
    .map((category) => ({
      ...category,
      products: shopProducts.filter((product) => product.category === category.slug),
    }))
    .filter((category) => category.products.length > 0);
  const otherProducts = shopProducts.filter(
    (product) => !knownSlugs.has(product.category),
  );

  return (
    <div className="bg-cream">
      <Hero categories={categories} />
      <HomeProductRail
        id="top-selling-heading"
        title="Top selling items"
        href="/shop"
        products={topSelling}
        priority
      />
      {categoryRails.map((category) => (
        <HomeProductRail
          key={category.slug}
          id={`home-${category.slug}`}
          title={
            category.slug === "hair" ? "Best Deals in Hair & Wigs" : category.name
          }
          href={`/shop?category=${encodeURIComponent(category.slug)}`}
          products={category.products}
        />
      ))}
      {otherProducts.length > 0 ? (
        <HomeProductRail
          id="home-more-products"
          title="More products"
          href="/shop"
          products={otherProducts}
        />
      ) : null}
      <SalonPreview services={salonServices} />
      <section className="w-full bg-cream px-2 py-2" aria-label="Featured promotion">
        <div className="mx-auto max-w-[1248px] md:px-3">
          <ProductSpotlightBanner />
        </div>
      </section>
      <Newsletter />
    </div>
  );
}
