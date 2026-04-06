"use client";

import { registerCustomerAction } from "@/app/actions/auth";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useId, useState } from "react";

type Values = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type Errors = Partial<Record<keyof Values, string>>;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initial: Values = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function validate(v: Values): Errors {
  const errors: Errors = {};
  if (!v.firstName.trim()) errors.firstName = "Enter your first name.";
  if (!v.lastName.trim()) errors.lastName = "Enter your last name.";
  if (!v.email.trim()) errors.email = "Enter your email address.";
  else if (!emailRe.test(v.email.trim())) errors.email = "Enter a valid email.";
  if (!v.password) errors.password = "Choose a password.";
  else if (v.password.length < 8)
    errors.password = "Use at least 8 characters.";
  if (v.password !== v.confirmPassword)
    errors.confirmPassword = "Passwords do not match.";
  return errors;
}

const field =
  "mt-2 w-full border border-line bg-white px-4 py-3 font-sans text-base text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

const label = "font-sans text-xs text-ink sm:text-sm";

export function RegisterForm() {
  const ids = {
    first: useId(),
    last: useId(),
    email: useId(),
    password: useId(),
    confirm: useId(),
  };
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [done, setDone] = useState(false);
  const [doneMessage, setDoneMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((s) => ({ ...s, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = validate(values);
    setErrors(next);
    setServerError(null);
    if (Object.keys(next).length > 0) return;
    setPending(true);
    const result = await registerCustomerAction({
      email: values.email.trim(),
      password: values.password,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
    });
    setPending(false);
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    setDoneMessage(result.message);
    setDone(true);
  }

  return (
    <>
      {done ? (
        <p className="font-sans text-sm leading-relaxed text-ink" role="status">
          {doneMessage}
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor={ids.first} className={label}>
                First name
              </label>
              <input
                id={ids.first}
                name="firstName"
                autoComplete="given-name"
                value={values.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                className={field}
                aria-invalid={errors.firstName ? true : undefined}
              />
              {errors.firstName ? (
                <p className="mt-1 text-sm text-red-700">{errors.firstName}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor={ids.last} className={label}>
                Last name
              </label>
              <input
                id={ids.last}
                name="lastName"
                autoComplete="family-name"
                value={values.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                className={field}
                aria-invalid={errors.lastName ? true : undefined}
              />
              {errors.lastName ? (
                <p className="mt-1 text-sm text-red-700">{errors.lastName}</p>
              ) : null}
            </div>
          </div>

          <div>
            <label htmlFor={ids.email} className={label}>
              Email
            </label>
            <input
              id={ids.email}
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              className={field}
              aria-invalid={errors.email ? true : undefined}
            />
            {errors.email ? (
              <p className="mt-1 text-sm text-red-700">{errors.email}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor={ids.password} className={label}>
              Password
            </label>
            <div className="relative mt-2">
              <input
                id={ids.password}
                name="password"
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
                value={values.password}
                onChange={(e) => set("password", e.target.value)}
                className="w-full border border-line bg-white py-3 pl-4 pr-12 font-sans text-base text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                aria-invalid={errors.password ? true : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-0 top-0 flex h-full w-11 items-center justify-center text-ink/60 hover:text-ink"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? (
                  <EyeOff className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                ) : (
                  <Eye className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                )}
              </button>
            </div>
            {errors.password ? (
              <p className="mt-1 text-sm text-red-700">{errors.password}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor={ids.confirm} className={label}>
              Confirm password
            </label>
            <div className="relative mt-2">
              <input
                id={ids.confirm}
                name="confirmPassword"
                type={showPw2 ? "text" : "password"}
                autoComplete="new-password"
                value={values.confirmPassword}
                onChange={(e) => set("confirmPassword", e.target.value)}
                className="w-full border border-line bg-white py-3 pl-4 pr-12 font-sans text-base text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                aria-invalid={errors.confirmPassword ? true : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPw2((v) => !v)}
                className="absolute right-0 top-0 flex h-full w-11 items-center justify-center text-ink/60 hover:text-ink"
                aria-label={showPw2 ? "Hide password" : "Show password"}
              >
                {showPw2 ? (
                  <EyeOff className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                ) : (
                  <Eye className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                )}
              </button>
            </div>
            {errors.confirmPassword ? (
              <p className="mt-1 text-sm text-red-700">
                {errors.confirmPassword}
              </p>
            ) : null}
          </div>

          {serverError ? (
            <p className="font-sans text-sm text-red-700" role="alert">
              {serverError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 w-full border border-accent bg-transparent px-6 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-ink transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink enabled:cursor-pointer enabled:hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
          >
            {pending ? "Creating…" : "Create an account"}
          </button>
        </form>
      )}

      <p className="mt-8 text-center font-sans text-sm text-muted">
        Already have an account?{" "}
        <Link
          href="/account"
          className="text-ink underline decoration-1 underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
