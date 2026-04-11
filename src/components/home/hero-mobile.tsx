import { BRAND } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

/** Mobile-only hero: static image, centered serif/sans copy, dual CTAs (reference layout). */
export function HeroMobile() {
  return (
    <div className="relative flex min-h-[100svh] w-full flex-col justify-end pb-10 pt-[max(2.5rem,env(safe-area-inset-top))] supports-[min-height:1dvh]:min-h-[100dvh] md:hidden">
      <div className="absolute inset-0">
        <Image
          src={BRAND.heroMobileImageSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-left"
        />
        {/* Base wash + stronger bottom scrim where copy sits */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/55"
          aria-hidden
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[min(78%,32rem)] bg-gradient-to-t from-black/85 via-black/55 to-transparent"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-md px-5 pb-safe text-center sm:px-6">
        <div className="rounded-sm bg-black/35 px-4 py-6 shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-[3px] sm:px-6">
          <h1 className="font-display text-[1.7rem] font-medium leading-[1.22] tracking-tight text-white text-balance [text-shadow:0_1px_3px_rgba(0,0,0,0.85),0_4px_28px_rgba(0,0,0,0.5)] sm:text-3xl sm:leading-[1.2]">
            <span className="inline-block rounded-sm bg-[#c9a227] px-1.5 py-0.5 align-baseline text-white shadow-[0_2px_8px_rgba(0,0,0,0.4)] ring-1 ring-white/25">
              G
            </span>
            lochammy—Kilifi&apos;s
            <span className="block mt-2.5 font-normal">
              one-stop beauty &amp; salon
              <span className="text-[#f0d78c]">.</span>
            </span>
          </h1>
          <p className="mt-5 max-w-sm mx-auto font-sans text-[0.9375rem] leading-[1.65] text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.9)] sm:text-base">
            {BRAND.oneStopLead}
          </p>
        </div>

        <div className="mt-8 flex w-full flex-col gap-3">
          <Link
            href="/shop"
            className="inline-flex min-h-[52px] w-full items-center justify-center gap-3 rounded-none border border-white/15 bg-[#faf9f7] px-5 text-sm font-semibold tracking-wide text-[#7a5a1f] shadow-[0_4px_20px_rgba(0,0,0,0.35)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span className="h-px w-8 bg-[#c9a227]" aria-hidden />
            Shop
          </Link>
          <Link
            href="/booking"
            className="inline-flex min-h-[52px] w-full items-center justify-center gap-3 rounded-none border border-white/20 bg-[#c9a227] px-5 text-sm font-semibold tracking-wide text-white shadow-[0_4px_20px_rgba(0,0,0,0.35)] transition-colors hover:bg-[#b38d20] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span className="h-px w-8 bg-white/90" aria-hidden />
            Book a service
          </Link>
        </div>
      </div>
    </div>
  );
}
