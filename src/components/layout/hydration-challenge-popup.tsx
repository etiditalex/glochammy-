"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";

const MOSAIC = {
  large: {
    src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&w=1200&q=85",
    alt: "Calm spa moment with robe and skincare on a bed tray",
  },
  topRight: {
    src: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&w=800&q=85",
    alt: "Glass bottles of water with citrus and mint",
  },
  bottomRight: {
    src: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&w=800&q=85",
    alt: "Notebook, pen, and herbal tea on a white table",
  },
} as const;

export function HydrationChallengePopup() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  const dismiss = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  /** Show again on every page (route) the user visits */
  useEffect(() => {
    if (!mounted) return;
    setOpen(true);
  }, [mounted, pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  if (!mounted) return null;

  const panelEase = [0.22, 1, 0.36, 1] as const;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key={`hydration-challenge-popup-${pathname}`}
          className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-8"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <button
            type="button"
            aria-label="Close promotion"
            className="absolute inset-0 bg-ink/45"
            onClick={dismiss}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-[1] flex max-h-[min(92dvh,880px)] w-full max-w-lg flex-col overflow-hidden border border-line bg-white shadow-[0_32px_64px_-32px_rgba(0,0,0,0.35)]"
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.32, ease: panelEase }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative shrink-0 bg-white">
              <button
                type="button"
                onClick={dismiss}
                className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center bg-ink text-white transition-opacity hover:opacity-90"
                aria-label="Close"
              >
                <X className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </button>

              <div
                className="grid h-[min(38vh,320px)] grid-cols-2 gap-1 bg-white p-1 sm:h-[min(42vh,380px)]"
                style={{ gridTemplateRows: "repeat(2, minmax(0, 1fr))" }}
              >
                <div className="relative col-span-1 row-span-2 h-full min-h-0 overflow-hidden bg-cream">
                  <Image
                    src={MOSAIC.large.src}
                    alt={MOSAIC.large.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 512px) 256px, 45vw"
                    priority
                  />
                </div>
                <div className="relative h-full min-h-0 overflow-hidden bg-cream">
                  <Image
                    src={MOSAIC.topRight.src}
                    alt={MOSAIC.topRight.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 512px) 256px, 45vw"
                  />
                </div>
                <div className="relative h-full min-h-0 overflow-hidden bg-cream">
                  <Image
                    src={MOSAIC.bottomRight.src}
                    alt={MOSAIC.bottomRight.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 512px) 256px, 45vw"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 sm:py-12">
              <h2
                id={titleId}
                className="text-balance text-center font-sans text-xl font-semibold leading-snug tracking-tight text-ink sm:text-2xl"
              >
                Join the Glochammy Hydration Challenge
              </h2>
              <p className="mx-auto mt-5 max-w-md text-balance text-center text-sm font-normal leading-relaxed text-ink sm:text-base">
                28 days of expert advice to transform your skin&apos;s hydration
                over time
              </p>
              <div className="mt-10 flex justify-center">
                <Link
                  href="/about-your-skin/hydration-challenge"
                  onClick={dismiss}
                  className="inline-flex min-h-[48px] items-center justify-center border border-accent bg-transparent px-10 py-3 text-xs font-medium uppercase tracking-[0.22em] text-ink transition-colors hover:bg-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  Sign me up
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

