"use client";

import { BRAND } from "@/lib/constants";
import { formatMoney } from "@/lib/format";
import type { SalonService } from "@/lib/types/commerce";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type SalonPreviewProps = {
  services: SalonService[];
};

export function SalonPreview({ services }: SalonPreviewProps) {
  const preview = services.slice(0, 8);
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
  }, [syncControls, preview.length]);

  const scrollByPage = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.8 * dir, behavior: "smooth" });
  }, []);

  if (!preview.length) return null;

  const arrowClass =
    "absolute top-[7.5rem] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-[0_1px_4px_rgba(20,18,15,0.18)] transition-opacity duration-200 motion-reduce:transition-none md:flex";

  return (
    <section className="w-full bg-cream px-2 pb-3 pt-2" aria-labelledby="salon-heading">
      <div className="mx-auto max-w-[1248px] md:px-3">
        <div className="rounded-2xl bg-white pb-2.5 shadow-[0_0_0_1px_rgba(232,230,227,1)]">
          <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-4">
            <div className="min-w-0">
              <h2
                id="salon-heading"
                className="text-[22px] font-bold leading-none text-ink sm:text-[32px]"
              >
                Salon &amp; nails
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Salon treatments plus our nails parlour in {BRAND.region}—unhurried
                care and clear pricing.
              </p>
            </div>
            <Link
              href="/salon"
              className="inline-flex h-10 shrink-0 items-center rounded-full bg-accent px-6 text-sm text-cream hover:bg-[#6f583a]"
            >
              See All
            </Link>
          </div>

          <div className="relative">
            <div
              ref={scrollerRef}
              className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-smooth px-3 touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="region"
              aria-label="Salon and nails"
              tabIndex={0}
            >
              {preview.map((service) => (
                <Link
                  key={service.id}
                  href="/salon"
                  className="flex w-[168px] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-line bg-white sm:w-[186px]"
                >
                  <span className="relative block aspect-square w-full bg-subtle">
                    <Image
                      src={service.image}
                      alt=""
                      fill
                      sizes="186px"
                      quality={60}
                      className="object-cover"
                    />
                  </span>
                  <span className="line-clamp-2 px-2 pt-2 text-sm leading-[1.4] text-ink">
                    {service.name}
                  </span>
                  <span className="line-clamp-3 px-2 pt-1 text-sm leading-[1.4] text-muted">
                    {service.description}
                  </span>
                  <span className="mt-auto px-2 pb-3 pt-2 text-lg font-semibold leading-none tracking-tight text-ink">
                    {formatMoney(service.priceCents, service.currency)}
                  </span>
                </Link>
              ))}
            </div>

            <button
              type="button"
              aria-label="Previous salon services"
              disabled={!canPrev}
              onClick={() => scrollByPage(-1)}
              className={`${arrowClass} left-1 disabled:pointer-events-none disabled:opacity-0`}
            >
              <ChevronLeft className="h-6 w-6" strokeWidth={1.75} aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Next salon services"
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
