import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

/** Staff routes are not meant to be discovered from the public storefront. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-cream px-4 py-16 text-ink sm:px-8">
        <div className="mx-auto max-w-lg border border-line bg-white p-8 font-sans text-sm leading-relaxed">
          <h1 className="font-display text-2xl text-ink">Admin</h1>
          <p className="mt-4 text-muted">
            Add{" "}
            <code className="text-xs text-ink">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code className="text-xs text-ink">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
            <code className="text-xs">.env.local</code> (see <code className="text-xs">.env.example</code>
            ). Restart <code className="text-xs">next dev</code> and run the SQL migration in Supabase.
          </p>
        </div>
      </div>
    );
  }

  return <div className="min-h-screen bg-cream text-ink">{children}</div>;
}
