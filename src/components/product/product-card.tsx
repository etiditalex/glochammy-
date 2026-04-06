"use client";

import { FALLBACK_PRODUCT_IMAGE_URL } from "@/lib/constants";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/lib/types/commerce";
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
  const reduce = useReducedMotion();
  const cover = product.images[0] ?? FALLBACK_PRODUCT_IMAGE_URL;
  const frame = flush ? "" : "border border-line";
  const CardInner = (
    <article className={`group flex h-full flex-col bg-white ${frame}`}>
      <div className="relative aspect-square overflow-hidden bg-subtle">
        <Image
          src={cover}
          alt={product.name}
          fill
          sizes={
            flush
              ? "(min-width: 1024px) 26vw, (min-width: 640px) 50vw, 100vw"
              : "(min-width: 1280px) 320px, (min-width: 1024px) 28vw, (min-width: 640px) 45vw, 92vw"
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
        <p className="mt-auto text-sm font-medium text-ink">
          {formatMoney(product.priceCents, product.currency)}
        </p>
      </div>
    </article>
  );

  if (reduce) {
    return (
      <Link href={`/shop/${product.slug}`} className="block h-full">
        {CardInner}
      </Link>
    );
  }

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className="h-full">
      <Link href={`/shop/${product.slug}`} className="block h-full">
        {CardInner}
      </Link>
    </motion.div>
  );
}
