"use client";

import { FadeIn } from "@/components/motion/fade-in";
import { ButtonPush } from "@/components/ui/button-push";
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
    <section id="newsletter" className="bg-ink text-white">
      <div className="mx-auto min-w-0 max-w-content px-4 py-16 sm:px-8 sm:py-20">
        <FadeIn>
          <p className="text-2xs font-medium uppercase tracking-nav text-white/60">
            Correspondence
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            Notes on routine, restock, and salon openings
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75">
            No clutter—just occasional updates you can read in one breath.
          </p>
        </FadeIn>
        <FadeIn className="mt-10">
          {sent ? (
            <p className="text-sm text-white/80" role="status">
              Thank you. We&apos;ll be in touch shortly.
            </p>
          ) : (
            <form
              onSubmit={onSubmit}
              className="flex max-w-md flex-col gap-3 sm:flex-row sm:items-stretch"
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
                className="min-h-[48px] flex-1 border border-white/25 bg-transparent px-4 text-base text-white placeholder:text-white/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                required
              />
              <ButtonPush
                type="submit"
                variant="secondary"
                className="border-white text-white hover:bg-white hover:text-ink"
              >
                Subscribe
              </ButtonPush>
            </form>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
