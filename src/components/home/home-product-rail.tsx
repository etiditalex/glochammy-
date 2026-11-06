"use client";

import { HomeSectionHeading } from "@/components/home/section-heading";
import { useCart } from "@/context/cart-context";
import { FALLBACK_PRODUCT_IMAGE_URL } from "@/lib/constants";
import { formatMoney } from "@/lib/format";
import { trackedStock } from "@/lib/products/stock";
import type { Product } from "@/lib/types/commerce";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type HomeProductRailProps = {
  id: string;
  eyebrow?: string;
  title: string;
  href: string;
  products: Product[];
  priority?: boolean;
};

export function HomeProductRail({
  id,
  eyebrow = "Shop",
  title,
  href,
  products,
  priority = false,
}: HomeProductRailProps) {
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
  }, [syncControls, products.length]);

  const scrollByPage = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.86 * dir, behavior: "smooth" });
  }, []);

  const goToPage = useCallback((next: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  }, []);

  if (!products.length) return null;

  const arrowClass =
    "absolute top-[38%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-[0_1px_4px_rgba(20,18,15,0.16)] md:flex";

  return (
    <section className="w-full bg-white py-12 sm:py-16" aria-labelledby={id}>
      <HomeSectionHeading id={id} eyebrow={eyebrow} title={title} href={href} />
      <div className="relative mx-auto max-w-[1280px]">
        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth px-4 touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 sm:px-8 [&::-webkit-scrollbar]:hidden"
          role="region"
          aria-label={title}
          tabIndex={0}
        >
          {products.map((product, index) => (
            <HomeRailCard
              key={product.id}
              product={product}
              priority={priority && index < 2}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label={`Previous ${title}`}
          disabled={!canPrev}
          onClick={() => scrollByPage(-1)}
          className={`${arrowClass} left-3 disabled:pointer-events-none disabled:opacity-0`}
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.5} aria-hidden />
        </button>
        <button
          type="button"
          aria-label={`Next ${title}`}
          disabled={!canNext}
          onClick={() => scrollByPage(1)}
          className={`${arrowClass} right-3 disabled:pointer-events-none disabled:opacity-0`}
        >
          <ChevronRight className="h-5 w-5" strokeWidth={1.5} aria-hidden />
        </button>
      </div>
      {pages > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-2" role="tablist" aria-label={`${title} pages`}>
          {Array.from({ length: pages }, (_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === page}
              aria-label={`Go to page ${index + 1}`}
              onClick={() => goToPage(index)}
              className={`h-2 rounded-full transition-all ${
                index === page ? "w-2 bg-ink" : "w-2 bg-ink/25"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function HomeRailCard({ product, priority }: { product: Product; priority: boolean }) {
  const { addItem, lines } = useCart();
  const [added, setAdded] = useState(false);
  const cover = product.images[0] ?? FALLBACK_PRODUCT_IMAGE_URL;
  const available = trackedStock(product.stockQuantity);
  const inCart = lines.find((line) => line.productId === product.id)?.quantity ?? 0;
  const isOutOfStock = available === 0;
  const atMax = available !== null && available - inCart <= 0;

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 1400);
    return () => window.clearTimeout(timer);
  }, [added]);

  const label = isOutOfStock ? "Sold out" : atMax ? "Max in bag" : added ? "Added" : "Add to bag";

  return (
    <article className="flex w-[46vw] max-w-[240px] shrink-0 snap-start flex-col sm:w-[220px]">
      <Link
        href={`/shop/${product.slug}`}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        <span className="relative block aspect-square overflow-hidden bg-[#f4f2ef]">
          <Image
            src={cover}
            alt={product.name}
            fill
            sizes="240px"
            quality={75}
            priority={priority}
            className="object-cover"
          />
        </span>
        <span className="mt-3 block line-clamp-2 min-h-[2.6em] text-sm font-medium leading-snug text-ink">
          {product.name}
        </span>
        <span className="mt-1 block text-sm text-ink/70">
          {formatMoney(product.priceCents, product.currency)}
        </span>
      </Link>
      <button
        type="button"
        disabled={isOutOfStock || atMax}
        onClick={() => {
          if (isOutOfStock || atMax) return;
          addItem(product.id, 1);
          setAdded(true);
        }}
        className="mt-3 inline-flex min-h-11 w-full items-center justify-center border border-ink/15 text-[10px] font-medium uppercase tracking-[0.14em] text-ink transition hover:border-ink hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:border-line disabled:text-muted disabled:hover:bg-transparent"
      >
        {label}
      </button>
    </article>
  );
}
