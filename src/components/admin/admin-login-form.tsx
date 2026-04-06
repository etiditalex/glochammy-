"use client";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { BRAND } from "@/lib/constants";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type Errors = Partial<{ email: string; password: string }>;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(email: string, password: string): Errors {
  const errors: Errors = {};
  if (!email.trim()) errors.email = "Enter your staff email.";
  else if (!emailRe.test(email.trim())) errors.email = "Enter a valid email.";
  if (!password) errors.password = "Enter your password.";
  return errors;
}

const field =
  "mt-2 w-full border border-line bg-white px-4 py-3 font-sans text-base text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
const label = "font-sans text-xs text-ink sm:text-sm";

export function AdminLoginForm() {
  const router = useRouter();
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = validate(email, password);
    setErrors(next);
    setAuthError(null);
    if (Object.keys(next).length > 0) return;

    setPending(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setPending(false);
        setAuthError(error.message);
        return;
      }
      if (!data.user) {
        setPending(false);
        setAuthError("Sign-in failed.");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileError || profile?.role !== "admin") {
        await supabase.auth.signOut();
        setPending(false);
        setAuthError(
          "This account does not have staff access. Use the customer sign-in on the main site if you are shopping with us.",
        );
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setPending(false);
      setAuthError(
        "Could not reach the sign-in service. Check your connection and Supabase settings, then restart the dev server.",
      );
    }
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="space-y-6" noValidate>
      <div>
        <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">Staff sign in</h2>
        <p className="mt-3 font-sans text-sm leading-[1.65] text-muted sm:text-base">
          Dashboard access for {BRAND.shortName} administrators only. Customer accounts are managed
          from{" "}
          <Link href="/account" className="text-ink underline underline-offset-4 hover:opacity-70">
            My account
          </Link>
          .
        </p>
      </div>

      <div>
        <label htmlFor={emailId} className={label}>
          Staff email
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((x) => ({ ...x, email: undefined }));
          }}
          className={field}
          aria-invalid={errors.email ? true : undefined}
        />
        {errors.email ? (
          <p className="mt-2 font-sans text-sm text-red-700">{errors.email}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor={passwordId} className={label}>
          Password
        </label>
        <div className="relative mt-2">
          <input
            id={passwordId}
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((x) => ({ ...x, password: undefined }));
            }}
            className="w-full border border-line bg-white py-3 pl-4 pr-12 font-sans text-base text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            aria-invalid={errors.password ? true : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-0 top-0 flex h-full w-11 items-center justify-center text-ink/60 hover:text-ink"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" strokeWidth={1.5} aria-hidden />
            ) : (
              <Eye className="h-5 w-5" strokeWidth={1.5} aria-hidden />
            )}
          </button>
        </div>
        {errors.password ? (
          <p className="mt-2 font-sans text-sm text-red-700">{errors.password}</p>
        ) : null}
      </div>

      {authError ? (
        <p className="font-sans text-sm text-red-700" role="alert">
          {authError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full border border-accent bg-transparent px-6 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-ink transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
      >
        {pending ? "Signing in…" : "Sign in to dashboard"}
      </button>

      <p className="text-center font-sans text-sm text-muted">
        <Link href="/" className="text-ink underline decoration-1 underline-offset-4">
          Back to website
        </Link>
      </p>
    </form>
  );
}
