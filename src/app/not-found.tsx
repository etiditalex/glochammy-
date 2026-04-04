import { ButtonLink } from "@/components/ui/button-link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="bg-cream px-4 py-24 sm:px-8">
      <div className="mx-auto min-w-0 max-w-content text-center">
        <p className="text-2xs font-medium uppercase tracking-nav text-muted">
          404
        </p>
        <h1 className="mt-4 font-display text-4xl text-ink sm:text-5xl">
          This page has stepped out
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-muted">
          The link may be outdated. Return home or browse the shop.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">Home</ButtonLink>
          <ButtonLink href="/shop" variant="secondary">
            Shop
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
