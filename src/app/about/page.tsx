import { FadeIn } from "@/components/motion/fade-in";
import {
  BRAND,
  RETAIL_DEPARTMENTS,
  SERVICE_DEPARTMENTS,
} from "@/lib/constants";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description:
    "Glochammy in Kilifi—retail, salon services, and a nails parlour under one roof.",
};

export default function AboutPage() {
  const tel = `tel:${BRAND.phone.replace(/\s/g, "")}`;

  return (
    <div className="bg-white">
      <section className="border-b border-line bg-cream">
        <div className="mx-auto min-w-0 max-w-content px-4 py-14 sm:px-8 sm:py-16">
          <FadeIn>
            <p className="text-2xs font-medium uppercase tracking-nav text-muted">
              About
            </p>
            <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
              {BRAND.shortName}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              {BRAND.tagline}
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="mx-auto min-w-0 max-w-content px-4 py-14 sm:px-8 sm:py-20">
        <div className="grid min-w-0 gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <FadeIn>
            <div className="relative aspect-[4/5] bg-subtle">
              <Image
                src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&w=2400&q=88"
                alt="Minimal studio shelf with botanicals"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 480px, 100vw"
              />
            </div>
          </FadeIn>
          <div className="space-y-10">
            <FadeIn>
              <section id="skin" className="scroll-mt-32">
                <h2 className="font-display text-3xl text-ink">About your skin</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  We stock {RETAIL_DEPARTMENTS[0].toLowerCase()}, makeup,
                  hair—including wigs—nail essentials, fragrance, body care, and
                  the tools you need to maintain your look at home.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  Whether you are building a simple routine or replenishing
                  favourites, our team can point you to products that suit your
                  skin and style.
                </p>
              </section>
            </FadeIn>
            <FadeIn>
              <section id="universe" className="scroll-mt-32">
                <h2 className="font-display text-3xl text-ink">Our universe</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {BRAND.name} brings together retail and in-house care:{" "}
                  {SERVICE_DEPARTMENTS.join(" and ").toLowerCase()}, so you can
                  shop, get styled, and care for your nails without running all
                  over town.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  Find us in {BRAND.addressLine}. Questions or bookings? Call{" "}
                  <a href={tel} className="text-ink underline underline-offset-4">
                    {BRAND.phone}
                  </a>
                  .
                </p>
              </section>
            </FadeIn>
            <FadeIn>
              <section id="commitments" className="scroll-mt-32 border-t border-line pt-10">
                <h2 className="font-display text-3xl text-ink">Commitments</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  We stand behind honest advice, fair pricing, and products we
                  would use ourselves. Our team trains continuously so home care
                  and in-salon results stay aligned—and we listen when something
                  is not working for you.
                </p>
              </section>
            </FadeIn>
            <FadeIn>
              <section id="glochammy" className="scroll-mt-32 border-t border-line pt-10">
                <h2 className="font-display text-3xl text-ink">Glochammy</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  The heart of our house: celebrating confidence in Kilifi through
                  accessible beauty education, thoughtful retail, and a welcoming
                  space for every client who walks through our door.
                </p>
              </section>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
