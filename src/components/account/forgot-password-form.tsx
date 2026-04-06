"use client";

import { requestPasswordResetAction } from "@/app/actions/auth";
import Link from "next/link";
import { type FormEvent, useId, useState } from "react";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordForm() {
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !emailRe.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    setPending(true);
    const result = await requestPasswordResetAction(email.trim());
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setMessage(result.message);
    setDone(true);
  }

  const field =
    "mt-2 w-full border border-line bg-white px-4 py-3 font-sans text-base text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

  if (done) {
    return (
      <p className="font-sans text-sm leading-[1.7] text-ink sm:text-base" role="status">
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="space-y-6" noValidate>
      <p className="font-sans text-sm leading-[1.7] text-ink sm:text-base">
        Enter the email on your account and we will send reset instructions.
      </p>

      <div>
        <label htmlFor={emailId} className="font-sans text-xs text-ink sm:text-sm">
          Email
        </label>
        <input
          id={emailId}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={field}
        />
        {error ? (
          <p className="mt-2 font-sans text-sm text-red-700">{error}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full border border-accent bg-transparent px-6 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-ink transition-opacity hover:opacity-70 disabled:opacity-50 sm:text-sm"
      >
        {pending ? "Sending…" : "Send reset link"}
      </button>

      <p className="font-sans text-sm text-muted">
        <Link
          href="/account"
          className="text-ink underline decoration-1 underline-offset-4"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
