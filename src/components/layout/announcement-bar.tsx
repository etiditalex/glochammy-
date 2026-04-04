"use client";

import { ANNOUNCEMENT_DISMISS_KEY } from "@/lib/constants";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export function AnnouncementBar() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const dismissed = window.localStorage.getItem(ANNOUNCEMENT_DISMISS_KEY);
      setVisible(dismissed !== "1");
    } catch {
      setVisible(true);
    }
  }, []);

  if (!mounted || !visible) return null;

  function dismiss() {
    try {
      window.localStorage.setItem(ANNOUNCEMENT_DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  return (
    <div className="border-b border-line bg-white">
      <div className="relative mx-auto flex min-w-0 max-w-content items-center justify-center px-3 py-3 pr-11 sm:px-8 sm:pr-16">
        <a
          href="/#newsletter"
          className="max-w-[min(100%,28rem)] text-balance break-words text-center text-xs leading-snug text-ink underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70 sm:text-sm"
        >
          Sign up and indulge in a complimentary exclusive discovery routine.
        </a>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-ink/70 transition-colors hover:text-ink sm:right-8"
        >
          <X className="h-4 w-4" strokeWidth={1.25} aria-hidden />
        </button>
      </div>
    </div>
  );
}
