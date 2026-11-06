import { HeroBannerSlider } from "@/components/home/hero-banner-slider";
import type { ProductCategoryOption } from "@/lib/products/categories";
import {
  Calendar,
  Droplets,
  Flower2,
  MapPin,
  Package,
  Scissors,
  Sparkles,
  Store,
  Wind,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  skincare: Droplets,
  hair: Scissors,
  body: Sparkles,
  fragrance: Wind,
  makeup: Flower2,
  nails: Sparkles,
};

const EXTRA_NAV: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "All products", href: "/shop", icon: Package },
  { label: "Salon services", href: "/salon", icon: Scissors },
  { label: "Book a treatment", href: "/booking", icon: Calendar },
  { label: "Store locator", href: "/locations", icon: MapPin },
];

const BANNER_SLIDES = [
  {
    src: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1778505444/hero_sect_xr2zl2.jpg",
    alt: "Glochammy Beauty skincare and beauty products",
    href: "/shop",
  },
  {
    src: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1778506325/scroll_tl7e15.jpg",
    alt: "Glochammy Beauty freshness and confidence banner",
    href: "/shop?category=hair",
  },
  {
    src: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1778506805/scrollor_cnhzsh.jpg",
    alt: "Glochammy Beauty premium care banner",
    href: "/booking",
  },
  {
    src: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&w=1600&q=80",
    alt: "Glochammy Beauty skincare products",
    href: "/shop?category=skincare",
  },
  {
    src: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&w=1600&q=80",
    alt: "Glochammy Beauty perfumes",
    href: "/shop?category=fragrance",
  },
  {
    src: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&w=1600&q=80",
    alt: "Glochammy Beauty watches",
    href: "/shop",
  },
] as const;

type HeroProps = {
  categories: ProductCategoryOption[];
};

export function Hero({ categories }: HeroProps) {
  const categoryLinks = categories.map((c) => ({
    label: c.name,
    href: `/shop?category=${encodeURIComponent(c.slug)}`,
    icon: CATEGORY_ICONS[c.slug] ?? Store,
  }));

  const navItems = [...categoryLinks, ...EXTRA_NAV];

  return (
    <section className="w-full bg-cream" aria-label="Shop homepage">
      <nav aria-label="Shop categories" className="bg-white">
        <div className="mx-auto flex max-w-[1248px] touch-pan-x gap-0 overflow-x-auto overscroll-x-contain px-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                className="my-0.5 inline-flex shrink-0 items-center whitespace-nowrap px-1.5 py-1.5 text-base font-normal text-ink hover:bg-subtle"
              >
                <Icon
                  className="mr-1.5 h-5 w-5 shrink-0 text-muted"
                  strokeWidth={1.75}
                  aria-hidden
                />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="mx-auto max-w-[1248px] px-2 pb-2 pt-4 md:px-5">
        <HeroBannerSlider slides={[...BANNER_SLIDES]} />
      </div>
    </section>
  );
}
