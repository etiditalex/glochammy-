"use client";

import { FALLBACK_PRODUCT_IMAGE_URL } from "@/lib/constants";
import { useCart } from "@/context/cart-context";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/lib/types/commerce";
import { ButtonPush } from "@/components/ui/button-push";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
  /** Full-bleed grid: no card border (use with gap-px grid gutters). */
  flush?: boolean;
};

export function ProductCard({
  product,
  priority = false,
  flush = false,
}: ProductCardProps) {
  const { addItem } = useCart();
  const reduce = useReducedMotion();
  const cover = product.images[0] ?? FALLBACK_PRODUCT_IMAGE_URL;
  const frame = flush ? "" : "border border-line";

  const article = (
    <article className={`group flex h-full flex-col bg-white ${frame}`}>
      <Link
        href={`/shop/${product.slug}`}
        className="flex min-h-0 flex-1 flex-col outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
      >
        <div className="relative aspect-square overflow-hidden bg-subtle">
          <Image
            src={cover}
            alt={product.name}
            fill
            sizes={
              flush
                ? "(min-width: 1024px) 26vw, (min-width: 640px) 50vw, 50vw"
                : "(min-width: 1280px) 320px, (min-width: 1024px) 28vw, (min-width: 640px) 45vw, 50vw"
            }
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
            priority={priority}
          />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div>
            <h3 className="text-sm font-medium text-ink">{product.name}</h3>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
              {product.description}
            </p>
          </div>
          <p className="mt-auto text-sm font-medium text-ink sm:hidden">
            {formatMoney(product.priceCents, product.currency)}
          </p>
        </div>
      </Link>
      <div className="mt-auto flex flex-col gap-3 border-t border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="hidden text-sm font-medium text-ink sm:block">
          {formatMoney(product.priceCents, product.currency)}
        </p>
        <ButtonPush
          type="button"
          variant="primary"
          onClick={() => addItem(product.id, 1)}
          className="w-full whitespace-nowrap px-3 py-2.5 text-xs leading-tight sm:min-h-[48px] sm:min-w-[140px] sm:whitespace-normal sm:px-6 sm:py-3 sm:text-sm sm:leading-normal"
          aria-label={`Add ${product.name} to bag`}
        >
          Add to bag
        </ButtonPush>
      </div>
    </article>
  );

  if (reduce) {
    return <div className="h-full">{article}</div>;
  }

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className="h-full">
      {article}
    </motion.div>
  );
}
