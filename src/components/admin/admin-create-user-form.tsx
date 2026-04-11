"use client";

import { createDashboardUserAction } from "@/app/actions/admin-users";
import { type FormEvent, useState, useTransition } from "react";

export function AdminCreateUserForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"admin" | "customer">("admin");
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFeedback(null);
    startTransition(async () => {
      const res = await createDashboardUserAction({
        email,
        password,
        fullName,
        role,
      });
      if (res.ok) {
        setFeedback({ ok: true, text: res.message });
        setEmail("");
        setPassword("");
        setFullName("");
        setRole("admin");
      } else {
        setFeedback({ ok: false, text: res.error });
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 border border-line bg-white p-6 sm:p-8">
      <div>
        <h2 className="font-display text-xl text-ink">Create account</h2>
        <p className="mt-2 text-sm text-muted">
          Creates a Supabase Auth user and sets their <span className="font-mono text-xs">profiles.role</span>.
          <strong className="font-medium text-ink"> Admin</strong> can open this dashboard;{" "}
          <strong className="font-medium text-ink">Customer</strong> is for the storefront only.
        </p>
        <p className="mt-3 text-2xs leading-relaxed text-muted">
          Requires <span className="font-mono">SUPABASE_SERVICE_ROLE_KEY</span> on the server (never
          exposed to the browser). Set it in Vercel or <span className="font-mono">.env.local</span> and
          redeploy if account creation fails.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="staff-full-name" className="text-2xs font-medium uppercase tracking-nav text-muted">
            Full name
          </label>
          <input
            id="staff-full-name"
            name="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            autoComplete="name"
            className="mt-2 w-full border border-line bg-cream px-3 py-2.5 text-sm text-ink"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="staff-email" className="text-2xs font-medium uppercase tracking-nav text-muted">
            Email
          </label>
          <input
            id="staff-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
            className="mt-2 w-full border border-line bg-cream px-3 py-2.5 text-sm text-ink"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="staff-password" className="text-2xs font-medium uppercase tracking-nav text-muted">
            Initial password
          </label>
          <input
            id="staff-password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-2 w-full border border-line bg-cream px-3 py-2.5 text-sm text-ink"
          />
          <p className="mt-1 text-2xs text-muted">At least 8 characters. Ask them to change it after first sign-in.</p>
        </div>
        <div className="sm:col-span-2">
          <fieldset>
            <legend className="text-2xs font-medium uppercase tracking-nav text-muted">Role</legend>
            <div className="mt-3 flex flex-wrap gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  checked={role === "admin"}
                  onChange={() => setRole("admin")}
                />
                <span className="text-sm text-ink">Admin — dashboard access</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  checked={role === "customer"}
                  onChange={() => setRole("customer")}
                />
                <span className="text-sm text-ink">Customer — shop account only</span>
              </label>
            </div>
          </fieldset>
        </div>
      </div>

      {feedback ? (
        <p
          role="status"
          className={
            feedback.ok
              ? "rounded-none border border-line bg-subtle px-4 py-3 text-sm text-ink"
              : "rounded-none border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
          }
        >
          {feedback.text}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-[44px] items-center justify-center border border-ink bg-ink px-6 text-2xs font-medium uppercase tracking-nav text-cream hover:bg-ink/90 disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create account"}
      </button>
    </form>
  );
}
