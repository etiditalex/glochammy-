import { HeroTagline } from "@/components/home/hero-tagline";
import { HeroImageCarousel } from "@/components/home/hero-image-carousel";
import { ButtonLink } from "@/components/ui/button-link";

const heroSlides = [
  {
    src: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1778505444/hero_sect_xr2zl2.jpg",
    alt: "Glochammy Beauty Products — promotional banner",
  },
  {
    src: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1778506325/scroll_tl7e15.jpg",
    alt: "Glochammy Beauty Products — freshness and confidence banner",
  },
  {
    src: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1778506805/scrollor_cnhzsh.jpg",
    alt: "Glochammy Beauty Products — premium care and beauty banner",
  },
] as const;

export function Hero() {
  return (
    <>
      <section
        className="relative isolate min-h-[100svh] w-full overflow-hidden bg-ink supports-[min-height:1dvh]:min-h-[100dvh] md:min-h-[88vh] md:supports-[min-height:1dvh]:min-h-[88dvh]"
        aria-label="Hero"
      >
        <HeroImageCarousel slides={[...heroSlides]} />

        {/* Light bottom fade only so the CTA stays readable; top stays clear for the banner logo. */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/35 via-black/10 to-transparent"
          aria-hidden={true}
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-6 pb-10 pt-8 sm:pb-12 sm:pt-10">
          <div className="pointer-events-auto">
            <ButtonLink
              href="/shop"
              variant="secondary"
              className="border-white bg-white/10 text-white backdrop-blur-[2px] hover:border-white hover:bg-white hover:text-ink"
            >
              Discover
            </ButtonLink>
          </div>
        </div>
      </section>

      <HeroTagline />
    </>
  );
}
