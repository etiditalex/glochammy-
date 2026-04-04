import { BRAND } from "@/lib/constants";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Forgot password",
  description: `Reset your ${BRAND.shortName} account password.`,
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[50vh] w-full min-w-0 bg-[#fafaf8] pb-20 pt-12 sm:pt-16">
      <div className="mx-auto w-full max-w-lg px-4 sm:px-6 md:px-8">
        <h1 className="text-center font-display text-4xl font-medium text-ink sm:text-5xl">
          Forgot your password?
        </h1>
        <div className="mt-10 border border-line/60 bg-[#ebe6df] px-6 py-8 sm:px-8 sm:py-10">
          <p className="font-sans text-sm leading-[1.7] text-ink sm:text-base">
            Password reset by email will be available once authentication is
            connected to Supabase. Until then, contact us and we can help you
            recover access.
          </p>
          <p className="mt-6 font-sans text-sm text-muted">
            <Link
              href="/contact"
              className="text-ink underline decoration-1 underline-offset-4"
            >
              Contact customer care
            </Link>
            {" · "}
            <Link
              href="/account"
              className="text-ink underline decoration-1 underline-offset-4"
            >
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
