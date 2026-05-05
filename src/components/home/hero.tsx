import { HeroTagline } from "@/components/home/hero-tagline";
import { HeroBackgroundMedia } from "@/components/home/hero-background-media";
import { ButtonLink } from "@/components/ui/button-link";

const heroBackgroundImageSrc =
  "https://res.cloudinary.com/dyfnobo9r/image/upload/v1777986955/beauty_hero_section_ptnrgr.jpg";

export function Hero() {
  return (
    <>
      <section
        className="relative isolate min-h-[100svh] w-full overflow-hidden bg-ink supports-[min-height:1dvh]:min-h-[100dvh] md:min-h-[88vh] md:supports-[min-height:1dvh]:min-h-[88dvh]"
        aria-label="Hero"
      >
        <div className="absolute inset-0 z-0">
          <div className="h-full w-full overflow-hidden">
            <HeroBackgroundMedia imageSrc={heroBackgroundImageSrc} />
          </div>
        </div>

        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/55 via-black/25 to-black/60" />

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-content flex-col items-center justify-center px-6 text-center supports-[min-height:1dvh]:min-h-[100dvh] md:min-h-[88vh] md:supports-[min-height:1dvh]:min-h-[88dvh]">
          <div className="max-w-[min(92vw,44rem)]">
            <p className="font-sans text-3xl font-medium leading-tight tracking-[-0.02em] text-white sm:text-4xl md:text-5xl">
              <strong className="font-semibold">Glochammy Beauty</strong>{" "}
              <span className="text-white/90">—</span>{" "}
              <strong className="font-semibold">Skincare Solutions</strong>{" "}
              <span className="text-white/90">that fit your needs</span>
            </p>
            <p className="mt-4 text-base font-normal leading-relaxed text-white/85 sm:text-lg">
              Shop quality beauty essentials and book salon services in Kilifi.
            </p>
          </div>
        </div>

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
