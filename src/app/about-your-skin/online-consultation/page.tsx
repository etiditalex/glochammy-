import { FadeIn } from "@/components/motion/fade-in";
import { ButtonLink } from "@/components/ui/button-link";
import { BRAND } from "@/lib/constants";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Online skin consultation",
  description: `Book a guided skincare conversation with ${BRAND.shortName}—goals, routine tweaks, and honest product guidance from Kilifi.`,
};

const NUMBERED_STEPS: {
  title: string;
  body: string;
}[] = [
  {
    title: "What to expect",
    body: "We start with how your skin feels day to day—comfort, breakouts, dryness, sensitivity—and what you already use. Then we map a simple order of steps (cleanse, treat, moisturise, protect) that fits your budget and time.",
  },
  {
    title: "Reach out",
    body: "Reach out by phone or WhatsApp with a short note on your goals.",
  },
  {
    title: "Schedule the call",
    body: "We agree a time for a voice or video call that suits you.",
  },
  {
    title: "Your written summary",
    body: "After the call, you receive a written summary: priorities, optional product ideas from our shelves, and what to revisit in a few weeks.",
  },
];

export default function OnlineConsultationPage() {
  const tel = `tel:${BRAND.phone.replace(/\s/g, "")}`;

  return (
    <div className="bg-white">
      <section
        aria-label="Online consultation"
        className="border-b border-line bg-white px-4 py-20 text-center sm:px-8 sm:py-28 lg:py-32"
      >
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <h1 className="font-sans text-3xl font-light leading-snug tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
              Your personalized online skin consultation
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base font-normal leading-relaxed text-muted">
              From the comfort of your home, get practical advice from our{" "}
              {BRAND.shortName} team in {BRAND.region}—so you can build a routine
              that fits your skin, budget, and daily life.
            </p>
            <p className="mx-auto mt-8 max-w-2xl text-base font-semibold leading-relaxed text-ink sm:text-lg">
              Online · Voice or video · Written follow-up
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                href="/contact"
                className="inline-flex min-h-[52px] items-center justify-center border border-accent bg-transparent px-10 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:bg-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                Make an appointment
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="mx-auto min-w-0 max-w-content px-4 py-16 sm:px-8 sm:py-20 lg:py-24">
        <div className="grid min-w-0 gap-12 lg:grid-cols-12 lg:items-start lg:gap-x-10 xl:gap-x-14">
          <FadeIn className="lg:col-span-5">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-md bg-subtle lg:mx-0 lg:max-w-none lg:aspect-[4/5]">
              <Image
                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&w=2000&q=88"
                alt="Calm skincare moment—hands gently touching the face"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 42vw, (min-width: 640px) 80vw, 100vw"
              />
            </div>
          </FadeIn>

          <div className="min-w-0 bg-white lg:col-span-7 lg:pt-2">
            <FadeIn>
              <h2 className="text-left font-sans text-2xl font-light leading-snug text-ink sm:text-3xl lg:text-4xl">
                Discover the {BRAND.shortName} Online Consultation:
              </h2>
            </FadeIn>

            <ul className="mt-10 flex flex-col gap-12 text-left sm:mt-12 sm:gap-14 lg:mt-14 lg:gap-16">
              {NUMBERED_STEPS.map((step, i) => (
                <FadeIn key={step.title}>
                  <li className="grid grid-cols-[auto_1fr] items-start gap-6 sm:gap-8 lg:gap-10">
                    <span
                      className="select-none font-sans text-5xl font-extralight tabular-nums leading-none text-[#d1d5db] sm:text-6xl lg:text-7xl"
                      aria-hidden
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 pt-1">
                      <h3 className="inline-block font-sans text-base font-medium text-ink underline decoration-ink decoration-1 underline-offset-[0.35rem]">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                        {step.body}
                      </p>
                    </div>
                  </li>
                </FadeIn>
              ))}
            </ul>
          </div>
        </div>

        <FadeIn className="mt-20 rounded-sm border border-line bg-subtle px-6 py-10 sm:mt-24 sm:px-10 sm:py-12">
          <p className="text-center font-display text-xl leading-snug text-ink sm:text-2xl">
            This is educational guidance, not a substitute for an in-person
            medical examination when something needs a doctor&apos;s eye.
          </p>
        </FadeIn>

        <FadeIn className="mt-16 flex flex-wrap justify-center gap-4 sm:mt-20">
          <ButtonLink href="/contact">Start with contact</ButtonLink>
          <ButtonLink href="/booking" variant="secondary">
            Book in-salon
          </ButtonLink>
          <ButtonLink href="/shop" variant="ghost">
            Browse products
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
