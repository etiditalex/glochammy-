import { LegalDocPage } from "@/components/layout/legal-doc-page";
import { BRAND } from "@/lib/constants";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: `Terms of use for the ${BRAND.shortName} website and online services.`,
};

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-sans text-base font-semibold text-ink sm:text-lg">
      {children}
    </h2>
  );
}

export default function TermsPage() {
  const tel = `tel:${BRAND.phone.replace(/\s/g, "")}`;

  return (
    <LegalDocPage title="Terms and Conditions" lastUpdated="Last updated: April 2026">
      <p className="text-xs font-medium uppercase leading-relaxed tracking-wide text-ink sm:text-sm">
        Please read these terms of use carefully before using this website (the
        &quot;Website&quot;). Using this website indicates that you accept these
        terms of use. If you do not accept these terms of use, do not use this
        website.
      </p>
      <p>
        The Website is owned and offered by {BRAND.name} (located at{" "}
        {BRAND.addressLine}, {BRAND.region}), to you, the user, conditioned upon
        your acceptance. Access and use of the Website is subject to these Terms
        of Use and all applicable laws, statutes, and regulations.
      </p>
      <p>
        {BRAND.shortName} specializes in retail and professional beauty—skincare,
        makeup, hair care, nail products, fragrance, tools, and related
        services—together with in-salon and nails-parlour services. Names, logos,
        and other marks appearing on the Website are the property of{" "}
        {BRAND.shortName} or its licensors unless otherwise stated.
      </p>

      <div className="space-y-10">
        <section className="space-y-4">
          <SectionTitle>Eligibility and acceptable use</SectionTitle>
          <p>
            The Website is intended for users who can lawfully enter into a
            contract in their jurisdiction. If you use the Website on behalf of
            a business, you confirm that you have authority to bind that business.
            You agree to provide accurate information when you contact us, place
            an order, or make a booking, and to keep such information up to date
            where it affects fulfillment or safety.
          </p>
          <p>
            You agree to use the Website only for lawful purposes. You must not
            attempt to gain unauthorized access to our systems, interfere with
            the proper working of the Website, introduce malware, or use
            automated means to scrape, harvest, or overload the Website without
            our prior written consent. We may suspend or restrict access where
            we reasonably believe these rules have been broken.
          </p>
        </section>

        <section className="space-y-4">
          <SectionTitle>Products, pricing, and availability</SectionTitle>
          <p>
            Product descriptions, photographs, ingredients (where shown),
            shades, sizes, and prices are provided for general information and may
            change without notice. Colours and finishes can look different on
            screen than in person; if you are uncertain, we encourage you to
            visit us in store or ask our team before purchasing. We aim to keep
            the Website accurate, but occasional errors may occur—for example, a
            price or stock level shown online may not reflect what is available
            at checkout or in our boutique.
          </p>
          <p>
            Where a product is unavailable after you have placed an order, we
            will use reasonable efforts to notify you and offer alternatives, a
            revised timeline, or a refund of amounts paid for the unavailable
            item, in line with the process communicated to you at the time.
          </p>
        </section>

        <section className="space-y-4">
          <SectionTitle>Orders, payment, and delivery</SectionTitle>
          <p>
            Placing an order through the Website constitutes an offer to
            purchase. We may confirm acceptance by email, message, or by preparing
            your order for collection or shipment. Specific payment methods,
            delivery areas, fees, and timeframes depend on what we offer at
            checkout and may be updated from time to time. Risk of loss or damage
            to goods may pass to you on delivery or collection, as stated in the
            terms that apply to your specific order.
          </p>
          <p>
            You are responsible for providing complete delivery details and for
            receiving the order or arranging redelivery if a courier cannot
            complete drop-off. Additional charges may apply where address
            information is incorrect or where repeated delivery attempts are
            required.
          </p>
        </section>

        <section className="space-y-4">
          <SectionTitle>Salon services, bookings, and cancellations</SectionTitle>
          <p>
            Salon and nails-parlour appointments may be requested through the
            Website, by phone, or in person, depending on what we make available.
            Service duration, pricing, and preparation instructions may be
            confirmed when you book. Please arrive on time; late arrival may mean
            we need to shorten the service or reschedule so that other guests
            are not disadvantaged.
          </p>
          <p>
            We may apply a cancellation or no-show policy—such as a fee or
            requirement to secure future bookings with a deposit—where this is
            communicated at the time of booking or on our booking channels. If
            you need to reschedule, contact us as early as possible using{" "}
            <a href={tel} className="text-ink underline decoration-1 underline-offset-4">
              {BRAND.phone}
            </a>{" "}
            or the contact options on the Website.
          </p>
          <p>
            Services are provided with reasonable care and skill. Results can
            vary depending on hair type, skin condition, allergies, and home
            care. You should inform us of any allergies, sensitivities, or
            medical considerations that could affect your service or product
            recommendations.
          </p>
        </section>

        <section className="space-y-4">
          <SectionTitle>Returns, refunds, and hygiene</SectionTitle>
          <p>
            Return and refund rights depend on the nature of the product, whether
            it has been opened or used, and applicable consumer law. Sealed,
            unused items may be returnable within the window and conditions we
            publish at the point of sale or on your receipt. For hygiene and
            safety reasons, certain items (such as opened cosmetics, tools that
            cannot be resold, or personalized goods) may not be eligible for
            return unless faulty or misdescribed.
          </p>
          <p>
            If you believe a product is defective, please contact us promptly
            with details and, where helpful, photographs. We will work with you
            to resolve the matter in line with our policies and the law.
          </p>
        </section>

        <section className="space-y-4">
          <SectionTitle>Intellectual property</SectionTitle>
          <p>
            Unless otherwise stated, all content on the Website—including text,
            graphics, logos, layout, photographs, and downloadable materials—is
            owned by or licensed to {BRAND.shortName} and is protected by
            copyright, trademark, and other intellectual property laws. You may
            view and print reasonable portions for personal, non-commercial use
            related to shopping or booking with us. You may not copy, modify,
            distribute, sell, or create derivative works from our content
            without prior written permission.
          </p>
        </section>

        <section className="space-y-4">
          <SectionTitle>Third-party links and services</SectionTitle>
          <p>
            The Website may contain links to third-party websites, payment
            providers, maps, or social platforms. Those services are governed by
            their own terms and privacy policies. We do not control and are not
            responsible for their content or practices; linking does not imply
            endorsement.
          </p>
        </section>

        <section className="space-y-4">
          <SectionTitle>Disclaimer and limitation of liability</SectionTitle>
          <p>
            The Website and its content are provided on an &quot;as is&quot; and
            &quot;as available&quot; basis to the fullest extent permitted by
            law. While we strive for reliability and security, we do not warrant
            that the Website will be uninterrupted, error-free, or free of
            harmful components. General product or skincare information on the
            Website is not a substitute for professional medical advice; consult
            a qualified practitioner for concerns about reactions or conditions.
          </p>
          <p>
            To the fullest extent permitted by applicable law, {BRAND.shortName}{" "}
            and its team shall not be liable for any indirect, incidental,
            special, consequential, or punitive loss, or for loss of profit, data,
            or goodwill, arising from your use of the Website or services.
            Nothing in these terms excludes or limits liability that cannot
            legally be excluded or limited, including liability for death or
            personal injury caused by negligence where applicable.
          </p>
        </section>

        <section className="space-y-4">
          <SectionTitle>Indemnity</SectionTitle>
          <p>
            You agree to indemnify and hold harmless {BRAND.shortName} from
            claims, damages, losses, and reasonable legal costs arising from your
            breach of these terms, your misuse of the Website, or your violation
            of any third-party rights, where such claims are not caused by our
            own unlawful act or gross negligence.
          </p>
        </section>

        <section className="space-y-4">
          <SectionTitle>Governing law and disputes</SectionTitle>
          <p>
            These terms are governed by the laws of the Republic of Kenya,
            without regard to conflict-of-law principles that would require
            applying another jurisdiction&apos;s laws. Courts in Kenya shall have
            non-exclusive jurisdiction over disputes arising from or related to
            these terms or the Website, subject to any mandatory consumer
            protections that apply where you live.
          </p>
        </section>

        <section className="space-y-4">
          <SectionTitle>Changes to these terms</SectionTitle>
          <p>
            We may update these Terms of Use from time to time to reflect changes
            in our business, the law, or how the Website works. The &quot;Last
            updated&quot; date at the top of this page will change when we
            publish a revision. Continued use of the Website after changes take
            effect constitutes acceptance of the revised terms, except where
            applicable law requires your explicit consent where stricter rules
            apply.
          </p>
        </section>

        <section className="space-y-4">
          <SectionTitle>Contact</SectionTitle>
          <p>
            Questions about these terms? Contact us at{" "}
            <a
              href={`mailto:${BRAND.email}`}
              className="text-ink underline decoration-1 underline-offset-4"
            >
              {BRAND.email}
            </a>
            , call{" "}
            <a href={tel} className="text-ink underline decoration-1 underline-offset-4">
              {BRAND.phone}
            </a>
            , or visit us at {BRAND.addressLine}, {BRAND.region}.
          </p>
        </section>
      </div>
    </LegalDocPage>
  );
}
