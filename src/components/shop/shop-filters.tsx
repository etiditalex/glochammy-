"use client";

import type { Product } from "@/lib/types/commerce";
import { formatMoney } from "@/lib/format";
import { ProductCard } from "@/components/product/product-card";
import { useEffect, useMemo, useState } from "react";

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

      {filtered.length === 0 ? (
        <p className="py-16 text-sm text-muted" role="status">
          No products match these filters. Try widening your selection.
        </p>
      ) : (
        <div className="grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
