"use client";

import { useAutoplayWhenVisible, usePrefersReducedMotion } from "@/hooks/use-autoplay-when-visible";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

  const markSeen = useCallback((next: number) => {
    setActivated((prev) => {
      if (prev.has(next)) return prev;
      const copy = new Set(prev);
      copy.add(next);
      return copy;
    });
  }, []);

  const advance = useCallback(() => {
    setIndex((i) => {
      const next = (i + 1) % slides.length;
      markSeen(next);
      return next;
    });
  }, [markSeen, slides.length]);

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
      markSeen(next);
    },
    [markSeen, slides.length],
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
  const arrowClass =
    "absolute top-1/2 z-[4] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#313133] shadow-[0_1px_4px_rgba(0,0,0,0.18)] transition-opacity duration-200 motion-reduce:transition-none md:flex md:opacity-0 md:pointer-events-none md:group-hover:pointer-events-auto md:group-hover:opacity-100 md:group-focus-within:pointer-events-auto md:group-focus-within:opacity-100";

  return (
    <div ref={rootRef} className="group relative">
      <div
        className="relative aspect-[12/5] w-full overflow-hidden rounded-2xl bg-[#e8e8e9]"
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
              sizes="(min-width: 1280px) 1232px, 100vw"
              quality={i === 0 ? 75 : 65}
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
            className="absolute bottom-4 left-1/2 z-[3] flex -translate-x-1/2 items-center rounded-full bg-white/50"
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
                className="flex h-4 w-[18px] items-center justify-center"
              >
                <span
                  className={`block rounded-full transition-[width,height,background-color,box-shadow] duration-200 motion-reduce:transition-none ${
                    i === index
                      ? "h-2 w-[18px] bg-[#313133] shadow-none"
                      : "h-1 w-1 bg-transparent shadow-[0_0_0_2px_#313133]"
                  }`}
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {slides.length > 1 ? (
        <>
          <button
            type="button"
            aria-label="Previous banner"
            onClick={() => go(index - 1)}
            className={`${arrowClass} -left-5`}
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={1.75} aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Next banner"
            onClick={() => go(index + 1)}
            className={`${arrowClass} -right-5`}
          >
            <ChevronRight className="h-6 w-6" strokeWidth={1.75} aria-hidden />
          </button>
        </>
      ) : null}
    </div>
  );
}
