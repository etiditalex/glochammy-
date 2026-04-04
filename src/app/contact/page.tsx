import { ContactForm } from "@/components/contact/contact-form";
import { BRAND } from "@/lib/constants";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Visit Glochammy in Kilifi (Charo Wa Mae, near Msenangu Butchery) or call +254 788 508 836.",
};

export default function ContactPage() {
  const tel = `tel:${BRAND.phone.replace(/\s/g, "")}`;

  return (
    <div className="w-full min-w-0 bg-white text-ink">
      <div className="grid w-full min-w-0 gap-12 px-4 py-14 sm:px-6 sm:py-16 md:px-8 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-20 xl:px-12 2xl:gap-20 2xl:px-16">
        <div className="min-w-0 font-sans">
          <h1 className="text-3xl font-medium uppercase tracking-[0.14em] text-ink sm:text-4xl md:text-[2.75rem] md:leading-tight">
            Contact us
          </h1>
          <p className="mt-5 text-base font-normal leading-[1.6] text-ink sm:text-lg sm:leading-[1.55]">
            We&apos;re here to help.
          </p>
          <div className="mt-8 space-y-6 text-base leading-[1.65] text-ink sm:leading-[1.6]">
            <p>
              Please check our{" "}
              <Link
                href="/faq"
                className="font-medium text-ink underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
              >
                FAQ
              </Link>{" "}
              page where you will find answers to the most frequently asked
              questions. It might be quicker to look there rather than waiting for
              a reply.
            </p>
            <p>
              However, if you don&apos;t find the answer to your question, please
              select the appropriate topic from the drop-down in the form, fill
              in the remaining fields, and we will get back to you as soon as we
              can.
            </p>
          </div>
          <p className="mt-10 text-sm leading-[1.65] text-muted">
            Prefer to reach us directly?{" "}
            <a
              href={`mailto:${BRAND.email}`}
              className="text-ink underline decoration-1 underline-offset-4"
            >
              {BRAND.email}
            </a>
            {" · "}
            <a
              href={tel}
              className="text-ink underline decoration-1 underline-offset-4"
            >
              {BRAND.phone}
            </a>
            <br />
            <span className="mt-2 inline-block text-muted">
              {BRAND.addressLine}, {BRAND.region}
            </span>
          </p>
        </div>

        <div className="min-w-0 bg-[#f7f7f7] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
