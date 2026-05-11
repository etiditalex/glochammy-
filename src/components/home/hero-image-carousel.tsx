"use client";

import { useCallback, useEffect, useState } from "react";

export type HeroSlide = {
  src: string;
  alt: string;
};

type HeroImageCarouselProps = {
  slides: HeroSlide[];
  /** Autoplay interval when motion is allowed. */
  intervalMs?: number;
};

export function HeroImageCarousel({ slides, intervalMs = 6500 }: HeroImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (slides.length < 2 || reducedMotion) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [slides.length, intervalMs, reducedMotion]);

  const go = useCallback((i: number) => {
    setIndex(((i % slides.length) + slides.length) % slides.length);
  }, [slides.length]);

  if (!slides.length) return null;

  return (
    <>
      <div className="absolute inset-0 z-0 overflow-hidden">
        {slides.map((slide, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            className={`absolute inset-0 h-full w-full object-cover object-left-top transition-opacity duration-700 ease-out motion-reduce:transition-none ${
              i === index ? "z-[1] opacity-100" : "z-0 opacity-0"
            }`}
            loading={i === 0 ? "eager" : "lazy"}
            aria-hidden={i !== index}
          />
        ))}
      </div>

      {slides.length > 1 ? (
        <div
          className="pointer-events-auto absolute inset-x-0 bottom-24 z-[8] flex justify-center gap-2 sm:bottom-28"
          role="tablist"
          aria-label="Hero banners"
        >
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              tabIndex={i === index ? 0 : -1}
              aria-label={`Banner ${i + 1} of ${slides.length}`}
              onClick={() => go(i)}
              className={`h-2.5 rounded-full transition-[width,background-color] duration-300 motion-reduce:transition-none ${
                i === index ? "w-8 bg-white" : "w-2.5 bg-white/45 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      ) : null}
    </>
  );
}
