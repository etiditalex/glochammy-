import { FadeIn } from "@/components/motion/fade-in";

export function HeroTagline() {
  return (
    <section className="border-b border-line bg-white py-20 sm:py-24 lg:py-32">
      <div className="mx-auto min-w-0 max-w-content px-6 sm:px-8">
        <FadeIn>
          <p className="mx-auto max-w-[min(92vw,36rem)] text-center font-sans text-base font-normal leading-snug tracking-[-0.02em] text-[#333333] sm:text-xl sm:leading-normal md:text-2xl md:leading-relaxed lg:text-[1.65rem] lg:leading-[1.45]">
            <span className="block">Glochammy Beauty Skincare Solutions</span>
            <span className="block">to fit your needs</span>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
