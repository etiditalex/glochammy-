import { EmailVerifyForm } from "@/components/account/email-verify-form";
import { BRAND } from "@/lib/constants";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Verify email",
  description: `Confirm your email to finish creating your ${BRAND.shortName} account.`,
};

export default function VerifyEmailPage() {
  return (
    <div className="min-h-[50vh] w-full min-w-0 bg-[#fafaf8] pb-20 pt-12 sm:pt-16">
      <div className="mx-auto w-full max-w-lg px-4 sm:px-6 md:max-w-xl md:px-8">
        <h1 className="text-center font-display text-4xl font-medium text-ink sm:text-5xl">
          Verify your email
        </h1>
        <div className="mt-10 border border-line/60 bg-[#ebe6df] px-6 py-8 sm:mt-12 sm:px-8 sm:py-10">
          <EmailVerifyForm />
        </div>
        <p className="mt-8 text-center font-sans text-sm text-muted">
          <Link
            href="/account"
            className="text-ink underline decoration-1 underline-offset-4"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
