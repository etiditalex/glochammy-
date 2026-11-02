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
    <section id="newsletter" className="w-full bg-cream px-2 pb-6 pt-2" aria-labelledby="notes-heading">
      <div className="mx-auto max-w-[1248px] md:px-3">
        <div className="rounded-2xl bg-white px-4 py-5 shadow-[0_0_0_1px_rgba(232,230,227,1)] sm:px-6 sm:py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <h2
                id="notes-heading"
                className="text-[22px] font-bold leading-tight text-accent sm:text-[32px] sm:leading-none"
              >
                Notes on routine, restock, and salon openings
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                No clutter—just occasional updates you can read in one breath.
              </p>
            </div>
            {sent ? (
              <p className="text-sm text-ink" role="status">
                Thank you. We&apos;ll be in touch shortly.
              </p>
            ) : (
              <form
                onSubmit={onSubmit}
                className="flex w-full max-w-md flex-col gap-2 sm:flex-row sm:items-center"
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
                  placeholder="you@example.com"
                  className="min-h-10 w-full rounded-full border border-line bg-cream px-4 text-sm text-ink placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  required
                />
                <button
                  type="submit"
                  className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-accent px-6 text-sm text-cream hover:bg-[#6f583a]"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
