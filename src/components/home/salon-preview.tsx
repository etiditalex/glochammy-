"use client";

import { HomeSectionHeading } from "@/components/home/section-heading";
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
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const syncControls = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pageWidth = el.clientWidth || 1;
    const count = Math.max(1, Math.ceil((el.scrollWidth - 8) / pageWidth));
    setCanPrev(el.scrollLeft > 24);
    setCanNext(el.scrollLeft < max - 24);
    setPages(count);
    setPage(Math.min(count - 1, Math.round(el.scrollLeft / pageWidth)));
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
    el.scrollBy({ left: el.clientWidth * 0.86 * dir, behavior: "smooth" });
  }, []);

  if (!preview.length) return null;

  const arrowClass =
    "absolute top-[38%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-[0_1px_4px_rgba(20,18,15,0.16)] md:flex";

  return (
    <section className="w-full bg-white py-12 sm:py-16" aria-labelledby="salon-heading">
      <HomeSectionHeading
        id="salon-heading"
        eyebrow={BRAND.region}
        title="Salon & nails"
        href="/salon"
      />
      <p className="mx-auto -mt-4 mb-8 max-w-xl px-4 text-center text-sm leading-relaxed text-ink/70 sm:-mt-6">
        Salon treatments plus our nails parlour in {BRAND.region}—unhurried care and clear pricing.
      </p>
      <div className="relative mx-auto max-w-[1280px]">
        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth px-4 touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 sm:px-8 [&::-webkit-scrollbar]:hidden"
          role="region"
          aria-label="Salon and nails"
          tabIndex={0}
        >
          {preview.map((service) => (
            <Link
              key={service.id}
              href="/salon"
              className="flex w-[46vw] max-w-[240px] shrink-0 snap-start flex-col outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink sm:w-[220px]"
            >
              <span className="relative block aspect-square overflow-hidden bg-[#f4f2ef]">
                <Image
                  src={service.image}
                  alt=""
                  fill
                  sizes="240px"
                  quality={75}
                  className="object-cover"
                />
              </span>
              <span className="mt-3 line-clamp-2 text-sm font-medium leading-snug text-ink">
                {service.name}
              </span>
              <span className="mt-1 line-clamp-2 text-sm leading-snug text-muted">
                {service.description}
              </span>
              <span className="mt-2 text-sm text-ink/70">
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
          className={`${arrowClass} left-3 disabled:pointer-events-none disabled:opacity-0`}
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.5} aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Next salon services"
          disabled={!canNext}
          onClick={() => scrollByPage(1)}
          className={`${arrowClass} right-3 disabled:pointer-events-none disabled:opacity-0`}
        >
          <ChevronRight className="h-5 w-5" strokeWidth={1.5} aria-hidden />
        </button>
      </div>
      {pages > 1 ? (
        <div className="mt-6 flex justify-center gap-2" aria-hidden>
          {Array.from({ length: pages }, (_, index) => (
            <span
              key={index}
              className={`h-2 w-2 rounded-full ${index === page ? "bg-ink" : "bg-ink/25"}`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
