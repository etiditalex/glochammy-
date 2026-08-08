import { BRAND } from "@/lib/constants";
import {
  BadgeCheck,
  Banknote,
  Phone,
  RotateCcw,
  Truck,
} from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type TrustItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  href?: string;
};

const TRUST_ITEMS: TrustItem[] = [
  {
    id: "quality",
    title: "Quality products",
    subtitle: "Curated beauty edit",
    icon: BadgeCheck,
  },
  {
    id: "delivery",
    title: "Fast delivery",
    subtitle: "Kilifi & nationwide",
    icon: Truck,
  },
  {
    id: "cod",
    title: "Pay on delivery",
    subtitle: "Cash or M-Pesa",
    icon: Banknote,
  },
  {
    id: "returns",
    title: "Easy returns",
    subtitle: "Hassle-free support",
    icon: RotateCcw,
  },
];

function whatsappHref(phone: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
}

function TrustCell({ item }: { item: TrustItem }) {
  const Icon = item.icon;
  const inner = (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream/15 text-cream">
        <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-semibold leading-tight text-cream sm:text-[13px]">
          {item.title}
        </span>
        <span className="mt-0.5 block truncate text-[10px] leading-tight text-cream/75 sm:text-2xs">
          {item.subtitle}
        </span>
      </span>
    </>
  );

  if (item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-w-0 items-center gap-2.5"
      >
        {inner}
      </a>
    );
  }

  return <div className="flex min-w-0 items-center gap-2.5">{inner}</div>;
}

/**
 * Top trust strip — Glochammy bronze/cream.
 * Desktop: static row (no JS). Mobile: CSS marquee (no timers / hydration).
 */
export function AnnouncementBar() {
  const callHref = whatsappHref(BRAND.phone);
  const contactItem: TrustItem = {
    id: "contact",
    title: "Call or WhatsApp",
    subtitle: BRAND.phone,
    icon: Phone,
    href: callHref,
  };
  const mobileTrack = [...TRUST_ITEMS, contactItem, ...TRUST_ITEMS, contactItem];

  return (
    <div className="relative overflow-hidden bg-accent text-cream">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-3 bg-cream/25 sm:w-4"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-3 bg-cream/25 sm:w-4"
        aria-hidden
      />

      {/* Mobile: Shop now + CSS marquee (GPU, no React interval) */}
      <div className="relative flex min-h-[48px] items-center gap-3 px-5 py-2 sm:px-6 md:hidden">
        <Link
          href="/shop"
          className="relative z-[2] inline-flex min-h-[36px] shrink-0 items-center justify-center border border-ink bg-ink px-3 text-2xs font-semibold uppercase tracking-nav text-cream"
        >
          Shop now
        </Link>
        <div className="h-7 w-px shrink-0 bg-cream/25" aria-hidden />
        <div className="relative min-w-0 flex-1 overflow-hidden mask-trust-fade">
          <div className="trust-marquee flex w-max items-center gap-8 will-change-transform">
            {mobileTrack.map((item, i) => (
              <div key={`${item.id}-${i}`} className="shrink-0">
                <TrustCell item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop: full static strip */}
      <div className="relative mx-auto hidden min-h-[52px] max-w-[90rem] items-center gap-4 px-6 py-2 md:flex lg:gap-6 lg:px-8">
        <Link
          href="/shop"
          className="inline-flex min-h-[40px] shrink-0 items-center justify-center border border-ink bg-ink px-4 text-2xs font-semibold uppercase tracking-nav text-cream transition-colors hover:bg-ink/90"
        >
          Shop now
        </Link>
        <div className="h-8 w-px shrink-0 bg-cream/30" aria-hidden />
        <ul className="flex min-w-0 flex-1 items-center justify-between gap-4 lg:gap-6">
          {TRUST_ITEMS.map((item) => (
            <li key={item.id} className="min-w-0">
              <TrustCell item={item} />
            </li>
          ))}
          <li className="min-w-0">
            <TrustCell item={contactItem} />
          </li>
        </ul>
      </div>
    </div>
  );
}
