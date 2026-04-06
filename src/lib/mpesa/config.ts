import {
  getSupabaseServiceRoleKey,
  isSupabaseConfigured,
} from "@/lib/supabase/env";

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
 * True when Daraja + callback URL are set and Supabase is wired for checkout.
 * Use this to show **Pay with M-Pesa** and to run STK sandbox/live trials without requiring
 * the service role (orders still create; auto “paid” from callback needs the role).
 */
export function isMpesaStkAvailable(): boolean {
  return Boolean(
    isSupabaseConfigured() &&
      getMpesaConsumerKey() &&
      getMpesaConsumerSecret() &&
      getMpesaShortcode() &&
      getMpesaPasskey() &&
      getMpesaPartyB() &&
      getMpesaCallbackUrl(),
  );
}

/** Service role lets `/api/mpesa/stk-callback` mark orders paid (RLS blocks anon updates). */
export function isMpesaAutoCompleteConfigured(): boolean {
  return Boolean(getSupabaseServiceRoleKey());
}

/**
 * Full automatic flow: STK plus callback can update order status without manual admin steps.
 */
export function isMpesaConfigured(): boolean {
  return isMpesaStkAvailable() && isMpesaAutoCompleteConfigured();
}
