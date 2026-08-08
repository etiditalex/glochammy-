"use client";

import { BRAND } from "@/lib/constants";
import {
  BadgeCheck,
  Banknote,
  Phone,
  RotateCcw,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type ComponentType } from "react";

type TrustItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number | string }>;
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
  return (
    <div className="flex min-w-0 items-center gap-2.5">
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
    </div>
  );
}

function ShopNowButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/shop"
      className={`inline-flex min-h-[36px] shrink-0 items-center justify-center border border-ink bg-ink px-3.5 text-2xs font-semibold uppercase tracking-nav text-cream transition-colors hover:bg-ink/90 active:bg-ink/80 ${className}`}
    >
      Shop now
    </Link>
  );
}

/**
 * Top trust strip — Glochammy bronze/cream palette.
 * Desktop: full row. Mobile: Shop now + auto-sliding benefit cards.
 */
export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const callHref = whatsappHref(BRAND.phone);

  const slides: TrustItem[] = [
    ...TRUST_ITEMS,
    {
      id: "contact",
      title: "Call or WhatsApp",
      subtitle: BRAND.phone,
      icon: Phone,
    },
  ];

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reducedMotion || slides.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [reducedMotion, slides.length]);

  const active = slides[index]!;

  return (
    <div className="relative overflow-hidden bg-accent text-cream">
      {/* Soft cream end caps — mirrors the screenshot shape, brand-toned */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-cream/25 sm:w-4"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-3 bg-cream/25 sm:w-4"
        aria-hidden
      />

      {/* Mobile: shop CTA + sliding trust item */}
      <div className="relative flex min-h-[52px] items-center gap-3 px-5 py-2.5 sm:px-6 md:hidden">
        <ShopNowButton />
        <div className="h-8 w-px shrink-0 bg-cream/25" aria-hidden />
        <div className="relative min-h-[36px] min-w-0 flex-1 overflow-hidden">
          {active.id === "contact" ? (
            <a
              key={active.id}
              href={callHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex animate-[page-enter_0.35s_ease-out] items-center gap-2.5"
              aria-label={`Call or WhatsApp ${BRAND.phone}`}
            >
              <TrustCell item={active} />
            </a>
          ) : (
            <div
              key={active.id}
              className="animate-[page-enter_0.35s_ease-out]"
            >
              <TrustCell item={active} />
            </div>
          )}
        </div>
        <div className="flex shrink-0 gap-1" aria-hidden>
          {slides.map((s, i) => (
            <span
              key={s.id}
              className={`h-1 rounded-full transition-[width,background-color] ${
                i === index ? "w-3 bg-cream" : "w-1 bg-cream/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop / tablet: full trust strip */}
      <div className="relative mx-auto hidden min-h-[56px] max-w-[90rem] items-center gap-4 px-6 py-2.5 md:flex lg:gap-6 lg:px-8">
        <ShopNowButton className="min-h-[40px] px-4" />
        <div className="h-8 w-px shrink-0 bg-cream/30" aria-hidden />
        <ul className="flex min-w-0 flex-1 items-center justify-between gap-4 lg:gap-6">
          {TRUST_ITEMS.map((item) => (
            <li key={item.id} className="min-w-0">
              <TrustCell item={item} />
            </li>
          ))}
          <li className="min-w-0">
            <a
              href={callHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-w-0 items-center gap-2.5 transition-opacity hover:opacity-90"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream/15 text-cream">
                <Phone className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold leading-tight text-cream lg:text-[13px]">
                  Call or WhatsApp
                </span>
                <span className="mt-0.5 block text-[11px] font-medium tabular-nums text-cream/90 lg:text-xs">
                  {BRAND.phone}
                </span>
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
