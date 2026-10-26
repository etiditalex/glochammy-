"use client";

import { FALLBACK_PRODUCT_IMAGE_URL } from "@/lib/constants";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/lib/types/commerce";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type FeaturedProductHighlightsProps = {
  products: Product[];
};

export function FeaturedProductHighlights({
  products,
}: FeaturedProductHighlightsProps) {
  const highlights = products.slice(0, 12);
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
  }, [syncControls, highlights.length]);

  const scrollByPage = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.8 * dir, behavior: "smooth" });
  }, []);

  if (!highlights.length) return null;

  const arrowClass =
    "absolute top-[7.5rem] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-[0_1px_4px_rgba(20,18,15,0.18)] transition-opacity duration-200 motion-reduce:transition-none md:flex";

  return (
    <section
      className="w-full bg-cream px-2 pb-3 pt-2"
      aria-labelledby="top-selling-heading"
    >
      <div className="mx-auto max-w-[1248px] md:px-3">
        <div className="rounded-2xl bg-subtle pb-2.5">
          <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-4">
            <h2
              id="top-selling-heading"
              className="min-w-0 truncate text-[22px] font-bold leading-none text-accent sm:text-[32px]"
            >
              Top selling items
            </h2>
            <Link
              href="/shop"
              className="inline-flex h-10 shrink-0 items-center rounded-full bg-accent px-6 text-sm text-cream hover:bg-[#6f583a]"
            >
              See All
            </Link>
          </div>

          <div className="group relative">
            <div
              ref={scrollerRef}
              className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-smooth px-3 touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="region"
              aria-label="Top selling items"
              tabIndex={0}
            >
              {highlights.map((product, i) => {
                const cover = product.images[0] ?? FALLBACK_PRODUCT_IMAGE_URL;
                return (
                  <Link
                    key={product.id}
                    href={`/shop/${product.slug}`}
                    className="flex w-[168px] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-line bg-white sm:w-[186px]"
                  >
                    <span className="relative block aspect-square w-full bg-white">
                      <Image
                        src={cover}
                        alt=""
                        fill
                        sizes="186px"
                        quality={60}
                        priority={i < 2}
                        className="object-contain"
                      />
                    </span>
                    <span className="line-clamp-2 px-2 pt-2 text-sm leading-[1.4] text-muted">
                      {product.name}
                    </span>
                    <span className="px-2 pb-3 pt-1 text-lg font-medium leading-none text-accent">
                      {formatMoney(product.priceCents, product.currency)}
                    </span>
                  </Link>
                );
              })}
            </div>

            <button
              type="button"
              aria-label="Previous products"
              disabled={!canPrev}
              onClick={() => scrollByPage(-1)}
              className={`${arrowClass} left-1 disabled:pointer-events-none disabled:opacity-0`}
            >
              <ChevronLeft className="h-6 w-6" strokeWidth={1.75} aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Next products"
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
