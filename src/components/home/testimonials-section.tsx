import { FadeIn } from "@/components/motion/fade-in";
import type { Testimonial } from "@/lib/types/commerce";

type TestimonialsSectionProps = {
  items: Testimonial[];
};

export function TestimonialsSection({ items }: TestimonialsSectionProps) {
  return (
    <section className="border-b border-line bg-white py-16 sm:py-20">
      <div className="mx-auto min-w-0 max-w-content px-4 sm:px-8">
        <FadeIn>
          <p className="text-2xs font-medium uppercase tracking-nav text-muted">
            Voices
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
            Trusted by clients who prefer quiet care
          </h2>
        </FadeIn>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {items.map((t, i) => (
            <FadeIn key={t.id} delay={i * 0.05}>
              <figure className="h-full border border-line bg-cream p-6">
                <blockquote className="text-sm leading-relaxed text-ink">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 text-2xs uppercase tracking-nav text-muted">
                  {t.name}
                  <span className="mx-2 text-ink/30">·</span>
                  {t.location}
                </figcaption>
              </figure>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
