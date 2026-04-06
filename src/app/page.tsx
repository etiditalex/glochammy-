import { FeaturedProducts } from "@/components/home/featured-products";
import { Hero } from "@/components/home/hero";
import { Newsletter } from "@/components/home/newsletter";
import { SalonPreview } from "@/components/home/salon-preview";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { BRAND } from "@/lib/constants";
import { getFeaturedProducts } from "@/lib/products/catalog";
import { salonServices } from "@/lib/data/services";
import { testimonials } from "@/lib/data/testimonials";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: BRAND.tagline,
};

export const revalidate = 60;

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <>
      <Hero />
      <FeaturedProducts products={featured} />
      <SalonPreview services={salonServices} />
      <TestimonialsSection items={testimonials} />
      <Newsletter />
    </>
  );
}
