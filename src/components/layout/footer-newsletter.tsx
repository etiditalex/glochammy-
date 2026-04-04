"use client";

import { useState } from "react";

export function FooterNewsletter() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="lg:col-span-5">
      <h2 className="text-2xs font-semibold uppercase tracking-nav text-ink">
        Newsletter
      </h2>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
        Sign up for curated beauty drops, salon updates, and subscriber-only
        offers with your first order—so your skin and style stay luminous,
        nourished, and unmistakably you.
      </p>
      {submitted ? (
        <p className="mt-8 text-sm text-ink" role="status">
          Thank you—you&apos;re on the list.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <label className="block">
            <span className="sr-only">Email address</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="Email address"
              className="w-full border-0 border-b border-line bg-transparent py-2 text-sm text-ink placeholder:text-muted/70 outline-none transition-colors focus:border-ink"
            />
          </label>
          <button
            type="submit"
            className="w-full max-w-xs border border-ink bg-transparent px-8 py-3.5 text-2xs font-semibold uppercase tracking-nav text-ink transition-opacity hover:opacity-70"
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}
