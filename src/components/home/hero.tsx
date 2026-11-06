import { HeroBannerSlider } from "@/components/home/hero-banner-slider";

const BANNER_SLIDES = [
  {
    src: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1793992598/WhatsApp_Image_2026-11-06_at_22.14.39_qjbcor.jpg",
    alt: "Glochammy Beauty campaign portrait in a yellow dress",
    headline: "Beauty that empowers you",
    cta: "Shop now",
    href: "/shop",
  },
  {
    src: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1793992598/WhatsApp_Image_2026-11-06_at_22.15.14_ueyxff.jpg",
    alt: "Glochammy Beauty campaign portrait with gold jewellery",
    headline: "Freshness and confidence",
    cta: "Shop hair",
    href: "/shop?category=hair",
  },
  {
    src: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1793992598/WhatsApp_Image_2026-11-06_at_22.15.46_gcpbqs.jpg",
    alt: "Glochammy Beauty campaign portrait with a light therapy device",
    headline: "Premium care. Everyday confidence.",
    cta: "Book a treatment",
    href: "/booking",
  },
] as const;

export function Hero() {
  return (
    <section className="w-full bg-line" aria-label="Shop homepage">
      <HeroBannerSlider slides={[...BANNER_SLIDES]} />
    </section>
  );
}
