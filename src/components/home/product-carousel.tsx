"use client";

import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/lib/types/commerce";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type ProductCarouselProps = {
  products: Product[];
};

export function ProductCarousel({ products }: ProductCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const syncControls = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
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
  }, [syncControls, products.length]);

  const scrollByPage = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.85 * dir, behavior: "smooth" });
  }, []);

  if (!products.length) return null;

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain scroll-smooth touch-pan-x pb-2 [-webkit-overflow-scrolling:touch] [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-3 lg:gap-4 [&::-webkit-scrollbar]:hidden"
        role="region"
        aria-label="Featured products"
        tabIndex={0}
      >
        {products.map((product, i) => (
          <div
            key={product.id}
            className="min-w-0 shrink-0 snap-start basis-[calc((100%-0.5rem)/2)] sm:basis-[calc((100%-1.5rem)/3)] lg:basis-[calc((100%-3rem)/4)] xl:basis-[calc((100%-5rem)/6)]"
          >
            <ProductCard
              product={product}
              priority={i < 2}
              imageSizes="(min-width: 1280px) 16vw, (min-width: 1024px) 22vw, (min-width: 640px) 30vw, 48vw"
            />
          </div>
        ))}
      </div>

      {/* Arrows: desktop / tablet — phones rely on swipe */}
      {canPrev || canNext ? (
        <>
          <button
            type="button"
            aria-label="Previous products"
            disabled={!canPrev}
            onClick={() => scrollByPage(-1)}
            className="absolute left-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-line bg-white text-ink shadow-sm transition-opacity hover:bg-subtle disabled:pointer-events-none disabled:opacity-0 sm:left-1 sm:flex"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Next products"
            disabled={!canNext}
            onClick={() => scrollByPage(1)}
            className="absolute right-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-line bg-white text-ink shadow-sm transition-opacity hover:bg-subtle disabled:pointer-events-none disabled:opacity-0 sm:right-1 sm:flex"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={1.5} aria-hidden />
          </button>
        </>
      ) : null}
    </div>
  );
}
