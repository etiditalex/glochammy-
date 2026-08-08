"use client";

import { useEffect, useState, type RefObject } from "react";

/** True when `prefers-reduced-motion: reduce` is set. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

/**
 * Autoplay only while the element is on-screen and the tab is visible.
 * Cuts timer + re-render cost when the user scrolls past or backgrounds the tab.
 */
export function useAutoplayWhenVisible(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
  intervalMs: number,
  onTick: () => void,
) {
  useEffect(() => {
    const element = ref.current;
    if (!enabled || !element) return;

    let timer: number | null = null;
    let inView = false;

    const stop = () => {
      if (timer != null) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    const start = () => {
      if (timer != null || document.visibilityState !== "visible" || !inView) {
        return;
      }
      timer = window.setInterval(onTick, intervalMs);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = Boolean(entry?.isIntersecting);
        if (inView) start();
        else stop();
      },
      { threshold: 0.15, rootMargin: "0px" },
    );
    io.observe(element);

    const onVisibility = () => {
      if (document.visibilityState === "visible") start();
      else stop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [ref, enabled, intervalMs, onTick]);
}
