"use client";

import { FALLBACK_PRODUCT_IMAGE_URL } from "@/lib/constants";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/lib/types/commerce";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type FeaturedProductsProps = {
  products: Product[];
};

/**
 * Horizontal product row in the shape of Jumia's sponsored-products block.
 * Colors and copy stay on the Glochammy palette.
 */
export function FeaturedProducts({ products }: FeaturedProductsProps) {
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
  }, [syncControls, products.length]);

  const scrollByPage = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.8 * dir, behavior: "smooth" });
  }, []);

  if (!products.length) return null;

  const arrowClass =
    "absolute top-[5.5rem] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-ink shadow-[0_1px_4px_rgba(20,18,15,0.12)] md:flex";

  return (
    <section
      className="w-full bg-cream px-2 pb-4 pt-2"
      aria-labelledby="all-products-heading"
    >
      <div className="mx-auto max-w-[1248px] md:px-3">
        <div className="rounded-2xl border border-line bg-white pb-3">
          <div className="flex items-center justify-between gap-3 px-4 pb-2 pt-4">
            <h2
              id="all-products-heading"
              className="min-w-0 truncate text-xl font-semibold text-ink sm:text-2xl"
            >
              All products
            </h2>
            <Link
              href="/shop"
              className="shrink-0 text-sm font-medium text-accent hover:text-[#6f583a]"
            >
              See all
            </Link>
          </div>

          <div className="relative">
            <div
              ref={scrollerRef}
              className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-smooth px-3 touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="region"
              aria-label="All products"
              tabIndex={0}
            >
              {products.map((product) => {
                const cover = product.images[0] ?? FALLBACK_PRODUCT_IMAGE_URL;
                return (
                  <Link
                    key={product.id}
                    href={`/shop/${product.slug}`}
                    className="flex w-[168px] shrink-0 snap-start flex-col sm:w-[196px]"
                  >
                    <span className="relative block aspect-square w-full overflow-hidden rounded-lg bg-subtle">
                      <Image
                        src={cover}
                        alt=""
                        fill
                        sizes="196px"
                        quality={60}
                        className="object-contain"
                      />
                    </span>
                    <span className="mt-2 line-clamp-2 text-sm leading-snug text-ink">
                      {product.name}
                    </span>
                    <span className="mt-1 text-base font-medium text-accent">
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
