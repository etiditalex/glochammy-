import { LegalDocPage } from "@/components/layout/legal-doc-page";
import { BRAND } from "@/lib/constants";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${BRAND.shortName} collects, uses, and protects your personal information.`,
};

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-sans text-base font-semibold text-ink sm:text-lg">
      {children}
    </h2>
  );
}

export default function PrivacyPage() {
  const tel = `tel:${BRAND.phone.replace(/\s/g, "")}`;

  return (
    <LegalDocPage title="Privacy Policy" lastUpdated="Last updated: April 2026">
      <p className="text-xs font-medium uppercase leading-relaxed tracking-wide text-ink sm:text-sm">
        This privacy policy describes how {BRAND.name} (&quot;we&quot;,
        &quot;us&quot;) handles personal information when you visit our website
        (the &quot;Website&quot;), contact us, shop with us online or in store,
        or book and receive salon or nails-parlour services. By using our
        Website or services, you acknowledge this policy. If you do not agree,
        please do not use the Website or share personal data with us beyond what
        the law requires.
      </p>
      <p>
        We respect your privacy and aim to be transparent about what we collect,
        why we use it, how long we keep it, and the choices available to you.
        This policy should be read together with our{" "}
        <Link href="/cookies" className="text-ink underline decoration-1 underline-offset-4">
          Cookies Settings
        </Link>{" "}
        page, which explains how we use cookies and similar technologies on the
        Website.
      </p>

      <div className="space-y-10">
        <section className="space-y-4">
          <SectionTitle>Who is responsible for your information?</SectionTitle>
          <p>
            The data controller for personal information processed in connection
            with {BRAND.shortName} is {BRAND.name}, based at {BRAND.addressLine},{" "}
            {BRAND.region}. If you have questions about this policy or our
            practices, use the contact details at the end of this page.
          </p>
        </section>

        <section className="space-y-4">
          <SectionTitle>Information we collect</SectionTitle>
          <p>
            <strong className="font-semibold text-ink">You provide directly.</strong>{" "}
            For example: name, email address, phone number, delivery or billing
            address, payment-related information handled by our payment partners,
            appointment preferences, service notes you agree to, photographs you
            send us for consultation enquiries, and the content of messages or
            forms you submit to us.
          </p>
          <p>
            <strong className="font-semibold text-ink">Automatically when you use the Website.</strong>{" "}
            For example: device type, browser, operating system, referring page,
            approximate location derived from IP address (where available), pages
            viewed, date and time of access, and identifiers stored in cookies or
            similar technologies—see our Cookies page for more detail.
          </p>
          <p>
            <strong className="font-semibold text-ink">In store or at appointments.</strong>{" "}
            For example: booking records, purchase history where we link it to
            your profile, loyalty or promotion participation, allergies or skin
            and hair information you choose to share so we can serve you safely,
            and CCTV where installed at our premises for security (only where
            permitted by law and with appropriate notices).
          </p>
        </section>

        <section className="space-y-4">
          <SectionTitle>How and why we use your information</SectionTitle>
          <p>
            We use personal information to operate our business and provide a
            good experience. This includes: processing and delivering product
            orders; managing collections or deliveries; confirming and managing
            salon or nails appointments; responding to customer service requests;
            processing payments through authorized providers; sending essential
            service messages (such as order or booking confirmations); improving
            our Website, products, and services; detecting and preventing fraud,
            abuse, or illegal activity; complying with legal and tax obligations;
            and defending our legal rights where necessary.
          </p>
          <p>
            Where required by applicable law—including, where relevant, the data
            protection framework in Kenya—we rely on appropriate legal bases
            such as your consent (for example, certain marketing or non-essential
            cookies), the performance of a contract with you, our legitimate
            interests (balanced against your rights), or legal obligation.
          </p>
        </section>

        <section className="space-y-4">
          <SectionTitle>Marketing</SectionTitle>
          <p>
            We may send promotional emails or messages about products, offers, or
            events if you have agreed to receive them or where the law allows us
            to contact existing customers about similar goods and services. You
            can opt out at any time by using an unsubscribe link in emails,
            replying to ask us to stop, or contacting us using the details below.
            Opting out of marketing does not stop essential service messages
            related to orders or bookings you have placed.
          </p>
        </section>

        <section className="space-y-4">
          <SectionTitle>Sharing your information</SectionTitle>
          <p>
            We do not sell your personal information. We may share it with
            trusted service providers who process data on our behalf—for example
            website hosting, analytics (where configured lawfully), email or SMS
            delivery, payment processors, delivery couriers, and appointment or
            booking tools. These providers are required to use the data only as we
            instruct and to protect it appropriately.
          </p>
          <p>
            We may disclose information if the law requires it, if we must respond
            to valid legal requests, or if we reasonably believe disclosure is
            necessary to protect the safety, rights, or property of our customers,
            staff, or the public. If our business structure changes (for example,
            a merger or acquisition), your information may be transferred as part
            of that transaction subject to confidentiality and, where required,
            notice to you.
          </p>
        </section>

        <section className="space-y-4">
          <SectionTitle>International transfers</SectionTitle>
          <p>
            Your information is primarily processed in Kenya. If we use tools or
            providers that store or process data in other countries, we take
            steps that are appropriate under applicable law—such as contractual
            safeguards or your consent where required—before making those
            transfers.
          </p>
        </section>

        <section className="space-y-4">
          <SectionTitle>Retention</SectionTitle>
          <p>
            We keep personal information only for as long as necessary for the
            purposes described in this policy, unless a longer period is needed
            for legal, tax, or accounting reasons, or to resolve disputes. For
            example, order and invoice records may be kept for the period
            required by tax law; marketing consent records may be kept to prove
            your preferences; and security logs may be kept for a limited
            technical retention window.
          </p>
        </section>

        <section className="space-y-4">
          <SectionTitle>Security</SectionTitle>
          <p>
            We use reasonable technical and organizational measures designed to
            protect personal information against unauthorized access, loss,
            alteration, or misuse. These measures may include access controls,
            secure connections where appropriate, staff training, and
            limitations on who can see certain data. No method of transmission or
            storage is completely secure; if you believe your interaction with
            us has been compromised, please tell us promptly.
          </p>
        </section>

        <section className="space-y-4">
          <SectionTitle>Your rights and choices</SectionTitle>
          <p>
            Depending on applicable law—including Kenya&apos;s data protection
            regime where it applies to you—you may have rights to access the
            personal information we hold about you, to request correction of
            inaccurate data, to request deletion or restriction of processing in
            certain cases, to withdraw consent where processing is based on
            consent, to object to certain processing based on legitimate
            interests, and to complain to a supervisory or data protection
            authority.
          </p>
          <p>
            To exercise these rights, contact us using the details below. We may
            need to verify your identity before fulfilling requests. We will
            respond within any timeframe required by law, or otherwise within a
            reasonable period.
          </p>
        </section>

        <section className="space-y-4">
          <SectionTitle>Children</SectionTitle>
          <p>
            Our Website and services are not directed at children under the age
            at which parental consent is required in your jurisdiction for
            information society services. We do not knowingly collect personal
            information from such children without appropriate consent. If you
            believe we have collected a child&apos;s information improperly,
            please contact us and we will take steps to address it.
          </p>
        </section>

        <section className="space-y-4">
          <SectionTitle>Third-party sites</SectionTitle>
          <p>
            The Website may link to social media, maps, payment pages, or other
            third-party sites. Those services have their own privacy policies; we
            are not responsible for their practices. We encourage you to read
            their policies before you submit personal data to them.
          </p>
        </section>

        <section className="space-y-4">
          <SectionTitle>Changes to this policy</SectionTitle>
          <p>
            We may update this Privacy Policy from time to time to reflect
            changes in our practices, technology, or legal requirements. The date
            at the top of this page shows when it was last revised. Where
            changes are material, we may provide additional notice on the Website
            or, where appropriate, by email or another channel.
          </p>
        </section>

        <section className="space-y-4">
          <SectionTitle>Contact us</SectionTitle>
          <p>
            For privacy questions, requests, or complaints, contact{" "}
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
            , or write to {BRAND.name}, {BRAND.addressLine}, {BRAND.region}.
          </p>
        </section>
      </div>
    </LegalDocPage>
  );
}
