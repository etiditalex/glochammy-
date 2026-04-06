"use client";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { type FormEvent, useId, useState } from "react";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailVerifyForm() {
  const router = useRouter();
  const emailId = useId();
  const codeId = useId();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !emailRe.test(email.trim())) {
      setError("Enter the email you used to register.");
      return;
    }
    if (!code.trim()) {
      setError("Enter the code from your email.");
      return;
    }
    setPending(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: code.trim().replace(/\s/g, ""),
        type: "signup",
      });
      setPending(false);
      if (verifyError) {
        setError(verifyError.message);
        return;
      }
      router.push("/account");
      router.refresh();
    } catch {
      setPending(false);
      setError("Verification needs Supabase environment variables in this project.");
    }
  }

  const field =
    "mt-2 w-full border border-line bg-white px-4 py-3 font-sans text-base text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="space-y-5" noValidate>
      <p className="font-sans text-sm leading-relaxed text-ink">
        If your email shows a one-time code instead of a button, enter it below.
        You can also use the link in the same message.
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
      </div>

      <div>
        <label htmlFor={codeId} className="font-sans text-xs text-ink sm:text-sm">
          Verification code
        </label>
        <input
          id={codeId}
          inputMode="numeric"
          autoComplete="one-time-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className={field}
        />
      </div>

      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full border border-accent bg-transparent px-6 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-ink transition-opacity hover:opacity-70 disabled:opacity-50 sm:text-sm"
      >
        {pending ? "Verifying…" : "Verify and continue"}
      </button>
    </form>
  );
}
