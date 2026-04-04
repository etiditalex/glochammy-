import { LegalDocPage } from "@/components/layout/legal-doc-page";
import { BRAND } from "@/lib/constants";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Cookies Settings",
  description: `How ${BRAND.shortName} uses cookies and similar technologies on this website.`,
};

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-sans text-base font-semibold text-ink sm:text-lg">
      {children}
    </h2>
  );
}

export default function CookiesPage() {
  const tel = `tel:${BRAND.phone.replace(/\s/g, "")}`;

  return (
    <LegalDocPage title="Cookies Settings" lastUpdated="Last updated: April 2026">
      <p className="text-xs font-medium uppercase leading-relaxed tracking-wide text-ink sm:text-sm">
        This page explains how {BRAND.name} uses cookies and similar
        technologies on this website (the &quot;Website&quot;). It should be
        read together with our{" "}
        <Link href="/privacy" className="text-ink underline decoration-1 underline-offset-4">
          Privacy Policy
        </Link>
        , which describes how we handle personal information more broadly. By
        continuing to use the Website, you agree to the use of cookies as
        described here, except where you have disabled them in your browser or
        through any cookie preference tool we provide.
      </p>
      <p>
        You can change your mind at any time. This notice explains what cookies
        are, the types we may use, how long they may last, and how you can
        control them. If we introduce or retire specific tools, we may update
        this page—check the &quot;Last updated&quot; date when you return.
      </p>

      <div className="space-y-10">
        <section className="space-y-4">
          <SectionTitle>What are cookies and similar technologies?</SectionTitle>
          <p>
            Cookies are small text files that are placed on your device when you
            visit a website. They are widely used to make websites work more
            efficiently, remember your choices, improve security, and understand
            how people use a site. Similar technologies include pixel tags, local
            or session storage in your browser, and software development kits
            (SDKs) in mobile apps—where those apply, the same general principles
            as in this notice usually apply.
          </p>
          <p>
            Cookies may be set by us (first-party cookies) or by another company
            whose content is embedded on the Website, such as analytics or
            payment providers (third-party cookies). Third parties are
            responsible for their own cookies under their policies; we describe
            categories below so you know what to expect.
          </p>
        </section>

        <section className="space-y-4">
          <SectionTitle>How long do cookies last?</SectionTitle>
          <p>
            <strong className="font-semibold text-ink">Session cookies</strong>{" "}
            are removed when you close your browser. They can help keep you
            logged in during a visit, remember items in a cart for that session, or
            maintain security while you move between pages.
          </p>
          <p>
            <strong className="font-semibold text-ink">Persistent cookies</strong>{" "}
            stay on your device for a set period (for example, days or months) or
            until you delete them. They can remember preferences on your next
            visit, measure returning visitors, or store a record of your cookie
            choices so we do not show the same prompt on every page view.
          </p>
        </section>

        <section className="space-y-4">
          <SectionTitle>Categories of cookies we may use</SectionTitle>
          <p>
            The exact names and lifetimes of individual cookies may change as we
            update the Website. We group them into the following categories so
            you can understand their role.
          </p>
          <p>
            <strong className="font-semibold text-ink">Strictly necessary.</strong>{" "}
            These are essential for the Website to function—for example, to load
            pages securely, remember what is in your shopping cart, process
            checkout steps, or store your cookie consent preferences where we
            offer a banner or preference center. Because the Website cannot work
            properly without them, they may be set without consent where the law
            allows for strictly necessary cookies.
          </p>
          <p>
            <strong className="font-semibold text-ink">Functional.</strong>{" "}
            These help us remember choices you make—such as region, language, or
            accessibility settings—and provide enhanced, more personal features.
            If you disable functional cookies, some convenience features may not
            work as expected.
          </p>
          <p>
            <strong className="font-semibold text-ink">Performance and analytics.</strong>{" "}
            These help us understand how visitors use the Website—for example,
            which pages are viewed most often, how long people stay, and whether
            errors occur. Information may be aggregated or pseudonymized. We use
            this insight to improve navigation, content, and performance.
          </p>
          <p>
            <strong className="font-semibold text-ink">Marketing and social.</strong>{" "}
            These may be used to measure the effectiveness of campaigns, limit how
            often you see an advertisement, or enable social sharing features.
            Where required by law, we will only use marketing or non-essential
            cookies after you have given consent or where another lawful basis
            applies.
          </p>
        </section>

        <section className="space-y-4">
          <SectionTitle>Cart, checkout, and preferences</SectionTitle>
          <p>
            When you shop or book through the Website, we may use cookies or
            similar storage so your session stays coherent—for example, to
            remember items you added, your delivery preferences, or the step you
            reached in a multi-step form. Disabling necessary cookies may prevent
            checkout or booking from completing correctly.
          </p>
        </section>

        <section className="space-y-4">
          <SectionTitle>How to control cookies</SectionTitle>
          <p>
            You can control and delete cookies through your browser settings.
            Most browsers allow you to refuse all cookies, accept only
            first-party cookies, delete existing cookies, or be notified before a
            cookie is set. Blocking all cookies may prevent parts of the Website
            from working, including signing in, saving a cart, or using a
            preference center.
          </p>
          <p>
            Browser vendors publish guidance for their products; look for
            &quot;privacy,&quot; &quot;cookies,&quot; or &quot;site data&quot; in
            your browser&apos;s help or settings menu. On mobile devices, you may
            also have tracking or advertising choices in your operating system
            settings.
          </p>
          <p>
            If we provide a cookie banner or preference tool on the Website, use
            it to accept or reject categories of non-essential cookies. Your
            choices are usually stored in a cookie or in local storage so that we
            can respect them on later visits from the same browser.
          </p>
        </section>

        <section className="space-y-4">
          <SectionTitle>Other technologies and &quot;Do Not Track&quot;</SectionTitle>
          <p>
            Some browsers send a &quot;Do Not Track&quot; signal. There is no
            single industry standard for how to respond to that signal. We
            currently rely on our cookie notice, any preference tool we offer, and
            your browser settings rather than solely on Do Not Track headers.
          </p>
        </section>

        <section className="space-y-4">
          <SectionTitle>Updates to this notice</SectionTitle>
          <p>
            We may revise this Cookies notice when we change the Website, add new
            partners or features, or when laws and guidance evolve. When we make
            material changes, we will update the &quot;Last updated&quot; date
            above and, where appropriate, provide additional notice on the
            Website or refresh your cookie choices.
          </p>
        </section>

        <section className="space-y-4">
          <SectionTitle>Contact</SectionTitle>
          <p>
            If you have questions about cookies or this notice, contact us at{" "}
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
