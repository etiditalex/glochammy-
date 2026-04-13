import { FeaturedProducts } from "@/components/home/featured-products";
import { HairWigsDeals } from "@/components/home/hair-wigs-deals";
import { Hero } from "@/components/home/hero";
import { Newsletter } from "@/components/home/newsletter";
import { SalonPreview } from "@/components/home/salon-preview";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { BRAND } from "@/lib/constants";
import { getFeaturedProducts, getShopProducts } from "@/lib/products/catalog";
import { salonServices } from "@/lib/data/services";
import { testimonials } from "@/lib/data/testimonials";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: BRAND.tagline,
};

export const revalidate = 60;

export default async function HomePage() {
  const [featured, shopProducts] = await Promise.all([
    getFeaturedProducts(),
    getShopProducts(),
  ]);
  const hairDeals = shopProducts
    .filter((p) => {
      const category = p.category.toLowerCase();
      const name = p.name.toLowerCase();
      return category.includes("hair") || name.includes("wig");
    })
    .sort((a, b) => a.priceCents - b.priceCents)
    .slice(0, 8);

  return (
    <>
      <Hero />
      <FeaturedProducts products={featured} />
      <SalonPreview services={salonServices} />
      <HairWigsDeals products={hairDeals} />
      <TestimonialsSection items={testimonials} />
      <Newsletter />
    </>
  );
}
