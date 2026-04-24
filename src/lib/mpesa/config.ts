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

export function getMpesaBaseUrl(): string {
  const explicit = process.env.MPESA_BASE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const sandbox = process.env.MPESA_USE_SANDBOX !== "false";
  return sandbox
    ? "https://sandbox.safaricom.co.ke"
    : "https://api.safaricom.co.ke";
}

function resolveDarajaUrl(explicit: string | undefined, fallbackPath: string): string {
  if (explicit && explicit.trim()) return explicit.trim();
  return `${getMpesaBaseUrl()}${fallbackPath}`;
}

export function getMpesaStkPushUrl(): string {
  return resolveDarajaUrl(
    process.env.MPESA_STKPUSH_URL,
    "/mpesa/stkpush/v1/processrequest",
  );
}

export function getMpesaStkPushQueryUrl(): string {
  return resolveDarajaUrl(
    process.env.MPESA_STKPUSH_QUERY_URL,
    "/mpesa/stkpushquery/v1/query",
  );
}

export function getMpesaB2cUrl(): string {
  return resolveDarajaUrl(
    process.env.MPESA_B2C_URL,
    "/mpesa/b2c/v1/paymentrequest",
  );
}

export function getMpesaTransactionStatusUrl(): string {
  return resolveDarajaUrl(
    process.env.MPESA_TRANSACTION_STATUS_URL,
    "/mpesa/transactionstatus/v1/query",
  );
}

export function getMpesaAccountBalanceUrl(): string {
  return resolveDarajaUrl(
    process.env.MPESA_ACCOUNT_BALANCE_URL,
    "/mpesa/accountbalance/v1/query",
  );
}

export function getMpesaOAuthUrl(): string {
  const explicit = process.env.MPESA_OAUTH_URL?.trim();
  if (explicit) {
    // Safaricom proxy links sometimes already include grant_type; append only when missing.
    return explicit.includes("grant_type=")
      ? explicit
      : `${explicit}${explicit.includes("?") ? "&" : "?"}grant_type=client_credentials`;
  }
  return `${getMpesaBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`;
}

export function getMpesaB2cSecurityCredential(): string | undefined {
  return process.env.MPESA_B2C_SECURITY_CREDENTIAL?.trim();
}

/**
 * Lipa Na M-Pesa Online password uses this shortcode; may match MPESA_SHORTCODE or differ for some setups.
 */
export function getMpesaPartyB(): string | undefined {
  return process.env.MPESA_PARTY_B?.trim() || getMpesaShortcode();
}

export function getMpesaCallbackUrl(): string | undefined {
  const explicit = process.env.MPESA_CALLBACK_URL?.trim();
  if (explicit) return explicit;

  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (site) return `${site.replace(/\/+$/, "")}/api/daraja/callback`;

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return `https://${vercelUrl.replace(/\/+$/, "")}/api/daraja/callback`;

  return undefined;
}

/** CustomerPayBillOnline | CustomerBuyGoodsOnline */
export function getMpesaTransactionType(): string {
  return (
    process.env.MPESA_TRANSACTION_TYPE?.trim() || "CustomerPayBillOnline"
  );
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
