import { FadeIn } from "@/components/motion/fade-in";
import { FALLBACK_PRODUCT_IMAGE_URL } from "@/lib/constants";
import type { Product } from "@/lib/types/commerce";
import Image from "next/image";
import Link from "next/link";

type FeaturedProductHighlightsProps = {
  products: Product[];
};

/** Soft Glochammy bronze / cream diagonals. */
const CIRCLE_TONES = [
  { stripe: "#8b6f4a", field: "#faf9f7" },
  { stripe: "#a68968", field: "#f6f5f3" },
  { stripe: "#6f583a", field: "#faf9f7" },
  { stripe: "#9a8060", field: "#ffffff" },
  { stripe: "#8b6f4a", field: "#f0ede8" },
  { stripe: "#b39a7a", field: "#faf9f7" },
] as const;

export function FeaturedProductHighlights({
  products,
}: FeaturedProductHighlightsProps) {
  const highlights = products.slice(0, 12);
  if (!highlights.length) return null;

  return (
    <section
      className="w-full border-b border-line bg-subtle py-8 sm:py-12 lg:py-16"
      aria-label="Featured product highlights"
    >
      <div className="w-full min-w-0 px-3 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="grid grid-cols-3 gap-x-2 gap-y-6 sm:grid-cols-4 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-6 lg:gap-x-6 lg:gap-y-12">
            {highlights.map((product, i) => {
              const tone = CIRCLE_TONES[i % CIRCLE_TONES.length]!;
              const cover = product.images[0] ?? FALLBACK_PRODUCT_IMAGE_URL;
              return (
                <Link
                  key={product.id}
                  href={`/shop/${product.slug}`}
                  className={`group flex min-w-0 flex-col items-center text-center outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 ${
                    i >= 8
                      ? "hidden lg:flex"
                      : i >= 6
                        ? "hidden sm:flex"
                        : ""
                  }`}
                >
                  <span
                    className="relative aspect-square w-full max-w-[5.75rem] overflow-hidden rounded-full shadow-sm transition-transform duration-300 ease-out group-hover:scale-[1.03] active:scale-[0.98] motion-reduce:transition-none motion-reduce:group-hover:scale-100 min-[400px]:max-w-[7rem] sm:max-w-[11rem] lg:max-w-[12.5rem]"
                    style={{
                      background: `linear-gradient(135deg, ${tone.field} 0%, ${tone.field} 42%, ${tone.stripe} 42%, ${tone.stripe} 100%)`,
                    }}
                  >
                    <span className="absolute inset-[10%] sm:inset-[12%]">
                      <Image
                        src={cover}
                        alt={product.name}
                        fill
                        sizes="(min-width: 1024px) 12vw, (min-width: 640px) 18vw, 30vw"
                        className="object-contain p-0.5 drop-shadow-sm sm:p-1"
                        priority={i < 3}
                        loading={i < 3 ? "eager" : "lazy"}
                      />
                    </span>
                  </span>
                  <span className="mt-2 line-clamp-2 max-w-[7.5rem] text-[11px] font-medium leading-snug text-ink sm:mt-3 sm:max-w-[11rem] sm:text-sm">
                    {product.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
