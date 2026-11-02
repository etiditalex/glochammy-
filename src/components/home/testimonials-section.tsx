"use client";

import type { Testimonial } from "@/lib/types/commerce";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type TestimonialsSectionProps = {
  items: Testimonial[];
};

export function TestimonialsSection({ items }: TestimonialsSectionProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const syncControls = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 24);
    setCanNext(el.scrollLeft < max - 24);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    syncControls();
    el.addEventListener("scroll", syncControls, { passive: true });
    const ro = new ResizeObserver(syncControls);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", syncControls);
      ro.disconnect();
    };
  }, [syncControls, items.length]);

  const scrollByPage = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.8 * dir, behavior: "smooth" });
  }, []);

  if (!items.length) return null;

  const arrowClass =
    "absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-[0_1px_4px_rgba(20,18,15,0.18)] transition-opacity duration-200 motion-reduce:transition-none md:flex";

  return (
    <section className="w-full bg-cream px-2 pb-3 pt-2" aria-labelledby="voices-heading">
      <div className="mx-auto max-w-[1248px] md:px-3">
        <div className="rounded-2xl bg-subtle pb-2.5">
          <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-4">
            <h2
              id="voices-heading"
              className="min-w-0 text-[22px] font-bold leading-tight text-accent sm:text-[32px] sm:leading-none"
            >
              Trusted by clients who prefer quiet care
            </h2>
            <Link
              href="/booking"
              className="inline-flex h-10 shrink-0 items-center rounded-full bg-accent px-6 text-sm text-cream hover:bg-[#6f583a]"
            >
              Book
            </Link>
          </div>

          <div className="relative">
            <div
              ref={scrollerRef}
              className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-smooth px-3 touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="region"
              aria-label="Client notes"
              tabIndex={0}
            >
              {items.map((item) => (
                <figure
                  key={item.id}
                  className="flex w-[240px] shrink-0 snap-start flex-col rounded-xl border border-line bg-white p-3 sm:w-[280px]"
                >
                  <blockquote className="line-clamp-4 text-sm leading-[1.4] text-ink">
                    “{item.quote}”
                  </blockquote>
                  <figcaption className="mt-auto pt-3 text-sm text-muted">
                    {item.name}
                    <span className="mx-1.5 text-line">·</span>
                    {item.location}
                  </figcaption>
                </figure>
              ))}
            </div>

            <button
              type="button"
              aria-label="Previous client notes"
              disabled={!canPrev}
              onClick={() => scrollByPage(-1)}
              className={`${arrowClass} left-1 disabled:pointer-events-none disabled:opacity-0`}
            >
              <ChevronLeft className="h-6 w-6" strokeWidth={1.75} aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Next client notes"
              disabled={!canNext}
              onClick={() => scrollByPage(1)}
              className={`${arrowClass} right-1 disabled:pointer-events-none disabled:opacity-0`}
            >
              <ChevronRight className="h-6 w-6" strokeWidth={1.75} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
