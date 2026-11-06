"use client";

import { type FormEvent, useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
  }

  return (
    <section
      id="newsletter"
      className="bg-[#f3f0ea]"
      aria-labelledby="notes-heading"
    >
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-8 sm:py-20">
        <p className="text-2xs font-medium uppercase tracking-nav text-muted">Glochammy</p>
        <h2
          id="notes-heading"
          className="mt-3 font-display text-[2.25rem] leading-none text-ink sm:text-5xl"
        >
          Notes on routine, restock, and salon openings
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink/70 sm:text-base">
          No clutter—just occasional updates you can read in one breath.
        </p>
        {sent ? (
          <p className="mt-8 text-sm text-ink" role="status">
            Thank you. We&apos;ll be in touch shortly.
          </p>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mx-auto mt-8 flex max-w-md items-end gap-3 border-b border-ink/30 pb-2 focus-within:border-ink"
            noValidate
          >
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="min-h-11 w-full bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
              required
            />
            <button
              type="submit"
              className="inline-flex min-h-11 shrink-0 items-center text-xs font-medium uppercase tracking-nav text-ink transition-opacity hover:opacity-60"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
