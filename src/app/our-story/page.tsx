import { FadeIn } from "@/components/motion/fade-in";
import { ButtonLink } from "@/components/ui/button-link";
import { BRAND } from "@/lib/constants";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Our Story",
  description: `How ${BRAND.shortName} came to be—beauty retail, salon care, and nails in ${BRAND.region}.`,
};

export default function OurStoryPage() {
  const tel = `tel:${BRAND.phone.replace(/\s/g, "")}`;

  return (
    <div className="bg-white">
      <section className="border-b border-line bg-cream">
        <div className="mx-auto min-w-0 max-w-content px-4 py-14 sm:px-8 sm:py-20">
          <FadeIn>
            <p className="text-2xs font-medium uppercase tracking-nav text-muted">
              Our story
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-ink sm:text-5xl lg:text-6xl">
              Rooted in Kilifi, built for everyday confidence.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
              {BRAND.name} started from a simple belief: everyone deserves one
              calm place to shop, get styled, and feel like themselves—without
              chasing trends or crossing county lines.
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="mx-auto min-w-0 max-w-content px-4 py-14 sm:px-8 sm:py-20">
        <div className="grid min-w-0 gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
          <FadeIn>
            <div className="relative aspect-[4/5] bg-subtle lg:order-2">
              <Image
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&w=2400&q=88"
                alt="Quiet, minimal interior"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 480px, 100vw"
              />
            </div>
          </FadeIn>
          <div className="space-y-8 lg:order-1">
            <FadeIn>
              <h2 className="font-display text-3xl text-ink sm:text-4xl">
                One roof, many rituals
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
                We brought skincare, makeup, hair—including wigs—nails, fragrance,
                body care, and professional tools under one roof so your routine
                can grow with you. When you need a facial, a blowout, or time at
                the nails parlour, the same team already knows your preferences.
              </p>
            </FadeIn>
            <FadeIn>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">
                Charo Wa Mae
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
                Our home is {BRAND.addressLine}. We chose this corner of Kilifi
                to stay close to the community we serve—easy to find, near
                Msenangu Butchery, with room to welcome walk-ins and appointments
                alike.
              </p>
            </FadeIn>
          </div>
        </div>

        <FadeIn className="mt-20 border-t border-line pt-16 sm:mt-24 sm:pt-20">
          <blockquote className="mx-auto max-w-3xl text-center">
            <p className="font-display text-2xl leading-snug text-ink sm:text-3xl">
              “We are not here to overwhelm—we are here to listen, recommend
              honestly, and leave you a little lighter on your feet.”
            </p>
            <footer className="mt-8 text-2xs font-medium uppercase tracking-nav text-muted">
              — {BRAND.shortName}
            </footer>
          </blockquote>
        </FadeIn>

        <FadeIn className="mt-16 flex flex-wrap gap-4 sm:mt-20">
          <ButtonLink href="/shop">Explore products</ButtonLink>
          <ButtonLink href="/booking" variant="secondary">
            Book a visit
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghost">
            Contact us
          </ButtonLink>
        </FadeIn>

        <FadeIn className="mt-12 text-sm text-muted">
          <span className="font-medium text-ink">Call </span>
          <a href={tel} className="text-ink underline underline-offset-4">
            {BRAND.phone}
          </a>
          <span className="mx-2 text-line" aria-hidden>
            ·
          </span>
          <span>{BRAND.addressLine}</span>
        </FadeIn>
      </div>
    </div>
  );
}
