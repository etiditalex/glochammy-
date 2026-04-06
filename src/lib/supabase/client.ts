import { createBrowserClient } from "@supabase/ssr";
import { getBrowserSupabaseAnonKey, getBrowserSupabaseUrl } from "@/lib/supabase/env";

export function createBrowserSupabaseClient() {
  const url = getBrowserSupabaseUrl();
  const key = getBrowserSupabaseAnonKey();
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY (restart next dev after editing .env.local).",
    );
  }
  return createBrowserClient(url, key);
}
