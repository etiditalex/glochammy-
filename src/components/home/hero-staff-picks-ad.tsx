"use client";

import { FALLBACK_PRODUCT_IMAGE_URL } from "@/lib/constants";
import { useAutoplayWhenVisible, usePrefersReducedMotion } from "@/hooks/use-autoplay-when-visible";
import type { Product } from "@/lib/types/commerce";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState, type TouchEvent } from "react";

type HeroStaffPicksAdProps = {
  products: Product[];
  intervalMs?: number;
};

export function HeroStaffPicksAd({
  products,
  intervalMs = 4500,
}: HeroStaffPicksAdProps) {
  const list = products.slice(0, 4);
  const [index, setIndex] = useState(0);
  const [activated, setActivated] = useState<Set<number>>(() => new Set([0]));
  const rootRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const advance = useCallback(() => {
    setIndex((i) => {
      const next = (i + 1) % list.length;
      setActivated((prev) => {
        if (prev.has(next)) return prev;
        const copy = new Set(prev);
        copy.add(next);
        return copy;
      });
      return next;
    });
  }, [list.length]);

  useAutoplayWhenVisible(
    rootRef,
    list.length > 1 && !reducedMotion,
    intervalMs,
    advance,
  );

  const go = useCallback(
    (i: number) => {
      const next = ((i % list.length) + list.length) % list.length;
      setIndex(next);
      setActivated((prev) => {
        if (prev.has(next)) return prev;
        const copy = new Set(prev);
        copy.add(next);
        return copy;
      });
    },
    [list.length],
  );

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start == null || list.length < 2) return;
    const end = e.changedTouches[0]?.clientX;
    if (end == null) return;
    const delta = end - start;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) go(index + 1);
    else go(index - 1);
  };

  if (!list.length) {
    return (
      <Link
        href="/shop?featured=1"
        className="flex aspect-[4/3] w-full items-center justify-center bg-ink px-5 py-5 text-white lg:aspect-auto lg:min-h-0 lg:flex-1"
      >
        <span className="font-display text-2xl leading-tight">New arrivals</span>
      </Link>
    );
  }

  const active = list[index]!;

  return (
    <div
      ref={rootRef}
      className="relative aspect-[4/3] w-full overflow-hidden border border-line bg-ink lg:aspect-auto lg:min-h-0 lg:flex-1"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {list.map((product, i) => {
        if (!activated.has(i)) return null;
        const src = product.images[0] ?? FALLBACK_PRODUCT_IMAGE_URL;
        return (
          <Image
            key={product.id}
            src={src}
            alt=""
            fill
            sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 100vw"
            quality={60}
            className={`object-cover transition-opacity duration-500 ease-out motion-reduce:transition-none ${
              i === index ? "z-[1] opacity-100" : "z-0 opacity-0"
            }`}
            aria-hidden={i !== index}
          />
        );
      })}

      <Link
        href={`/shop/${active.slug}`}
        className="absolute inset-0 z-[2]"
        aria-label={active.name}
      />

      {list.length > 1 ? (
        <div
          className="absolute inset-x-0 bottom-2 z-[3] flex justify-center gap-0.5"
          role="tablist"
          aria-label="Staff pick ads"
        >
          {list.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Staff pick ${i + 1}: ${p.name}`}
              tabIndex={i === index ? 0 : -1}
              onClick={() => go(i)}
              className="flex h-8 min-w-7 items-center justify-center"
            >
              <span
                className={`block h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                  i === index ? "w-5 bg-white" : "w-1.5 bg-white/45"
                }`}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
