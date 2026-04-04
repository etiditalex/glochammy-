import { BookingForm } from "@/components/booking/booking-form";
import { BRAND } from "@/lib/constants";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Book a treatment",
  description:
    "Complimentary online skin consultation and salon bookings at Glochammy in Kilifi.",
};

export default function BookingPage() {
  return (
    <div className="w-full min-w-0 bg-white text-ink">
      <section
        className="w-full px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:px-10 lg:py-28 xl:px-12 2xl:px-16"
        aria-labelledby="booking-hero-heading"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h1
            id="booking-hero-heading"
            className="font-sans text-3xl font-normal leading-[1.25] tracking-tight text-ink sm:text-4xl md:text-[2.75rem] md:leading-snug"
          >
            Your personalized online skin consultation
          </h1>
          <p className="mt-8 font-sans text-base leading-[1.75] text-ink sm:text-lg sm:leading-[1.7]">
            From the comfort of your own home, enjoy advice from our{" "}
            {BRAND.shortName} beauty experts to identify the routine best suited
            to your skin&apos;s needs—before you visit us in Kilifi or shop our
            edit online.
          </p>
          <p className="mt-10 font-sans text-sm font-semibold leading-relaxed text-ink sm:text-base">
            Online – 30 Minutes – Complimentary Service
          </p>
          <Link
            href="#book-treatment-form"
            className="mt-10 inline-flex min-h-[48px] items-center justify-center border border-accent bg-white px-8 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-ink transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:text-sm"
          >
            Make an appointment
          </Link>
        </div>
      </section>

      <div
        id="book-treatment-form"
        className="w-full scroll-mt-24 border-t border-line px-4 py-14 sm:px-6 sm:py-16 md:px-8 lg:px-10 xl:px-12 2xl:px-16"
      >
        <BookingForm />
      </div>
    </div>
  );
}
