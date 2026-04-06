/**
 * Supabase config resolution.
 *
 * - Use NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY for dev and client.
 * - On the server/middleware, you may also set SUPABASE_URL + SUPABASE_ANON_KEY (same
 *   values). Those are read at runtime and are not baked into the client bundle, which
 *   fixes cases where NEXT_PUBLIC_* was inlined empty during an earlier build, or when
 *   only server env is injected (e.g. some Docker setups).
 */
export function getSupabaseUrl(): string | undefined {
  const v =
    process.env["NEXT_PUBLIC_SUPABASE_URL"]?.trim() ||
    process.env["SUPABASE_URL"]?.trim();
  return v || undefined;
}

export function getSupabaseAnonKey(): string | undefined {
  const v =
    process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]?.trim() ||
    process.env["SUPABASE_ANON_KEY"]?.trim();
  return v || undefined;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

/** Browser bundle only receives NEXT_PUBLIC_* (trimmed). */
export function getBrowserSupabaseUrl(): string | undefined {
  const v = process.env["NEXT_PUBLIC_SUPABASE_URL"]?.trim();
  return v || undefined;
}

export function getBrowserSupabaseAnonKey(): string | undefined {
  const v = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]?.trim();
  return v || undefined;
}
