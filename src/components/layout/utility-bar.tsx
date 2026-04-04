import Link from "next/link";
import { LocationSelector } from "@/components/layout/location-selector";

export function UtilityBar() {
  return (
    <div className="bg-subtle">
      <div className="mx-auto flex min-w-0 max-w-content justify-end px-4 py-2 sm:px-8">
        <div className="flex max-w-full flex-wrap items-center justify-end gap-x-2 gap-y-1 text-2xs text-muted sm:text-xs">
          <LocationSelector />
          <span className="text-ink/40" aria-hidden>
            ·
          </span>
          <Link
            href="/contact"
            className="underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
          >
            Customer service
          </Link>
        </div>
      </div>
    </div>
  );
}
