import { TrackOrderForm } from "@/components/track-order/track-order-form";
import { TrackOrderSearch } from "@/components/track-order/track-order-search";
import { BRAND } from "@/lib/constants";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Track my order",
  description: `Track your ${BRAND.shortName} order and delivery updates for Kilifi, Mombasa, Malindi, and beyond.`,
};

const categoryLinks: { label: string; href: string }[] = [
  { label: "Account & Website", href: "/account" },
  { label: "Returns & Exchanges", href: "/contact" },
  { label: "Where is My Order?", href: "#where-is-my-order" },
  { label: "Shipping", href: "#where-is-my-order" },
  { label: "Cancellations", href: "/contact" },
  { label: "Changes", href: "/contact" },
  { label: "Other order issues", href: "/contact" },
  { label: "Incorrect, damaged & faulty", href: "/contact" },
  { label: "Customs, duties & taxes", href: "/contact" },
  { label: "Invoices", href: "/contact" },
  { label: "Payments", href: "/contact" },
  { label: "Prices & discounts", href: "/faq" },
  { label: "Refunds", href: "/contact" },
];

export default function TrackOrderPage() {
  return (
    <div className="w-full min-w-0 bg-neutral-100 text-ink">
      <TrackOrderSearch />

      <div className="px-4 py-10 sm:px-6 md:px-8 lg:flex lg:gap-10 lg:px-10 lg:py-12 xl:px-12 2xl:px-16">
        <aside className="mb-10 shrink-0 lg:mb-0 lg:w-56 xl:w-64">
          <h2 className="font-sans text-sm font-semibold text-ink">Categories</h2>
          <nav aria-label="Order help topics" className="mt-5">
            <ul className="space-y-3.5 font-sans text-sm text-neutral-700">
              {categoryLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={
                      item.label === "Where is My Order?"
                        ? "font-medium text-ink"
                        : "transition-opacity hover:opacity-70"
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div
          id="track-order-main"
          className="min-w-0 flex-1 border border-line bg-white px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12"
        >
          <p className="font-sans text-sm text-neutral-600">
            <Link
              href="/shop"
              className="text-ink underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
            >
              &lt; Back
            </Link>
          </p>

          <h1
            id="where-is-my-order"
            className="mt-6 scroll-mt-24 font-sans text-2xl font-bold text-ink sm:text-3xl"
          >
            Where is My Order?
          </h1>
          <hr className="mt-4 border-line" />

          <div className="mt-6 space-y-5 font-sans text-sm leading-[1.7] text-ink sm:text-base sm:leading-[1.65]">
            <p>
              It can take between one and four business days (not including
              weekends and public holidays) for us to prepare your parcel for
              dispatch—especially during busy periods. Local delivery across{" "}
              <strong className="font-semibold">Kilifi, Mombasa, and Malindi</strong>{" "}
              is our focus; other areas may take longer.
            </p>
            <p>
              Once your order ships, you will be sent an automatic email
              containing tracking information when that service is enabled for
              your order.
            </p>
            <p>
              <strong className="font-semibold">
                To track your order, please use the tracking tool available on
                this page.
              </strong>
            </p>
            <p>
              If there has been no update on the tracking information for more
              than five business days, please let us know so that we can look
              into it with the courier.
            </p>
            <p>
              Locating a parcel can sometimes take several weeks if a full
              investigation is needed.
            </p>
            <p>
              If a parcel is confirmed lost in transit, we will arrange an
              appropriate resolution with you according to our policies.
            </p>
          </div>

          <h2 className="mx-auto mt-14 max-w-3xl text-center font-sans text-xl font-bold text-ink sm:text-2xl">
            Track your order now in real time
          </h2>

          <div className="mt-8 border border-line bg-white px-5 py-6 sm:px-8 sm:py-8">
            <div className="flex flex-col gap-6 border-b border-line pb-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-sans text-lg font-semibold tracking-tight text-ink">
                  Locale
                </p>
                <p className="mt-1 font-sans text-sm leading-relaxed text-neutral-700 sm:text-base">
                  Kilifi · Mombasa · Malindi
                </p>
              </div>
              <div className="sm:text-right">
                <label
                  htmlFor="track-lang"
                  className="block font-sans text-xs font-medium text-neutral-600"
                >
                  Select Language
                </label>
                <select
                  id="track-lang"
                  name="language"
                  defaultValue="en"
                  className="mt-2 min-w-[10rem] border border-line bg-white px-3 py-2 font-sans text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                >
                  <option value="en">English</option>
                  <option value="sw">Kiswahili</option>
                </select>
              </div>
            </div>

            <TrackOrderForm />
          </div>
        </div>
      </div>
    </div>
  );
}
