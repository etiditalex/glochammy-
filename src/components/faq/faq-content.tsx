"use client";

import { BRAND } from "@/lib/constants";
import Link from "next/link";
import { useCallback, useState } from "react";

type FaqItem = { id: string; question: string; answer: string };

type FaqSection = {
  id: string;
  navLabel: string;
  heading: string;
  items: FaqItem[];
};

const SECTIONS: FaqSection[] = [
  {
    id: "general-inquiries",
    navLabel: "General inquiries",
    heading: "General inquiries",
    items: [
      {
        id: "find-us",
        question: "How do I find Glochammy and your salon in Kilifi?",
        answer: `We are at ${BRAND.addressLine}, ${BRAND.region}. Call ${BRAND.phone} or email ${BRAND.email} if you need directions or opening hours.`,
      },
      {
        id: "bestsellers",
        question: "Do you have a list of bestsellers or most-loved products?",
        answer:
          "Our team keeps a rotating edit of customer favourites in store and highlights new arrivals online. Visit us or browse the shop section of the website; staff can recommend what is popular for your skin, hair, or nails.",
      },
      {
        id: "promotions",
        question: "Do you run promotions or loyalty offers?",
        answer:
          "We run promotions from time to time—subscribe to our newsletter and follow our announcements in store. Terms for each offer are shared when the promotion is published.",
      },
      {
        id: "discount-code",
        question:
          "How do I use a discount code I received when I signed up for your newsletter?",
        answer:
          "Enter the code at checkout in the field provided (if available on your order). Codes are case-sensitive, may have expiry dates, and cannot usually be combined with other offers unless stated.",
      },
      {
        id: "samples",
        question: "Can I get free samples without buying online?",
        answer:
          "Samples depend on stock and brand rules. Ask in store during your visit; we prioritise samples for clients trying to find the right product with valid hygiene and safety guidelines.",
      },
    ],
  },
  {
    id: "product-information",
    navLabel: "Product information",
    heading: "Product information",
    items: [
      {
        id: "skin-type",
        question: "How do I choose skincare for my skin type?",
        answer:
          "Tell us your concerns—dryness, oiliness, sensitivity, or breakouts—and we can suggest options. For more tailored advice, book an in-person or online skincare consultation through our booking page.",
      },
      {
        id: "authentic",
        question: "Are your products authentic and stored properly?",
        answer:
          "We source from reputable suppliers and store products to protect quality—away from direct sun and heat where required. If packaging looks damaged or tampered with, do not use it and contact us.",
      },
      {
        id: "range",
        question: "Do you stock hair, nails, and fragrance as well as skincare?",
        answer:
          "Yes. Glochammy is a one-stop beauty shop: skincare, makeup, hair and wigs, nail products, fragrance, body care, tools, plus salon and nails-parlour services.",
      },
      {
        id: "shade-matching",
        question: "Can you help with shade or colour matching?",
        answer:
          "Our team can help match foundation, concealer, and other colour cosmetics in store. Natural daylight and swatches where appropriate give the most reliable result.",
      },
    ],
  },
  {
    id: "orders-returns-payments",
    navLabel: "Orders, returns & payments",
    heading: "Orders, returns & payments",
    items: [
      {
        id: "payments",
        question: "What payment methods do you accept?",
        answer:
          "Accepted methods are confirmed at checkout or at the till. If you need a specific option (such as mobile money or card), ask us before placing a large or time-sensitive order.",
      },
      {
        id: "delivery",
        question: "Do you deliver, and how long does it take?",
        answer:
          "Delivery availability, fees, and timelines depend on your location and courier options. We will confirm estimates when you order; rural or peak periods may take longer.",
      },
      {
        id: "returns",
        question: "What is your return or exchange policy?",
        answer:
          "Returns depend on whether items are sealed, hygiene-sensitive, or faulty. See our Terms and Conditions and ask for a receipt-friendly summary in store. Faulty or misdescribed goods should be reported promptly.",
      },
      {
        id: "track-order",
        question: "How do I track my order?",
        answer:
          "Use the confirmation message or email we send when your order ships, or contact us with your order details at " +
          BRAND.email +
          " or " +
          BRAND.phone +
          ".",
      },
    ],
  },
];

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-lg leading-none text-ink transition-transform duration-200"
      aria-hidden
    >
      {open ? "⌃" : "⌄"}
    </span>
  );
}

export function FaqContent() {
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());

  const toggle = useCallback((id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
    <div className="w-full min-w-0 bg-white text-ink">
      <div className="grid w-full min-w-0 gap-12 px-4 py-14 sm:px-6 md:px-8 lg:grid-cols-12 lg:gap-10 lg:px-10 lg:py-20 xl:px-12 2xl:gap-14 2xl:px-16">
        <aside className="lg:col-span-4 2xl:col-span-3">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h1 className="font-sans text-3xl font-medium uppercase leading-[1.05] tracking-tight text-ink sm:text-4xl sm:leading-[1.05] md:text-[2.75rem]">
              <span className="block">Frequent</span>
              <span className="block">ly asked</span>
              <span className="block">question</span>
              <span className="block">s</span>
            </h1>

            <p className="mt-10 font-sans text-sm font-normal capitalize text-ink">
              Summary
            </p>
            <nav aria-label="FAQ sections" className="mt-5">
              <ul className="space-y-5 font-sans text-xs font-medium uppercase tracking-[0.18em] text-ink sm:text-sm sm:tracking-[0.2em]">
                {SECTIONS.map((section) => (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(section.id)}
                      className="text-left uppercase transition-opacity hover:opacity-55 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 focus-visible:ring-offset-2"
                    >
                      {section.navLabel}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        <div className="min-w-0 lg:col-span-8 2xl:col-span-9 2xl:min-w-0">
          {SECTIONS.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-28 border-t border-line pt-10 first:border-t-0 first:pt-0"
            >
              <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.16em] text-ink sm:text-base">
                {section.heading}
              </h2>
              <div className="mt-2">
                {section.items.map((item) => {
                  const open = openIds.has(item.id);
                  return (
                    <div key={item.id} className="border-b border-line">
                      <button
                        type="button"
                        onClick={() => toggle(item.id)}
                        aria-expanded={open}
                        className="flex w-full items-start justify-between gap-6 py-4 text-left font-sans text-base font-normal leading-7 text-ink sm:text-[1.0625rem] sm:leading-[1.65]"
                      >
                        <span className="font-medium">{item.question}</span>
                        <Chevron open={open} />
                      </button>
                      {open ? (
                        <div className="pb-6 pr-10 font-sans text-base leading-[1.7] text-muted sm:pr-14 sm:leading-[1.75]">
                          {item.answer}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>

    <section
      className="w-full min-w-0 border-t border-accent/30 bg-cream text-left text-ink"
      aria-labelledby="faq-more-questions-heading"
    >
      <div className="px-4 py-16 sm:px-6 md:px-8 lg:px-10 lg:py-20 xl:px-12 2xl:px-16">
        <h2
          id="faq-more-questions-heading"
          className="font-sans text-3xl font-medium tracking-tight text-ink sm:text-4xl md:text-[2.25rem]"
        >
          More questions ?
        </h2>
        <p className="mt-4 font-sans text-sm font-normal leading-relaxed text-ink sm:text-base">
          Our team are here to help you.
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-block border border-accent bg-transparent px-8 py-3.5 text-2xs font-semibold uppercase tracking-nav text-ink transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          Contact us
        </Link>
      </div>
    </section>
    </>
  );
}
