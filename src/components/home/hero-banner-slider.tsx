"use client";

import { useAutoplayWhenVisible, usePrefersReducedMotion } from "@/hooks/use-autoplay-when-visible";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState, type TouchEvent } from "react";

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
  intervalMs = 6000,
}: HeroBannerSliderProps) {
  const [index, setIndex] = useState(0);
  const [activated, setActivated] = useState<Set<number>>(() => new Set([0]));
  const rootRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const advance = useCallback(() => {
    setIndex((i) => {
      const next = (i + 1) % slides.length;
      setActivated((prev) => {
        if (prev.has(next)) return prev;
        const copy = new Set(prev);
        copy.add(next);
        return copy;
      });
      return next;
    });
  }, [slides.length]);

  useAutoplayWhenVisible(
    rootRef,
    slides.length > 1 && !reducedMotion,
    intervalMs,
    advance,
  );

  const go = useCallback(
    (i: number) => {
      const next = ((i % slides.length) + slides.length) % slides.length;
      setIndex(next);
      setActivated((prev) => {
        if (prev.has(next)) return prev;
        const copy = new Set(prev);
        copy.add(next);
        return copy;
      });
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
      ref={rootRef}
      className="relative aspect-[2/1] w-full overflow-hidden bg-cream sm:aspect-[21/9] lg:aspect-[2/1] xl:aspect-[21/9]"
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
            sizes="(min-width: 1280px) 55vw, (min-width: 1024px) 60vw, 100vw"
            quality={i === 0 ? 75 : 65}
            className={`object-contain object-center transition-opacity duration-500 ease-out motion-reduce:transition-none ${
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
          className="absolute inset-x-0 bottom-2 z-[3] flex justify-center gap-1 sm:bottom-3 sm:gap-2"
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
                className={`block h-2 rounded-full shadow-sm transition-[width,background-color] duration-300 motion-reduce:transition-none ${
                  i === index ? "w-7 bg-accent" : "w-2 bg-ink/35"
                }`}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
