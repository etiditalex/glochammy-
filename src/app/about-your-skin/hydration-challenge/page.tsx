import { FadeIn } from "@/components/motion/fade-in";
import { ButtonLink } from "@/components/ui/button-link";
import { BRAND } from "@/lib/constants";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Hydration challenge",
  description: `A gentle ${BRAND.shortName} focus week for barrier-friendly hydration—simple steps, realistic for Kilifi climate and daily life.`,
};

const DAYS = [
  {
    title: "Day 1 — Baseline",
    body: "Gentle cleanse, one hydrating serum or lotion, SPF if morning. Note how skin feels at midday.",
  },
  {
    title: "Day 2–3 — Layering",
    body: "Same cleanse; apply humectant to slightly damp skin, then seal with a cream. No new actives.",
  },
  {
    title: "Day 4–5 — Hold the stripping",
    body: "Skip harsh scrubs and strong foams. Lukewarm water; pat dry; repeat your simple sandwich.",
  },
  {
    title: "Day 6–7 — Review",
    body: "Compare comfort, fine lines from dehydration, and cheek texture. Book follow-up if you want help levelling up.",
  },
];

export default function HydrationChallengePage() {
  const tel = `tel:${BRAND.phone.replace(/\s/g, "")}`;

  return (
    <div className="bg-white">
      <section className="border-b border-line bg-cream">
        <div className="mx-auto min-w-0 max-w-content px-4 py-14 sm:px-8 sm:py-20">
          <FadeIn>
            <p className="text-2xs font-medium uppercase tracking-nav text-muted">
              About your skin
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-ink sm:text-5xl lg:text-6xl">
              Hydration challenge
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              Seven days dedicated to respectful hydration: strengthen your
              barrier, reduce that tight midday feeling, and see what your skin
              does when it is not fighting you.
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="mx-auto min-w-0 max-w-content px-4 py-14 sm:px-8 sm:py-20">
        <div className="grid min-w-0 gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
          <FadeIn>
            <div className="relative aspect-[4/5] bg-subtle">
              <Image
                src="https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&w=2400&q=88"
                alt="Water splash and freshness"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 480px, 100vw"
              />
            </div>
          </FadeIn>
          <div className="space-y-10">
            <FadeIn>
              <h2 className="font-display text-3xl text-ink sm:text-4xl">
                Who it is for
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
                Anyone who reaches for heavy products but still feels dry, or
                who has scaled back actives and wants a steady foundation. If
                you are on prescription topicals, run the plan past your
                prescriber first.
              </p>
            </FadeIn>
            <FadeIn>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">
                What you will notice
              </h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted sm:text-base">
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  Less stinging when the wind hits or the AC runs.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  Makeup and SPF sitting more evenly.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  A clearer sense of which products actually help.
                </li>
              </ul>
            </FadeIn>
          </div>
        </div>

        <FadeIn className="mt-20 border-t border-line pt-16 sm:mt-24 sm:pt-20">
          <h2 className="text-center font-display text-3xl text-ink sm:text-4xl">
            Seven-day focus
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-muted sm:text-base">
            Adjust timings to your schedule; consistency beats perfection. Use
            products you already own where possible—we can help fill gaps in
            store or after a quick consult.
          </p>
          <ul className="mx-auto mt-12 grid max-w-3xl gap-6 sm:gap-8">
            {DAYS.map((d, i) => (
              <li
                key={d.title}
                className="flex gap-4 border border-line bg-subtle px-5 py-6 sm:gap-6 sm:px-8 sm:py-7"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-ink text-sm font-medium text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg text-ink sm:text-xl">
                    {d.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                    {d.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn className="mt-16 sm:mt-20">
          <div className="relative mx-auto aspect-[21/9] max-w-4xl bg-subtle sm:aspect-[2/1]">
            <Image
              src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&w=2000&q=88"
              alt="Dewy skin texture in soft light"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 896px, 100vw"
            />
          </div>
        </FadeIn>

        <FadeIn className="mt-16 flex flex-wrap justify-center gap-4 sm:mt-20">
          <ButtonLink href="/contact">Tell us you are in</ButtonLink>
          <ButtonLink href="/shop" variant="secondary">
            Hydrating picks
          </ButtonLink>
          <ButtonLink
            href="/about-your-skin/online-consultation"
            variant="ghost"
          >
            Need a consult first?
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
