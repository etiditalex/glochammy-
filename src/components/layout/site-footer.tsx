import { FooterNewsletter } from "@/components/layout/footer-newsletter";
import { BRAND } from "@/lib/constants";
import Link from "next/link";

const aboutLinks: { label: string; href: string }[] = [
  { label: "Our universe", href: "/our-story" },
  { label: "Our commitments", href: "/about" },
  { label: "Spas", href: "/salon" },
  { label: "Find a boutique", href: "/locations" },
  { label: "Join the family", href: "/contact" },
  { label: "Shop the edit", href: "/shop" },
];

const serviceLinks: { label: string; href: string }[] = [
  { label: "My account", href: "/account" },
  { label: "Contact us", href: "/contact" },
  { label: "Book a beauty consultation", href: "/booking" },
  { label: "Skin diagnosis", href: "/about-your-skin/skin-diagnosis" },
  { label: "FAQ", href: "/faq" },
  { label: "Track my order", href: "/track-order" },
  { label: "Accessibility", href: "/accessibility" },
];

const legalLinks: { label: string; href: string }[] = [
  { label: "Terms and Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookies Settings", href: "/cookies" },
];

const linkClass =
  "text-sm text-ink transition-opacity hover:opacity-60";

function columnHeading(text: string) {
  return (
    <h2 className="text-2xs font-semibold uppercase tracking-nav text-ink">
      {text}
    </h2>
  );
}

export function SiteFooter() {
  return (
    <footer className="w-full min-w-0 border-t border-accent/35 bg-cream">
      <div className="w-full min-w-0 px-4 py-16 sm:px-6 md:px-8 lg:px-10 lg:py-20 xl:px-12 2xl:px-16">
        <div className="grid gap-14 sm:gap-16 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          <FooterNewsletter />

          <nav aria-label="About" className="lg:col-span-2">
            {columnHeading("About")}
            <ul className="mt-5 space-y-3.5">
              {aboutLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Customer service" className="lg:col-span-3">
            {columnHeading("Customer service")}
            <ul className="mt-5 space-y-3.5">
              {serviceLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal" className="lg:col-span-2">
            {columnHeading("Legal")}
            <ul className="mt-5 space-y-3.5">
              {legalLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-line bg-white">
        <div className="flex w-full min-w-0 flex-col gap-2 px-4 py-6 text-2xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
          <p className="break-words text-center sm:text-left">
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <p className="text-center text-muted/80 sm:text-right">{BRAND.region}</p>
        </div>
      </div>
    </footer>
  );
}
