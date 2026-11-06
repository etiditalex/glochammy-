"use client";

import { useAutoplayWhenVisible, usePrefersReducedMotion } from "@/hooks/use-autoplay-when-visible";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";

export type MarketplaceBannerSlide = {
  src: string;
  alt: string;
  headline: string;
  cta: string;
  href: string;
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
  const [mobile, setMobile] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const syncTop = () => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      el.style.setProperty("--hero-top", `${Math.max(0, Math.round(top))}px`);
    };
    syncTop();
    window.addEventListener("resize", syncTop);
    return () => window.removeEventListener("resize", syncTop);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const advance = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length);
  }, [slides.length]);

  useAutoplayWhenVisible(
    rootRef,
    mobile && slides.length > 1 && !reducedMotion,
    intervalMs,
    advance,
  );

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

  return (
    <div
      ref={rootRef}
      className="relative h-[calc(100svh-var(--hero-top,9rem))] min-h-[420px] w-full overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative h-full lg:grid lg:grid-cols-3">
        {slides.map((slide, i) => {
          const active = i === index;
          return (
            <div
              key={slide.src}
              className={`absolute inset-0 h-full transition-opacity duration-1000 ease-out motion-reduce:transition-none lg:relative lg:inset-auto lg:opacity-100 ${
                active
                  ? "z-[1] opacity-100"
                  : "z-0 opacity-0 pointer-events-none lg:pointer-events-auto"
              }`}
              inert={mobile && !active ? true : undefined}
            >
              <Image
                src={slide.src}
                alt=""
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 34vw, 100vw"
                quality={75}
                className="object-cover object-center"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/10" />
              <div className="absolute inset-x-6 bottom-8 z-[1] px-0 pb-8 text-center text-white lg:bottom-16">
                <p className="font-sans text-[20px] font-semibold uppercase leading-[1.3] tracking-[0.04em]">
                  {slide.headline}
                </p>
                <Link
                  href={slide.href}
                  className="mt-4 inline-flex bg-ink px-7 py-3.5 font-sans text-[11px] uppercase tracking-[0.12em] text-white outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {slide.cta}
                </Link>
              </div>
              <span className="sr-only">{slide.alt}</span>
            </div>
          );
        })}
      </div>

      {slides.length > 1 ? (
        <div
          className="absolute bottom-3.5 left-1/2 z-[2] flex -translate-x-1/2 gap-1.5 lg:hidden"
          role="tablist"
          aria-label="Promotional banners"
        >
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              tabIndex={i === index ? 0 : -1}
              aria-label={`Banner ${i + 1} of ${slides.length}`}
              onClick={() => go(i)}
              className={`h-1.5 w-1.5 rounded-full ${
                i === index ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
