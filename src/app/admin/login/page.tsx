import { AdminLoginForm } from "@/components/admin/admin-login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staff sign in",
  description: "Sign in to the Glochammy admin dashboard.",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center px-4 py-16 sm:px-8">
      <div className="mx-auto w-full max-w-lg">
        <p className="text-center text-2xs font-medium uppercase tracking-nav text-muted">
          Admin
        </p>
        <h1 className="mt-2 text-center font-display text-3xl font-medium text-ink sm:text-4xl">
          Dashboard access
        </h1>
        <div className="mt-10 border border-line/60 bg-[#ebe6df] px-6 py-8 sm:px-8 sm:py-10">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
