import { HeroBannerSlider } from "@/components/home/hero-banner-slider";
import { HeroStaffPicksAd } from "@/components/home/hero-staff-picks-ad";
import { BRAND } from "@/lib/constants";
import type { ProductCategoryOption } from "@/lib/products/categories";
import type { Product } from "@/lib/types/commerce";
import {
  Calendar,
  Droplets,
  Flower2,
  MapPin,
  MessageCircle,
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
] as const;

function whatsappHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

type HeroProps = {
  categories: ProductCategoryOption[];
  staffPicks: Product[];
};

export function Hero({ categories, staffPicks }: HeroProps) {
  const categoryLinks = categories.map((c) => ({
    label: c.name,
    href: `/shop?category=${encodeURIComponent(c.slug)}`,
    icon: CATEGORY_ICONS[c.slug] ?? Store,
  }));

  const navItems = [...categoryLinks, ...EXTRA_NAV];
  const callHref = whatsappHref(BRAND.phone);

  const quickActions = [
    {
      href: callHref,
      external: true as const,
      label: "WhatsApp",
      icon: MessageCircle,
    },
    {
      href: "/locations",
      external: false as const,
      label: "Store",
      icon: MapPin,
    },
    {
      href: "/booking",
      external: false as const,
      label: "Book",
      icon: Calendar,
    },
  ];

  return (
    <section
      className="w-full border-b border-line bg-cream"
      aria-label="Shop homepage"
    >
      <div className="w-full min-w-0 px-2 py-2 sm:px-3 sm:py-3 lg:px-4 lg:py-4">
        <div className="grid min-w-0 grid-cols-1 gap-2 sm:gap-3 lg:grid-cols-[220px_minmax(0,1fr)_240px] xl:grid-cols-[240px_minmax(0,1fr)_260px]">
          {/* Banner first on mobile for LCP */}
          <div className="order-1 overflow-hidden border border-line bg-ink lg:order-2 lg:row-span-1">
            <HeroBannerSlider slides={[...BANNER_SLIDES]} />
          </div>

          {/* Category chips (mobile) / sidebar (desktop) */}
          <div className="order-2 min-w-0 lg:order-1">
            <nav
              aria-label="Shop categories"
              className="flex gap-2 overflow-x-auto overscroll-x-contain snap-x snap-mandatory touch-pan-x lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className="inline-flex min-h-[40px] shrink-0 snap-start items-center gap-1.5 border border-line bg-white px-3 py-2 text-2xs font-medium uppercase tracking-nav text-ink active:bg-subtle"
                  >
                    <Icon
                      className="h-3.5 w-3.5 text-accent"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <aside className="hidden border border-line bg-white lg:block">
              <p className="border-b border-line px-4 py-3 text-2xs font-medium uppercase tracking-nav text-muted">
                Shop by category
              </p>
              <ul className="py-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href + item.label}>
                      <Link
                        href={item.href}
                        className="flex min-h-[44px] items-center gap-3 px-4 py-2.5 text-sm text-ink transition-colors hover:bg-subtle"
                      >
                        <Icon
                          className="h-4 w-4 shrink-0 text-accent"
                          strokeWidth={1.5}
                          aria-hidden
                        />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </aside>
          </div>

          {/* Utilities + staff picks */}
          <div className="order-3 flex min-w-0 flex-col gap-2 sm:gap-3 lg:order-3">
            <div className="grid grid-cols-3 gap-2 lg:hidden">
              {quickActions.map((action) => {
                const Icon = action.icon;
                const className =
                  "flex min-h-[68px] flex-col items-center justify-center gap-1 border border-line bg-white px-2 py-2.5 text-center active:bg-subtle";
                const body = (
                  <>
                    <Icon className="h-5 w-5 text-accent" strokeWidth={1.5} aria-hidden />
                    <span className="text-2xs font-medium uppercase tracking-nav text-ink">
                      {action.label}
                    </span>
                  </>
                );
                return action.external ? (
                  <a
                    key={action.href}
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                  >
                    {body}
                  </a>
                ) : (
                  <Link key={action.href} href={action.href} className={className}>
                    {body}
                  </Link>
                );
              })}
            </div>

            <div className="hidden border border-line bg-white lg:block">
              <ul className="divide-y divide-line">
                <li>
                  <a
                    href={callHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[64px] items-start gap-3 px-4 py-3.5 transition-colors hover:bg-subtle"
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center bg-accent/15 text-accent">
                      <MessageCircle className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-ink">
                        Call to order
                      </span>
                      <span className="mt-0.5 block text-2xs leading-snug text-muted">
                        WhatsApp {BRAND.phone}
                      </span>
                    </span>
                  </a>
                </li>
                <li>
                  <Link
                    href="/locations"
                    className="flex min-h-[64px] items-start gap-3 px-4 py-3.5 transition-colors hover:bg-subtle"
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center bg-subtle text-accent">
                      <MapPin className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-ink">
                        Visit our store
                      </span>
                      <span className="mt-0.5 block text-2xs leading-snug text-muted">
                        {BRAND.addressLine}
                      </span>
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/booking"
                    className="flex min-h-[64px] items-start gap-3 px-4 py-3.5 transition-colors hover:bg-subtle"
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center bg-subtle text-accent">
                      <Calendar className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-ink">
                        Book a treatment
                      </span>
                      <span className="mt-0.5 block text-2xs leading-snug text-muted">
                        Salon &amp; nails appointments
                      </span>
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            <HeroStaffPicksAd products={staffPicks} />
          </div>
        </div>
      </div>
    </section>
  );
}
