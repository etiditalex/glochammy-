import { FadeIn } from "@/components/motion/fade-in";
import { ButtonLink } from "@/components/ui/button-link";
import { BRAND } from "@/lib/constants";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Skin diagnosis",
  description: `Understand your skin type and concerns with ${BRAND.shortName} in Kilifi—thoughtful assessment before any treatment or routine change.`,
};

export default function SkinDiagnosisPage() {
  const tel = `tel:${BRAND.phone.replace(/\s/g, "")}`;

  return (
    <div className="bg-white">
      <section
        aria-label="Skin diagnosis"
        className="relative min-h-[280px] w-full border-b border-line sm:min-h-[min(70vh,820px)]"
      >
        <Image
          src="https://res.cloudinary.com/dyfnobo9r/image/upload/v1775137209/skincare_diagnosis_vazleh.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </section>

      <section className="border-b border-line bg-white px-4 py-16 sm:px-8 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <FadeIn>
            <h1 className="font-sans text-sm font-light uppercase leading-tight tracking-[0.08em] text-ink sm:text-base sm:tracking-[0.1em] md:text-lg lg:text-xl lg:tracking-[0.12em]">
              In our treatment room, your skin&apos;s needs revealed
            </h1>
            <p className="mx-auto mt-4 text-base font-normal leading-normal text-muted sm:mt-5 sm:text-lg">
              Professional in-person skin analysis at {BRAND.shortName}.
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="mx-auto min-w-0 max-w-content px-4 py-14 sm:px-8 sm:py-20">
        <div className="grid min-w-0 gap-14 lg:grid-cols-2 lg:items-start lg:gap-20">
          <div className="space-y-10 lg:order-1">
            <FadeIn>
              <h2 className="font-display text-3xl text-ink sm:text-4xl">
                Why it matters
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
                Many routines fail because they address the wrong layer of the
                problem—over-exfoliating a dehydrated barrier, or fighting
                bumps that need professional extraction, not stronger acids.
                Diagnosis is the map; products and facials are the vehicle.
              </p>
            </FadeIn>
            <FadeIn>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">
                What we observe
              </h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted sm:text-base">
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  Texture, visible pores, and areas of tightness or shine.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  Redness, flaking, or post-inflammatory marks.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  How your skin responds to cleansing and light moisture during
                  the visit.
                </li>
              </ul>
            </FadeIn>
          </div>
          <FadeIn className="lg:order-2">
            <div className="relative aspect-[4/5] bg-subtle">
              <Image
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&w=2400&q=88"
                alt="Close, respectful view of facial skin in neutral light"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 480px, 100vw"
              />
            </div>
          </FadeIn>
        </div>

        <FadeIn className="mt-20 border-t border-line pt-16 sm:mt-24 sm:pt-20">
          <div className="grid min-w-0 gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="relative aspect-[16/10] bg-subtle lg:order-2">
              <Image
                src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&w=1600&q=88"
                alt="Spa treatment room detail"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
            </div>
            <div className="lg:order-1">
              <h2 className="font-display text-2xl text-ink sm:text-3xl">
                After your assessment
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
                You leave with clarity: what to pause, what to introduce slowly,
                and which salon services (if any) support the plan. We prefer
                fewer steps done consistently over a crowded shelf that
                overwhelms your skin.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
                For concerns that need a dermatologist, we say so plainly and
                help you document what you have tried.
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn className="mt-16 sm:mt-20">
          <blockquote className="mx-auto max-w-3xl border border-line bg-subtle px-6 py-10 text-center sm:px-10 sm:py-12">
            <p className="font-display text-xl leading-snug text-ink sm:text-2xl">
              “Good skin work starts with seeing the skin—not the trend cycle.”
            </p>
            <footer className="mt-6 text-2xs font-medium uppercase tracking-nav text-muted">
              — {BRAND.shortName} treatment room
            </footer>
          </blockquote>
        </FadeIn>

        <FadeIn className="mt-16 flex flex-wrap justify-center gap-4 sm:mt-20">
          <ButtonLink href="/booking">Book assessment</ButtonLink>
          <ButtonLink href="/salon" variant="secondary">
            View salon services
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghost">
            Ask a question
          </ButtonLink>
        </FadeIn>

        <FadeIn className="mt-12 text-center text-sm text-muted">
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
