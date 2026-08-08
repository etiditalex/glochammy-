"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";

export type MarketplaceBannerSlide = {
  src: string;
  alt: string;
  href?: string;
};

type HeroBannerSliderProps = {
  slides: MarketplaceBannerSlide[];
  intervalMs?: number;
};

export function HeroBannerSlider({
  slides,
  intervalMs = 5500,
}: HeroBannerSliderProps) {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activated, setActivated] = useState<Set<number>>(() => new Set([0]));
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    setActivated((prev) => {
      if (prev.has(index)) return prev;
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, [index]);

  useEffect(() => {
    if (slides.length < 2 || reducedMotion) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [slides.length, intervalMs, reducedMotion]);

  const go = useCallback(
    (i: number) => {
      setIndex(((i % slides.length) + slides.length) % slides.length);
    },
    [slides.length],
  );

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start == null || slides.length < 2) return;
    const end = e.changedTouches[0]?.clientX;
    if (end == null) return;
    const delta = end - start;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) go(index + 1);
    else go(index - 1);
  };

  if (!slides.length) return null;

  const active = slides[index]!;

  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden bg-ink sm:aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-[340px] xl:min-h-[380px]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {slides.map((slide, i) => {
        if (!activated.has(i)) return null;
        return (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="(min-width: 1280px) 70vw, (min-width: 1024px) 60vw, 100vw"
            className={`object-cover object-center transition-opacity duration-500 ease-out motion-reduce:transition-none ${
              i === index ? "z-[1] opacity-100" : "z-0 opacity-0"
            }`}
            aria-hidden={i !== index}
          />
        );
      })}

      {active.href ? (
        <Link
          href={active.href}
          className="absolute inset-0 z-[2]"
          aria-label={active.alt}
        />
      ) : null}

      {slides.length > 1 ? (
        <div
          className="absolute inset-x-0 bottom-3 z-[3] flex justify-center gap-1 sm:bottom-4 sm:gap-2"
          role="tablist"
          aria-label="Promotional banners"
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
              className="flex h-8 min-w-8 items-center justify-center"
            >
              <span
                className={`block h-2 rounded-full transition-[width,background-color] duration-300 motion-reduce:transition-none ${
                  i === index ? "w-7 bg-white" : "w-2 bg-white/45"
                }`}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
