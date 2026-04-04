import { FadeIn } from "@/components/motion/fade-in";
import { ButtonLink } from "@/components/ui/button-link";
import { BRAND } from "@/lib/constants";
import { salonServices } from "@/lib/data/services";
import { formatMoney } from "@/lib/format";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Salon services",
  description:
    "Salon services and nails parlour in Kilifi—book treatments and see sample menus online.",
};

export default function SalonPage() {
  return (
    <div className="bg-white">
      <section className="border-b border-line bg-cream">
        <div className="mx-auto min-w-0 max-w-content px-4 py-14 sm:px-8 sm:py-16">
          <FadeIn>
            <p className="text-2xs font-medium uppercase tracking-nav text-muted">
              Salon
            </p>
            <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
              Services
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              Salon services and nails parlour at our Charo Wa Mae location in
              Kilifi. Each visit includes consultation and clear aftercare. Book
              ahead online or call{" "}
              <a
                href={`tel:${BRAND.phone.replace(/\s/g, "")}`}
                className="text-ink underline decoration-1 underline-offset-4"
              >
                {BRAND.phone}
              </a>
              .
            </p>
            <div className="mt-8">
              <ButtonLink href="/booking">Book appointment</ButtonLink>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="mx-auto min-w-0 max-w-content px-4 py-14 sm:px-8 sm:py-16">
        <ul className="grid min-w-0 gap-6 md:grid-cols-2">
          {salonServices.map((s, i) => (
            <FadeIn key={s.id} delay={i * 0.04}>
              <li>
                <article className="flex h-full flex-col border border-line bg-white p-8">
                  <h2 className="font-display text-2xl text-ink">{s.name}</h2>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                    {s.description}
                  </p>
                  <div className="mt-8 flex flex-wrap items-baseline justify-between gap-4 border-t border-line pt-6">
                    <p className="text-2xs uppercase tracking-nav text-muted">
                      {s.durationMinutes} minutes
                    </p>
                    <p className="text-lg font-medium text-ink">
                      {formatMoney(s.priceCents, s.currency)}
                    </p>
                  </div>
                </article>
              </li>
            </FadeIn>
          ))}
        </ul>
      </div>
    </div>
  );
}
