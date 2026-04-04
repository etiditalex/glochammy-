import { StoreLocator } from "@/components/locations/store-locator";
import { BRAND } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Store locator",
  description: `Find ${BRAND.shortName} in Kilifi, Mombasa, Malindi, and across the Kenya coast.`,
};

export default function LocationsPage() {
  return (
    <div className="w-full min-w-0 bg-white">
      <div className="border-b border-line bg-cream px-4 py-8 sm:px-6 md:px-8 lg:px-10">
        <p className="text-2xs font-medium uppercase tracking-nav text-muted">
          Kenya
        </p>
        <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
          Find us
        </h1>
        <p className="mt-3 max-w-2xl font-sans text-sm leading-[1.65] text-muted sm:text-base">
          Search for a {BRAND.shortName} point of sale or service area. Our
          flagship salon and shop is in Kilifi—we also list Mombasa and Malindi
          touchpoints for pickups and consultations.
        </p>
      </div>
      <StoreLocator />
    </div>
  );
}
