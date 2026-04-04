"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

const LEFT_LINKS: { label: string; href: string }[] = [
  { label: "Story", href: "/our-story" },
  { label: "Brands", href: "/shop" },
  { label: "SPA", href: "/salon" },
  { label: "Commitments", href: "/about#commitments" },
  { label: "Glochammy", href: "/about#glochammy" },
];

const FEATURED: {
  title: string;
  href: string;
  image: string;
  imageAlt: string;
}[] = [
  {
    title: "Our Story",
    href: "/our-story",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&w=1200&q=88",
    imageAlt: "Minimal architecture in warm neutral tones",
  },
  {
    title: "Our Brands",
    href: "/shop",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&w=1200&q=88",
    imageAlt: "Curated beauty products",
  },
];

type UniverseMegaMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function UniverseMegaMenu({ open, onClose }: UniverseMegaMenuProps) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const panelEase = [0.22, 1, 0.36, 1] as const;

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            key="universe-backdrop"
            role="presentation"
            className="fixed inset-0 z-[90] bg-ink/15 lg:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            key="universe-panel"
            id="universe-mega-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Our universe"
            className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain border-t border-line bg-white pt-safe lg:absolute lg:inset-x-0 lg:bottom-auto lg:left-0 lg:right-0 lg:top-full lg:max-h-[min(88vh,820px)] lg:overflow-y-auto lg:pt-0 lg:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.12)]"
            initial={reduce ? false : { opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: panelEase }}
          >
            <div className="relative mx-auto min-w-0 max-w-content px-4 py-10 pb-safe sm:px-8 sm:py-12 lg:py-14 lg:pr-16">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-2 top-[max(0.75rem,env(safe-area-inset-top))] flex h-11 w-11 items-center justify-center text-ink transition-opacity hover:opacity-60 sm:right-6 sm:top-6 lg:right-8 lg:top-8"
                aria-label="Close universe menu"
              >
                <X className="h-5 w-5" strokeWidth={1.25} />
              </button>

              <div className="grid gap-10 pt-2 sm:gap-12 lg:grid-cols-2 lg:gap-16 lg:pt-2">
                <nav aria-label="Universe">
                  <ul className="flex flex-col">
                    {LEFT_LINKS.map((item) => (
                      <li key={item.href + item.label}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="block min-h-[48px] border-b border-line py-3 text-base font-medium leading-snug text-ink transition-colors first:pt-0 last:border-b-0 hover:text-muted sm:py-4 lg:border-b-0 lg:py-5 lg:text-lg"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="flex flex-col gap-10 lg:gap-12">
                  {FEATURED.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      onClick={onClose}
                      className="group block outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-cream">
                        <Image
                          src={item.image}
                          alt={item.imageAlt}
                          fill
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                          sizes="(min-width: 1024px) 40vw, 100vw"
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
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
