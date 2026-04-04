"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronRight, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type ShopMegaSectionId = "top" | "innovations" | "fragrance";

const SECTION_ORDER: ShopMegaSectionId[] = ["top", "innovations", "fragrance"];

const SECTIONS: Record<
  ShopMegaSectionId,
  {
    label: string;
    subLinks: { label: string; href: string }[];
    cards: {
      title: string;
      href: string;
      image: string;
      imageAlt: string;
    }[];
  }
> = {
  top: {
    label: "Top recommendations",
    subLinks: [
      { label: "Staff picks", href: "/shop?featured=1" },
      { label: "Gift-ready sets", href: "/shop" },
      { label: "Mini luxuries", href: "/shop" },
      { label: "Your essentials", href: "/shop?featured=1" },
    ],
    cards: [
      {
        title: "Staff picks",
        href: "/shop?featured=1",
        image:
          "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&w=1200&q=88",
        imageAlt: "Skincare bottles on a minimal tray",
      },
      {
        title: "Gift-ready sets",
        href: "/shop",
        image:
          "https://images.unsplash.com/photo-1512496013581-717165624022?auto=format&w=1200&q=88",
        imageAlt: "Curated beauty gift arrangement",
      },
    ],
  },
  innovations: {
    label: "Latest innovations",
    subLinks: [
      { label: "New in skincare", href: "/shop?category=skincare" },
      { label: "Fresh arrivals", href: "/shop" },
      { label: "Tools & devices", href: "/shop" },
      { label: "Limited runs", href: "/shop" },
    ],
    cards: [
      {
        title: "New in skincare",
        href: "/shop?category=skincare",
        image:
          "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&w=1200&q=88",
        imageAlt: "Serum dropper on a clean surface",
      },
      {
        title: "Fresh arrivals",
        href: "/shop",
        image:
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&w=1200&q=88",
        imageAlt: "Makeup and skincare flat lay",
      },
    ],
  },
  fragrance: {
    label: "Fragrance",
    subLinks: [
      { label: "Perfume & eau de parfum", href: "/shop?category=fragrance" },
      { label: "Hair & body mist", href: "/shop?category=fragrance" },
      { label: "Layering favourites", href: "/shop?category=fragrance" },
      { label: "Body care scent", href: "/shop?category=body" },
    ],
    cards: [
      {
        title: "Perfume & eau de parfum",
        href: "/shop?category=fragrance",
        image:
          "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&w=1200&q=88",
        imageAlt: "Fragrance bottle in soft light",
      },
      {
        title: "Body & hair mist",
        href: "/shop?category=fragrance",
        image:
          "https://images.unsplash.com/photo-1595425973797-879d4ae76c20?auto=format&w=1200&q=88",
        imageAlt: "Body mist and bath products",
      },
    ],
  },
};

type ShopMegaMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function ShopMegaMenu({ open, onClose }: ShopMegaMenuProps) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<ShopMegaSectionId>("top");

  useEffect(() => {
    if (open) setActive("top");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const panel = SECTIONS[active];
  const panelEase = [0.22, 1, 0.36, 1] as const;

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            key="shop-backdrop"
            role="presentation"
            className="fixed inset-0 z-[90] bg-ink/15 lg:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            key="shop-panel"
            id="shop-mega-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Products"
            className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain border-t border-line bg-cream pt-safe lg:absolute lg:inset-x-0 lg:bottom-auto lg:left-0 lg:right-0 lg:top-full lg:max-h-[min(88vh,820px)] lg:overflow-y-auto lg:pt-0 lg:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.12)]"
            initial={reduce ? false : { opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: panelEase }}
          >
            <div className="relative w-full min-w-0 px-4 py-10 pb-safe sm:px-8 sm:py-12 lg:px-10 lg:py-14 xl:px-12 2xl:px-16">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-2 top-[max(0.75rem,env(safe-area-inset-top))] flex h-11 w-11 items-center justify-center text-ink transition-opacity hover:opacity-60 sm:right-6 sm:top-6 lg:right-8 lg:top-8"
                aria-label="Close products menu"
              >
                <X className="h-5 w-5" strokeWidth={1.25} />
              </button>

              <div className="grid gap-10 pt-2 lg:grid-cols-[minmax(0,240px)_1fr] lg:gap-0 lg:pt-2">
                <nav
                  aria-label="Product categories"
                  className="border-line lg:border-r lg:pr-10 xl:min-w-[260px] xl:pr-14"
                >
                  <ul className="flex flex-col gap-0">
                    {SECTION_ORDER.map((id) => {
                      const isActive = active === id;
                      return (
                        <li key={id}>
                          <button
                            type="button"
                            onClick={() => setActive(id)}
                            className={`flex w-full min-h-[52px] items-center justify-between gap-2 border-b py-4 text-left text-base font-medium transition-colors first:pt-0 sm:py-5 lg:py-5 lg:text-lg ${
                              isActive
                                ? "border-b-2 border-accent text-ink"
                                : "border-line text-ink hover:text-muted"
                            }`}
                            aria-current={isActive ? "true" : undefined}
                          >
                            <span>{SECTIONS[id].label}</span>
                            {isActive ? (
                              <ChevronRight
                                className="h-5 w-5 shrink-0 text-accent"
                                strokeWidth={1.5}
                                aria-hidden
                              />
                            ) : (
                              <span className="w-5 shrink-0" aria-hidden />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                <div className="min-w-0 lg:pl-10 xl:pl-14">
                  <div className="grid gap-10 md:grid-cols-[minmax(0,200px)_1fr] md:gap-12 lg:gap-14">
                    <nav aria-label={`${panel.label} links`}>
                      <ul className="flex flex-col gap-3 sm:gap-4">
                        {panel.subLinks.map((item) => (
                          <li key={item.label + item.href}>
                            <Link
                              href={item.href}
                              onClick={onClose}
                              className="block font-sans text-sm font-medium text-ink transition-opacity hover:opacity-65 sm:text-base"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </nav>

                    <div className="flex flex-col gap-8 sm:gap-10">
                      {panel.cards.map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          onClick={onClose}
                          className="group block outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
                        >
                          <div className="relative aspect-[16/10] overflow-hidden bg-white">
                            <Image
                              src={item.image}
                              alt={item.imageAlt}
                              fill
                              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                              sizes="(min-width: 1024px) 28vw, 100vw"
                            />
                          </div>
                          <p className="mt-4 text-sm font-medium tracking-wide text-ink">
                            {item.title}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
