import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/env";

export function getMpesaConsumerKey(): string | undefined {
  return process.env.MPESA_CONSUMER_KEY?.trim();
}

export function getMpesaConsumerSecret(): string | undefined {
  return process.env.MPESA_CONSUMER_SECRET?.trim();
}

/** Business short code (paybill or till head office number). */
export function getMpesaShortcode(): string | undefined {
  return process.env.MPESA_SHORTCODE?.trim();
}

export function getMpesaPasskey(): string | undefined {
  return process.env.MPESA_PASSKEY?.trim();
}

/**
 * Lipa Na M-Pesa Online password uses this shortcode; may match MPESA_SHORTCODE or differ for some setups.
 */
export function getMpesaPartyB(): string | undefined {
  return process.env.MPESA_PARTY_B?.trim() || getMpesaShortcode();
}

export function getMpesaCallbackUrl(): string | undefined {
  return process.env.MPESA_CALLBACK_URL?.trim();
}

/** CustomerPayBillOnline | CustomerBuyGoodsOnline */
export function getMpesaTransactionType(): string {
  return (
    process.env.MPESA_TRANSACTION_TYPE?.trim() || "CustomerPayBillOnline"
  );
}

export function getMpesaBaseUrl(): string {
  const sandbox = process.env.MPESA_USE_SANDBOX !== "false";
  return sandbox
    ? "https://sandbox.safaricom.co.ke"
    : "https://api.safaricom.co.ke";
}

/**
 * True when Daraja credentials, public callback URL, and Supabase service role are set.
 * The service role is required so the STK callback can mark orders paid safely (RLS blocks anon updates).
 */
export function isMpesaConfigured(): boolean {
  return Boolean(
    getMpesaConsumerKey() &&
      getMpesaConsumerSecret() &&
      getMpesaShortcode() &&
      getMpesaPasskey() &&
      getMpesaPartyB() &&
      getMpesaCallbackUrl() &&
      getSupabaseUrl() &&
      getSupabaseServiceRoleKey(),
  );
}
