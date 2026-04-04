import { BRAND } from "@/lib/constants";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accessibility",
  description: `Accessibility statement for ${BRAND.name}—our commitment to an inclusive website experience.`,
};

export default function AccessibilityPage() {
  return (
    <div className="w-full min-w-0 bg-white text-ink">
      <div className="w-full min-w-0 px-4 py-14 sm:px-6 md:px-8 lg:px-10 lg:py-20 xl:px-12 2xl:px-16">
        <h1 className="max-w-none font-sans text-3xl font-light tracking-tight text-ink sm:text-4xl md:text-5xl">
          Accessibility Statement for {BRAND.shortName}
        </h1>

        <div className="mt-12 max-w-none space-y-8 font-sans text-base leading-[1.7] text-ink sm:text-[1.0625rem] sm:leading-[1.75]">
          <p>This is an accessibility statement from {BRAND.name}.</p>
          <p>
            We are committed to constantly enhancing site accessibility as part
            of our responsibility to provide access to all users. Our aim is to
            address barriers where we find them and to improve how everyone can
            shop, book salon services, and find information about{" "}
            {BRAND.shortName} online. If you encounter any issues or need
            assistance on our website, please{" "}
            <Link
              href="/contact"
              className="font-medium text-ink underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
            >
              contact us
            </Link>{" "}
            for prompt support.
          </p>

          <h2 className="pt-4 font-sans text-xl font-semibold text-ink sm:text-2xl sm:leading-snug">
            Measures to support accessibility
          </h2>
          <p>
            {BRAND.shortName} takes the following measures to help support
            accessibility of our website:
          </p>
          <ul className="list-disc space-y-4 pl-6 marker:text-ink">
            <li className="pl-1">
              Include accessibility as part of our commitment to serving every
              customer with care and respect.
            </li>
            <li className="pl-1">
              Consider accessibility when we plan updates to layout, content,
              and checkout or booking flows.
            </li>
            <li className="pl-1">
              Encourage our team to keep accessibility in mind across customer
              service, retail, and digital touchpoints.
            </li>
            <li className="pl-1">
              Set clear goals to improve readability, contrast, keyboard use,
              and form labels over time as the site evolves.
            </li>
          </ul>
          <p>
            We know accessibility is ongoing. If something is hard to use—a
            link, an image description, a form, or navigation—please tell us so
            we can prioritise a fix.
          </p>
        </div>
      </div>
    </div>
  );
}
