"use client";

import { MapPin } from "lucide-react";
import { type FormEvent, useEffect, useId, useState } from "react";

export const LOCATION_STORAGE_KEY = "glochammy-preferred-location";

export const STORE_LOCATIONS = [
  { value: "kilifi", label: "Kilifi" },
  { value: "mombasa", label: "Mombasa" },
  { value: "malindi", label: "Malindi" },
] as const;

export type StoreLocationValue = (typeof STORE_LOCATIONS)[number]["value"];

function readStored(): StoreLocationValue {
  if (typeof window === "undefined") return "kilifi";
  const raw = window.localStorage.getItem(LOCATION_STORAGE_KEY);
  if (raw === "mombasa" || raw === "malindi" || raw === "kilifi") return raw;
  return "kilifi";
}

export function LocationSelector() {
  const dialogLabelId = useId();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<StoreLocationValue>("kilifi");
  const [draft, setDraft] = useState<StoreLocationValue>("kilifi");

  useEffect(() => {
    const v = readStored();
    setSelected(v);
    setDraft(v);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function openDialog() {
    setDraft(selected);
    setOpen(true);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    window.localStorage.setItem(LOCATION_STORAGE_KEY, draft);
    setSelected(draft);
    setOpen(false);
    window.dispatchEvent(
      new CustomEvent<StoreLocationValue>("glochammy-location-change", {
        detail: draft,
      }),
    );
  }

  const currentLabel =
    STORE_LOCATIONS.find((l) => l.value === selected)?.label ?? "Kilifi";

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className="inline-flex max-w-[11rem] items-center gap-1.5 text-left text-2xs text-ink transition-opacity hover:opacity-70 sm:max-w-none sm:gap-2 sm:text-xs"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="location-picker-dialog"
      >
        <MapPin className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" strokeWidth={2} aria-hidden />
        <span className="min-w-0 truncate">
          <span className="text-muted">Location</span>
          <span className="text-ink/50 sm:mx-0.5" aria-hidden>
            {" "}
            ·{" "}
          </span>
          <span className="font-medium text-ink">{currentLabel}</span>
        </span>
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[200] cursor-default bg-ink/20"
            aria-label="Close location picker"
            onClick={() => setOpen(false)}
          />
          <div
            id="location-picker-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogLabelId}
            className="fixed left-4 right-4 top-[max(4rem,15vh)] z-[210] mx-auto max-w-md border border-line bg-white px-6 py-6 shadow-lg sm:left-auto sm:right-8 sm:top-[4.5rem] sm:mx-0"
          >
            <h2
              id={dialogLabelId}
              className="font-sans text-base font-semibold text-ink sm:text-lg"
            >
              Your location
            </h2>
            <p className="mt-2 font-sans text-sm leading-relaxed text-muted">
              Choose the area that best matches where you shop or book services.
              We use this to tailor availability and delivery information.
            </p>
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="location-select"
                  className="block font-sans text-xs font-medium uppercase tracking-wide text-muted"
                >
                  Select location
                </label>
                <select
                  id="location-select"
                  value={draft}
                  onChange={(e) =>
                    setDraft(e.target.value as StoreLocationValue)
                  }
                  className="mt-2 w-full border border-line bg-white px-3 py-2.5 font-sans text-base text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  {STORE_LOCATIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  className="min-h-[44px] border border-ink bg-ink px-6 py-2.5 font-sans text-xs font-semibold uppercase tracking-nav text-white transition-opacity hover:opacity-90"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="min-h-[44px] border border-line bg-white px-6 py-2.5 font-sans text-xs font-semibold uppercase tracking-nav text-ink transition-opacity hover:opacity-70"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </>
      ) : null}
    </>
  );
}
