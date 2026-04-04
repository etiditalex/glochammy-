import { HeroTagline } from "@/components/home/hero-tagline";
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
        className="relative isolate min-h-[88vh] w-full overflow-hidden bg-ink supports-[min-height:1dvh]:min-h-[88dvh]"
        aria-label="Video"
      >
        <div className="absolute inset-0 z-0">
          <div className="h-full w-full overflow-hidden">
            <iframe
              src={heroBackgroundEmbedSrc}
              title="Background video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              tabIndex={-1}
              aria-hidden={true}
              className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 scale-[1.02] border-0"
              loading="eager"
            />
          </div>
        </div>
      </section>

      <HeroTagline />
    </>
  );
}
