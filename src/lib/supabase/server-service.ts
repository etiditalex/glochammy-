import { createClient } from "@supabase/supabase-js";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/env";

/** Bypasses RLS. Use only from Route Handlers / server code that is already trusted (e.g. payment webhooks). */
export function createServiceSupabaseClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseServiceRoleKey();
  if (!url || !key) {
    throw new Error(
      "Missing Supabase URL or SUPABASE_SERVICE_ROLE_KEY for service client.",
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
