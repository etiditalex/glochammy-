import { RegisterForm } from "@/components/account/register-form";
import { BRAND } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an account",
  description: `Create a ${BRAND.shortName} customer account.`,
};

export default function RegisterPage() {
  return (
    <div className="min-h-[70vh] w-full min-w-0 bg-[#fafaf8] pb-20 pt-12 sm:pb-24 sm:pt-16">
      <div className="mx-auto w-full max-w-lg px-4 sm:px-6 md:max-w-xl md:px-8">
        <h1 className="text-center font-display text-4xl font-medium text-ink sm:text-5xl">
          Create an account
        </h1>
        <p className="mt-4 text-center font-sans text-sm leading-relaxed text-muted">
          Join {BRAND.shortName}—we&apos;ll connect this to Supabase when your
          backend is ready.
        </p>

        <div className="mt-10 border border-line/60 bg-[#ebe6df] px-6 py-8 sm:px-8 sm:py-10">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
