"use client";

import { FALLBACK_PRODUCT_IMAGE_URL } from "@/lib/constants";
import type { Product } from "@/lib/types/commerce";
import { formatMoney } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useEffect, useMemo, useState } from "react";

export type ShopCategoryOption = { slug: string; name: string };

type ShopFiltersProps = {
  products: Product[];
  categoryOptions: ShopCategoryOption[];
  initialCategory?: string | "all";
  initialFeaturedOnly?: boolean;
};

export function ShopFilters({
  products,
  categoryOptions,
  initialCategory = "all",
  initialFeaturedOnly = false,
}: ShopFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filterButtons = useMemo(
    () => [
      { id: "all", label: "All" },
      ...categoryOptions.map((c) => ({ id: c.slug, label: c.name })),
    ],
    [categoryOptions],
  );

  const [category, setCategory] = useState<string>(initialCategory);
  const [featuredOnly, setFeaturedOnly] = useState(initialFeaturedOnly);
  const [maxPrice, setMaxPrice] = useState<number | "all">("all");

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setFeaturedOnly(initialFeaturedOnly);
  }, [initialFeaturedOnly]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") params.delete("category");
    else params.set("category", category);
    if (featuredOnly) params.set("featured", "1");
    else params.delete("featured");
    const qs = params.toString();
    const next = qs ? `${pathname}?${qs}` : pathname;
    const current = searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;
    if (next === current) return;
    startTransition(() => {
      router.replace(next, { scroll: false });
    });
  }, [category, featuredOnly, pathname, router, searchParams]);

  const priceCeiling = useMemo(() => {
    return Math.max(...products.map((p) => p.priceCents), 0);
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (featuredOnly && !p.featured) return false;
      if (category !== "all" && p.category !== category) return false;
      if (maxPrice !== "all" && p.priceCents > maxPrice) return false;
      return true;
    });
  }, [products, category, maxPrice, featuredOnly]);

  return (
    <div className="min-w-0 w-full">
      <div className="mx-auto min-w-0 max-w-content px-4 sm:px-8">
        <div className="flex flex-col gap-6 border-b border-line py-8 lg:flex-row lg:items-end lg:justify-between">
          <fieldset className="min-w-0">
            <legend className="text-2xs font-medium uppercase tracking-nav text-muted">
              Category
            </legend>
            <div
              className="mt-3 flex flex-wrap gap-2"
              role="group"
              aria-label="Filter by category"
            >
              {filterButtons.map((c) => {
                const active = category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`min-h-[44px] rounded-none border px-3 py-2 text-2xs uppercase tracking-nav transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:min-h-[40px] sm:text-xs ${
                      active
                        ? "border-ink bg-ink text-white"
                        : "border-line bg-white text-ink hover:bg-subtle"
                    }`}
                    aria-pressed={active}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="flex flex-wrap items-end gap-4 lg:max-w-xs lg:flex-col lg:items-stretch lg:text-right">
            <fieldset>
              <legend className="text-2xs font-medium uppercase tracking-nav text-muted lg:text-right">
                Shelf edit
              </legend>
              <button
                type="button"
                onClick={() => setFeaturedOnly((v) => !v)}
                aria-pressed={featuredOnly}
                className={`mt-3 min-h-[44px] w-full rounded-none border px-3 py-2 text-2xs uppercase tracking-nav transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:min-h-[40px] sm:text-xs ${
                  featuredOnly
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-white text-ink hover:bg-subtle"
                }`}
              >
                Staff picks only
              </button>
            </fieldset>

            <div className="min-w-0 flex-1 lg:w-full lg:text-right">
              <label
                htmlFor="price-range"
                className="text-2xs font-medium uppercase tracking-nav text-muted"
              >
                Max price
              </label>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center lg:flex-col lg:items-stretch">
                <select
                  id="price-range"
                  value={maxPrice === "all" ? "all" : String(maxPrice)}
                  onChange={(e) => {
                    const v = e.target.value;
                    setMaxPrice(v === "all" ? "all" : Number(v));
                  }}
                  className="min-h-[48px] w-full max-w-full border border-line bg-white px-3 py-2 text-base text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:min-h-[44px]"
                >
                  <option value="all">Any</option>
                  {[0.25, 0.5, 0.75, 1].map((fraction) => {
                    const cents = Math.ceil(priceCeiling * fraction);
                    const label =
                      fraction === 1
                        ? `Up to ${formatMoney(priceCeiling, products[0]?.currency ?? "KES")}`
                        : `Up to ${formatMoney(cents, products[0]?.currency ?? "KES")}`;
                    return (
                      <option key={fraction} value={String(cents)}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p
          className="px-4 py-16 text-center text-sm text-muted sm:px-8"
          role="status"
        >
          No products match these filters. Try widening your selection.
        </p>
      ) : (
        <div className="w-full bg-cream px-2 py-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="mx-auto grid max-w-[1248px] grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((product) => {
              const cover = product.images[0] ?? FALLBACK_PRODUCT_IMAGE_URL;
              return (
                <Link
                  key={product.id}
                  href={`/shop/${product.slug}`}
                  className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white"
                >
                  <span className="relative block aspect-square w-full bg-white">
                    <Image
                      src={cover}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 220px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      quality={60}
                      className="object-contain"
                    />
                  </span>
                  <span className="line-clamp-2 px-2 pt-2 text-sm leading-[1.4] text-muted">
                    {product.name}
                  </span>
                  <span className="mt-auto px-2 pb-3 pt-1 text-lg font-medium leading-none text-accent">
                    {formatMoney(product.priceCents, product.currency)}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
