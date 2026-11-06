"use client";

import { ShopProductCard } from "@/components/shop/shop-product-card";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/lib/types/commerce";
import { ChevronDown, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useEffect, useMemo, useState } from "react";

export type ShopCategoryOption = { slug: string; name: string };

type ShopSort = "featured" | "price_asc" | "price_desc" | "name";

type ShopFiltersProps = {
  products: Product[];
  categoryOptions: ShopCategoryOption[];
  initialCategory?: string | "all";
  initialFeaturedOnly?: boolean;
};

const PAGE_SIZE = 16;

const selectClass =
  "h-11 cursor-pointer appearance-none bg-transparent py-2 pr-7 text-xs font-medium uppercase tracking-[0.14em] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

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
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<ShopSort>("featured");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setFeaturedOnly(initialFeaturedOnly);
  }, [initialFeaturedOnly]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [category, featuredOnly, maxPrice, query, sort]);

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

  const categoryNameBySlug = useMemo(() => {
    return new Map(categoryOptions.map((c) => [c.slug, c.name]));
  }, [categoryOptions]);

  const priceCeiling = useMemo(() => {
    return Math.max(...products.map((p) => p.priceCents), 0);
  }, [products]);

  const currency = products[0]?.currency ?? "KES";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const ranked = products.map((product, index) => ({ product, index }));
    const matched = ranked.filter(({ product }) => {
      if (featuredOnly && !product.featured) return false;
      if (category !== "all" && product.category !== category) return false;
      if (maxPrice !== "all" && product.priceCents > maxPrice) return false;
      if (!q) return true;
      const categoryName = categoryNameBySlug.get(product.category) ?? product.category;
      const haystack = `${product.name} ${product.description} ${product.longDescription} ${categoryName}`.toLowerCase();
      return haystack.includes(q);
    });

    matched.sort((a, b) => {
      if (sort === "price_asc") {
        return a.product.priceCents - b.product.priceCents || a.index - b.index;
      }
      if (sort === "price_desc") {
        return b.product.priceCents - a.product.priceCents || a.index - b.index;
      }
      if (sort === "name") {
        return a.product.name.localeCompare(b.product.name, "en") || a.index - b.index;
      }
      const featuredDelta =
        Number(Boolean(b.product.featured)) - Number(Boolean(a.product.featured));
      return featuredDelta || a.index - b.index;
    });

    return matched.map(({ product }) => product);
  }, [products, category, maxPrice, featuredOnly, query, sort, categoryNameBySlug]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const activeCategory = categoryOptions.find((c) => c.slug === category);
  const title =
    category !== "all" && activeCategory
      ? activeCategory.name
      : featuredOnly
        ? "Staff picks"
        : "All products";
  const subtitle =
    featuredOnly && category !== "all" && activeCategory
      ? `Staff picks in ${activeCategory.name.toLowerCase()}.`
      : "Skincare, hair, body, and fragrance—an intentional edit.";
  const countLabel = `${filtered.length} ${filtered.length === 1 ? "product" : "products"}`;
  const filtersActive =
    category !== "all" ||
    featuredOnly ||
    maxPrice !== "all" ||
    query.trim().length > 0 ||
    sort !== "featured";

  function clearFilters() {
    setCategory("all");
    setFeaturedOnly(false);
    setMaxPrice("all");
    setQuery("");
    setSort("featured");
  }

  return (
    <div className="min-w-0 w-full bg-white">
      <section className="bg-[#f3f0ea]">
        <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-8 sm:py-11 lg:py-14">
          <p className="text-2xs font-medium uppercase tracking-nav text-muted">Shop</p>
          <h1 className="mt-2 font-sans text-[2rem] font-semibold uppercase leading-[0.95] tracking-[-0.03em] text-ink sm:text-5xl lg:text-[3.35rem]">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/70 sm:text-base">
            {subtitle}
          </p>
        </div>
      </section>

      <nav aria-label="Shop categories" className="relative border-b border-line bg-white">
        <div className="mx-auto flex max-w-[1280px] items-stretch gap-1 overflow-x-auto px-3 sm:px-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filterButtons.map((c) => {
            const active = category === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={`shrink-0 border-b-2 px-3 py-3.5 text-xs font-medium uppercase tracking-nav transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink ${
                  active
                    ? "border-ink text-ink"
                    : "border-transparent text-muted hover:text-ink"
                }`}
                aria-pressed={active}
              >
                {c.label}
              </button>
            );
          })}
          <span className="mx-2 hidden h-4 w-px shrink-0 self-center bg-line sm:block" aria-hidden />
          <button
            type="button"
            onClick={() => setFeaturedOnly((value) => !value)}
            aria-pressed={featuredOnly}
            className={`shrink-0 border-b-2 px-3 py-3.5 text-xs font-medium uppercase tracking-nav transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink ${
              featuredOnly
                ? "border-accent text-accent"
                : "border-transparent text-accent/80 hover:text-accent"
            }`}
          >
            Staff picks
          </button>
        </div>
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent sm:hidden"
          aria-hidden
        />
      </nav>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
        <div className="flex flex-col gap-3 border-b border-line py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative min-w-0 w-full sm:max-w-sm">
            <label htmlFor="shop-search" className="sr-only">
              Search products
            </label>
            <Search
              className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              strokeWidth={1.5}
              aria-hidden
            />
            <input
              id="shop-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
              autoComplete="off"
              className="h-11 w-full scroll-mt-40 border-0 border-b border-line bg-transparent pl-7 pr-8 text-sm text-ink placeholder:text-muted/80 focus:border-ink focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-0 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-muted hover:text-ink"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 sm:justify-end">
            <p className="text-sm text-ink/80" aria-live="polite">
              {countLabel}
            </p>
            <div className="relative">
              <label htmlFor="price-range" className="sr-only">
                Maximum price
              </label>
              <select
                id="price-range"
                value={maxPrice === "all" ? "all" : String(maxPrice)}
                onChange={(event) => {
                  const value = event.target.value;
                  setMaxPrice(value === "all" ? "all" : Number(value));
                }}
                className={selectClass}
              >
                <option value="all">Any price</option>
                {[0.25, 0.5, 0.75, 1].map((fraction) => {
                  const cents = Math.ceil(priceCeiling * fraction);
                  const label =
                    fraction === 1
                      ? `Up to ${formatMoney(priceCeiling, currency)}`
                      : `Up to ${formatMoney(cents, currency)}`;
                  return (
                    <option key={fraction} value={String(cents)}>
                      {label}
                    </option>
                  );
                })}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-ink"
                strokeWidth={1.5}
                aria-hidden
              />
            </div>
            <div className="relative">
              <label htmlFor="shop-sort" className="sr-only">
                Sort products
              </label>
              <select
                id="shop-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value as ShopSort)}
                className={selectClass}
              >
                <option value="featured">Sort: Featured</option>
                <option value="price_asc">Price: Low to high</option>
                <option value="price_desc">Price: High to low</option>
                <option value="name">Name: A to Z</option>
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-ink"
                strokeWidth={1.5}
                aria-hidden
              />
            </div>
            {filtersActive ? (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-medium uppercase tracking-nav text-muted underline decoration-line underline-offset-4 hover:text-ink"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mx-auto max-w-[1280px] px-4 py-24 text-center sm:px-8" role="status">
          <p className="font-display text-3xl text-ink sm:text-4xl">Nothing on this shelf</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            No products match these filters. Clear them to see the full edit.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-8 inline-flex min-h-11 items-center justify-center border border-ink px-6 text-xs font-medium uppercase tracking-nav text-ink transition hover:bg-ink hover:text-white"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mx-auto max-w-[1280px] px-4 pb-20 pt-6 sm:px-8 sm:pt-8">
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">
            {visible.map((product, index) => (
              <ShopProductCard
                key={product.id}
                product={product}
                priority={index < 4}
              />
            ))}
          </div>
          {hasMore ? (
            <div className="mt-14 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                className="inline-flex min-h-12 min-w-[12.5rem] items-center justify-center border border-ink px-8 text-xs font-medium uppercase tracking-nav text-ink transition hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                Load more
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
