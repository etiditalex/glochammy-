import { CustomerLoginForm } from "@/components/account/customer-login-form";
import { BRAND } from "@/lib/constants";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My account",
  description: `Sign in or create an account with ${BRAND.shortName}.`,
};

export default function AccountPage() {
  return (
    <div className="min-h-[70vh] w-full min-w-0 bg-[#fafaf8] pb-20 pt-12 sm:pb-24 sm:pt-16">
      <div className="mx-auto w-full max-w-lg px-4 sm:px-6 md:max-w-xl md:px-8">
        <h1 className="text-center font-display text-4xl font-medium text-ink sm:text-5xl">
          Customer Login
        </h1>

        <div className="mt-10 border border-line/60 bg-[#ebe6df] px-6 py-8 sm:mt-12 sm:px-8 sm:py-10">
          <CustomerLoginForm />
        </div>

        <section
          className="mt-10 border border-line/50 bg-[#faf7f5] px-6 py-8 sm:mt-12 sm:px-8 sm:py-10"
          aria-labelledby="new-customers-heading"
        >
          <h2
            id="new-customers-heading"
            className="font-sans text-lg font-medium text-ink sm:text-xl"
          >
            New Customers
          </h2>
          <p className="mt-4 font-sans text-sm leading-[1.7] text-ink sm:text-base sm:leading-[1.65]">
            Creating an account has many benefits: check out faster, keep more
            than one address, track orders and more.
          </p>
          <Link
            href="/account/register"
            className="mt-8 flex w-full items-center justify-center border border-accent bg-transparent px-6 py-3.5 text-center font-sans text-xs font-semibold uppercase tracking-[0.18em] text-ink transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:text-sm sm:tracking-[0.2em]"
          >
            Create an account
          </Link>
        </section>
      </div>
    </div>
  );
}
