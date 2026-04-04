"use client";

import { storeBranches } from "@/lib/data/store-locations";
import dynamic from "next/dynamic";
import {
  Crosshair,
  MapPin,
  Phone,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const StoreLocatorMap = dynamic(
  () =>
    import("@/components/locations/store-locator-map").then(
      (m) => m.StoreLocatorMap,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[420px] w-full items-center justify-center bg-subtle text-sm text-muted lg:min-h-0">
        Loading map…
      </div>
    ),
  },
);

function normalize(s: string) {
  return s.toLowerCase().trim();
}

export function StoreLocator() {
  const [query, setQuery] = useState("");
  const [highlightId, setHighlightId] = useState<string | null>("kilifi");

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return storeBranches;
    return storeBranches.filter((b) => {
      const blob = [
        b.name,
        b.city,
        b.category,
        ...b.addressLines,
        b.phone,
      ]
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    });
  }, [query]);

  useEffect(() => {
    if (filtered.length === 0) {
      setHighlightId(null);
      return;
    }
    setHighlightId((id) =>
      id && filtered.some((b) => b.id === id) ? id : filtered[0].id,
    );
  }, [filtered]);

  const highlight =
    filtered.find((b) => b.id === highlightId) ?? filtered[0] ?? null;

  return (
    <div className="flex min-h-[calc(100dvh-6rem)] w-full flex-col bg-white lg:min-h-[calc(100dvh-8rem)] lg:flex-row">
      <aside className="flex w-full flex-col border-line lg:w-[min(100%,420px)] lg:max-w-md lg:shrink-0 lg:border-r">
        <div className="border-b border-line bg-white px-4 py-4 sm:px-6">
          <label htmlFor="store-search" className="sr-only">
            Search by city, area, or address
          </label>
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <input
                id="store-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="City, postal code, or address"
                className="w-full border border-line bg-white py-2.5 pl-3 pr-9 font-sans text-sm text-ink placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-muted hover:text-ink"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" strokeWidth={2} />
                </button>
              ) : null}
            </div>
            <button
              type="button"
              className="flex h-[42px] w-[42px] shrink-0 items-center justify-center border border-accent bg-cream text-accent transition-colors hover:bg-cream/80"
              aria-label="Use my area (search Kilifi coast)"
              onClick={() => setQuery("kilifi")}
            >
              <Crosshair className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
            <button
              type="button"
              className="inline-flex items-center gap-2 font-sans text-2xs font-semibold uppercase tracking-[0.18em] text-ink transition-opacity hover:opacity-65 sm:text-xs"
            >
              <SlidersHorizontal className="h-4 w-4 text-accent" strokeWidth={1.5} />
              Filters
            </button>
            <p className="font-sans text-2xs text-muted sm:text-xs">
              {filtered.length}{" "}
              {filtered.length === 1 ? "location" : "locations"}
            </p>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-[#f5f5f4] px-3 py-4 sm:px-4 sm:py-5">
          <ul className="flex flex-col gap-3">
            {filtered.map((branch) => (
              <li key={branch.id}>
                <button
                  type="button"
                  onClick={() => setHighlightId(branch.id)}
                  className={`w-full border border-line bg-white p-4 text-left transition-shadow hover:shadow-sm ${
                    highlightId === branch.id
                      ? "ring-2 ring-accent/40 ring-offset-2"
                      : ""
                  } `}
                >
                  <div className="flex items-start gap-2">
                    <MapPin
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-base font-semibold text-ink">
                        {branch.name}
                      </p>
                      <p className="mt-1 font-sans text-2xs uppercase tracking-wide text-muted sm:text-xs">
                        {branch.category}
                      </p>
                      <p className="mt-2 font-sans text-sm leading-[1.65] text-ink">
                        {branch.addressLines.join(", ")}
                        {", "}
                        {branch.city}, Kenya
                      </p>
                      <div className="mt-4 flex border-t border-line">
                        <a
                          href={`tel:${branch.phone.replace(/\s/g, "")}`}
                          className="flex flex-1 items-center justify-center gap-2 border-r border-line py-3 font-sans text-xs text-ink hover:bg-subtle"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Phone className="h-4 w-4" strokeWidth={1.5} />
                          {branch.phone}
                        </a>
                        <Link
                          href={branch.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-1 items-center justify-center gap-1 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-accent hover:bg-subtle"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Go
                        </Link>
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          {filtered.length === 0 ? (
            <p className="px-2 py-8 text-center font-sans text-sm text-muted" role="status">
              No locations match your search. Try Kilifi, Mombasa, or Malindi.
            </p>
          ) : null}
        </div>
      </aside>

      <div className="relative min-h-[420px] flex-1 lg:min-h-0">
        <StoreLocatorMap locations={filtered} highlightId={highlight?.id ?? null} />
      </div>
    </div>
  );
}
