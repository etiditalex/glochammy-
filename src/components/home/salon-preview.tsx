import { FadeIn } from "@/components/motion/fade-in";
import { ButtonLink } from "@/components/ui/button-link";
import { BRAND } from "@/lib/constants";
import type { SalonService } from "@/lib/types/commerce";
import { formatMoney } from "@/lib/format";

type SalonPreviewProps = {
  services: SalonService[];
};

export function SalonPreview({ services }: SalonPreviewProps) {
  const preview = services.slice(0, 3);
  return (
    <section className="border-b border-line bg-subtle py-16 sm:py-20">
      <div className="mx-auto min-w-0 max-w-content px-4 sm:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-2xs font-medium uppercase tracking-nav text-muted">
              In the treatment room
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              Salon &amp; nails
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted">
              Salon treatments plus our nails parlour in {BRAND.region}—unhurried
              care and clear pricing.
            </p>
          </div>
        </FadeIn>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {preview.map((s, i) => (
            <FadeIn key={s.id} delay={i * 0.05}>
              <article className="flex h-full flex-col border border-line bg-white p-6 text-center sm:text-left">
                <h3 className="text-base font-medium text-ink">{s.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                  {s.description}
                </p>
                <div className="mt-6 flex flex-col items-center gap-2 border-t border-line pt-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <p className="text-sm text-muted">{s.durationMinutes} minutes</p>
                  <p className="text-sm font-medium text-ink">
                    {formatMoney(s.priceCents, s.currency)}
                  </p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
        <FadeIn className="mt-10 flex justify-center">
          <ButtonLink href="/salon" variant="secondary">
            Explore services
          </ButtonLink>
        </FadeIn>
      </div>
    </section>
  );
}
