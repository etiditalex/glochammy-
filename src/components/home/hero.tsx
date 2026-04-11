import { HeroTagline } from "@/components/home/hero-tagline";
import { HeroBackgroundMedia } from "@/components/home/hero-background-media";
import { ButtonLink } from "@/components/ui/button-link";
import { BRAND } from "@/lib/constants";

const id = BRAND.heroYoutubeVideoId;

const heroBackgroundEmbedSrc =
  `https://www.youtube.com/embed/${id}` +
  `?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&playsinline=1&rel=0` +
  `&playlist=${id}`;

export function Hero() {
  return (
    <>
      <section
        className="relative isolate min-h-[100svh] w-full overflow-hidden bg-ink supports-[min-height:1dvh]:min-h-[100dvh] md:min-h-[88vh] md:supports-[min-height:1dvh]:min-h-[88dvh]"
        aria-label="Video"
      >
        <div className="absolute inset-0 z-0">
          <div className="h-full w-full overflow-hidden">
            <HeroBackgroundMedia videoSrc={heroBackgroundEmbedSrc} />
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
