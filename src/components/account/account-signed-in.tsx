"use client";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  email: string;
  profileName: string | null;
};

export function AccountSignedIn({ email, profileName }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    try {
      const supabase = createBrowserSupabaseClient();
      await supabase.auth.signOut();
    } catch {
      /* configured check */
    }
    setPending(false);
    router.push("/account");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">
          Signed in
        </h2>
        <p className="mt-3 font-sans text-sm leading-[1.65] text-ink sm:text-base">
          {profileName ? (
            <>
              Hello, <span className="text-ink">{profileName}</span>.
            </>
          ) : null}{" "}
          You are signed in as{" "}
          <span className="break-all text-ink">{email}</span>.
        </p>
      </div>

      <button
        type="button"
        onClick={() => void signOut()}
        disabled={pending}
        className="w-full border border-accent bg-transparent px-6 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-ink transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-50 sm:text-sm"
      >
        {pending ? "Signing out…" : "Sign out"}
      </button>
    </div>
  );
}
