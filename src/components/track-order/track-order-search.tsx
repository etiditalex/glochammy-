"use client";

import { Search } from "lucide-react";
import { type FormEvent, useState } from "react";

export function TrackOrderSearch() {
  const [q, setQ] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const el = document.getElementById("track-order-main");
    if (q.trim() && el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full border-b border-line bg-white px-4 py-6 sm:px-8 md:px-10 lg:px-12 2xl:px-16"
    >
      <div className="mx-auto flex w-full max-w-4xl gap-0 shadow-sm ring-1 ring-line">
        <label htmlFor="track-help-search" className="sr-only">
          Search help topics
        </label>
        <input
          id="track-help-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="I'm looking for..."
          className="min-w-0 flex-1 border-0 bg-white px-4 py-3.5 font-sans text-sm text-ink placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-orange-600 sm:text-base"
        />
        <button
          type="submit"
          className="flex w-14 shrink-0 items-center justify-center bg-white text-ink ring-1 ring-inset ring-line transition-colors hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          aria-label="Search"
        >
          <Search className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>
    </form>
  );
}
