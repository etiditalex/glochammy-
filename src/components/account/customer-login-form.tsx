"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useId, useState } from "react";

type LoginErrors = Partial<{ email: string; password: string }>;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(email: string, password: string): LoginErrors {
  const errors: LoginErrors = {};
  if (!email.trim()) errors.email = "Enter your email address.";
  else if (!emailRe.test(email.trim()))
    errors.email = "Enter a valid email address.";
  if (!password) errors.password = "Enter your password.";
  return errors;
}

export function CustomerLoginForm() {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = validate(email, password);
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="font-sans text-sm leading-relaxed text-ink" role="status">
        Sign-in UI is ready. Account authentication will connect to Supabase in a
        later step.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div>
        <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">
          Login
        </h2>
        <p className="mt-3 font-sans text-sm leading-[1.65] text-ink sm:text-base">
          If you have an account, sign in with your email address.
        </p>
      </div>

      <div>
        <label htmlFor={emailId} className="font-sans text-xs text-ink sm:text-sm">
          Email
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((x) => ({ ...x, email: undefined }));
          }}
          className="mt-2 w-full border border-line bg-white px-4 py-3 font-sans text-base text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          aria-invalid={errors.email ? true : undefined}
        />
        {errors.email ? (
          <p className="mt-2 font-sans text-sm text-red-700">{errors.email}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor={passwordId} className="font-sans text-xs text-ink sm:text-sm">
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
            className="absolute right-0 top-0 flex h-full w-11 items-center justify-center text-ink/60 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
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

      <button
        type="submit"
        className="w-full border border-accent bg-transparent px-6 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-ink transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:text-sm"
      >
        Sign in
      </button>

      <p className="text-center font-sans text-sm">
        <Link
          href="/account/forgot-password"
          className="text-ink underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
        >
          Forgot Your Password?
        </Link>
      </p>
    </form>
  );
}
