import { FALLBACK_PRODUCT_IMAGE_URL } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

export type HomeCategoryTile = {
  slug: string;
  name: string;
  href: string;
  image: string;
};

type HomeCategoriesProps = {
  categories: HomeCategoryTile[];
};

export function HomeCategories({ categories }: HomeCategoriesProps) {
  if (!categories.length) return null;

  return (
    <section className="bg-white" aria-labelledby="home-categories-heading">
      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-8 sm:py-16">
        <p className="text-center text-2xs font-medium uppercase tracking-nav text-muted">
          Shop
        </p>
        <h2
          id="home-categories-heading"
          className="mt-3 text-center font-display text-[2.25rem] leading-none text-ink sm:text-5xl"
        >
          Shop by category
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:mt-10 sm:gap-x-5 md:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={category.href}
              className="group block outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              <span className="relative block aspect-square overflow-hidden bg-[#f4f2ef]">
                <Image
                  src={category.image || FALLBACK_PRODUCT_IMAGE_URL}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 280px, 46vw"
                  quality={75}
                  className="object-cover transition duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </span>
              <span className="mt-3 block text-center text-xs font-medium uppercase tracking-nav text-ink">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
