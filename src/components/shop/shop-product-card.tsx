"use client";

import { useCart } from "@/context/cart-context";
import { FALLBACK_PRODUCT_IMAGE_URL } from "@/lib/constants";
import { formatMoney } from "@/lib/format";
import { trackedStock } from "@/lib/products/stock";
import type { Product } from "@/lib/types/commerce";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ShopProductCardProps = {
  product: Product;
  priority?: boolean;
};

export function ShopProductCard({ product, priority = false }: ShopProductCardProps) {
  const { addItem, lines } = useCart();
  const [added, setAdded] = useState(false);
  const cover = product.images[0] ?? FALLBACK_PRODUCT_IMAGE_URL;

  const available = trackedStock(product.stockQuantity);
  const inCart = useMemo(
    () => lines.find((line) => line.productId === product.id)?.quantity ?? 0,
    [lines, product.id],
  );
  const isOutOfStock = available === 0;
  const remaining = available === null ? null : Math.max(0, available - inCart);
  const atMax = remaining === 0;
  const isLowStock = available !== null && available > 0 && available <= 3;

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(timer);
  }, [added]);

  function onAdd() {
    if (isOutOfStock || remaining === 0) return;
    addItem(product.id, 1);
    setAdded(true);
  }

  const actionLabel = isOutOfStock
    ? "Sold out"
    : atMax
      ? "Max in bag"
      : added
        ? "Added"
        : "Add to bag";

  return (
    <article className="group flex h-full flex-col">
      <Link
        href={`/shop/${product.slug}`}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        <div className="relative aspect-square overflow-hidden bg-[#f4f2ef]">
          <Image
            src={cover}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 280px, (min-width: 768px) 30vw, 46vw"
            quality={80}
            priority={priority}
            className={`object-cover transition duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${
              isOutOfStock ? "opacity-60" : ""
            }`}
          />
          {product.featured || isOutOfStock || isLowStock ? (
            <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1">
              {product.featured ? (
                <span className="bg-white/95 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
                  Staff pick
                </span>
              ) : null}
              {isOutOfStock || isLowStock ? (
                <span
                  className={`px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white ${
                    isOutOfStock ? "bg-ink" : "bg-accent"
                  }`}
                >
                  {isOutOfStock ? "Sold out" : `Only ${available} left`}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="flex flex-col pt-3">
          <h2 className="line-clamp-2 text-[0.9375rem] font-medium leading-snug text-ink">
            {product.name}
          </h2>
          <p className="mt-1 text-sm text-ink/70">
            {formatMoney(product.priceCents, product.currency)}
          </p>
        </div>
      </Link>
      <button
        type="button"
        onClick={onAdd}
        disabled={isOutOfStock || atMax}
        aria-live="polite"
        aria-label={actionLabel}
        className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 border border-ink/15 bg-white px-2 text-[10px] font-medium uppercase tracking-[0.14em] text-ink transition duration-200 hover:border-ink hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:border-line disabled:bg-subtle disabled:text-muted disabled:hover:bg-subtle sm:px-3 sm:text-[11px] sm:tracking-[0.16em]"
      >
        <ShoppingBag className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
        <span className="sm:hidden">{isOutOfStock ? "Sold out" : atMax ? "Max" : added ? "Added" : "Add"}</span>
        <span className="hidden sm:inline">{actionLabel}</span>
      </button>
    </article>
  );
}
