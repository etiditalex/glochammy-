import { Buffer } from "node:buffer";
import {
  getMpesaConsumerKey,
  getMpesaConsumerSecret,
  getMpesaOAuthUrl,
  getMpesaPartyB,
  getMpesaPasskey,
  getMpesaShortcode,
  getMpesaStkPushQueryUrl,
  getMpesaStkPushUrl,
  getMpesaTransactionType,
  getMpesaCallbackUrl,
} from "@/lib/mpesa/config";

function darajaTimestampNairobi(): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const g = (t: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === t)?.value ?? "00";
  const y = g("year");
  const mo = g("month");
  const d = g("day");
  const h = g("hour");
  const mi = g("minute");
  const s = g("second");
  return `${y}${mo}${d}${h}${mi}${s}`;
}

function stkPassword(shortcode: string, passkey: string, timestamp: string): string {
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
}

async function fetchAccessToken(): Promise<string> {
  const key = getMpesaConsumerKey();
  const secret = getMpesaConsumerSecret();
  if (!key || !secret) throw new Error("Missing MPESA_CONSUMER_KEY or MPESA_CONSUMER_SECRET");

  const basic = Buffer.from(`${key}:${secret}`).toString("base64");
  const res = await fetch(getMpesaOAuthUrl(), {
    headers: { Authorization: `Basic ${basic}` },
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Daraja OAuth failed: ${res.status} ${t}`);
  }
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new Error("Daraja OAuth: no access_token");
  return json.access_token;
}

async function readJsonSafe(res: Response): Promise<Record<string, unknown>> {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { raw: text };
  }
}

export type StkInitResult =
  | {
      ok: true;
      merchantRequestId: string;
      checkoutRequestId: string;
      customerMessage: string;
    }
  | { ok: false; error: string; responseCode?: string };

/**
 * Lipa Na M-Pesa Online (STK Push). Amount is whole KES (not cents).
 */
export async function initiateStkPush(input: {
  phone254: string;
  amountKes: number;
  accountReference: string;
  transactionDesc: string;
}): Promise<StkInitResult> {
  const shortcode = getMpesaShortcode();
  const passkey = getMpesaPasskey();
  const partyB = getMpesaPartyB();
  const callback = getMpesaCallbackUrl();
  const txType = getMpesaTransactionType();

  if (!shortcode || !passkey || !partyB || !callback) {
    return { ok: false, error: "M-Pesa is not fully configured on the server." };
  }

  if (!Number.isFinite(input.amountKes) || input.amountKes < 1) {
    return { ok: false, error: "Invalid payment amount." };
  }

  const businessCode = Number.parseInt(shortcode, 10);
  const partyBN = Number.parseInt(partyB, 10);
  if (!Number.isFinite(businessCode) || !Number.isFinite(partyBN)) {
    return { ok: false, error: "MPESA_SHORTCODE and MPESA_PARTY_B must be numeric short codes." };
  }

  const timestamp = darajaTimestampNairobi();
  const password = stkPassword(shortcode, passkey, timestamp);
  const token = await fetchAccessToken();

  const amt = String(Math.round(input.amountKes));
  const body = {
    BusinessShortCode: businessCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: txType,
    Amount: amt,
    PartyA: input.phone254,
    PartyB: partyBN,
    PhoneNumber: input.phone254,
    CallBackURL: callback,
    AccountReference: input.accountReference.slice(0, 12),
    TransactionDesc: input.transactionDesc.slice(0, 13),
  };

  const res = await fetch(getMpesaStkPushUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    next: { revalidate: 0 },
  });

  const json = (await readJsonSafe(res)) as {
    MerchantRequestID?: string;
    CheckoutRequestID?: string;
    ResponseCode?: string;
    ResponseDescription?: string;
    CustomerMessage?: string;
    errorMessage?: string;
    errorCode?: string;
    requestId?: string;
  };

  if (!res.ok) {
    return {
      ok: false,
      error:
        json.errorMessage ??
        json.ResponseDescription ??
        (json.raw ? String(json.raw) : `HTTP ${res.status}`),
    };
  }

  if (json.ResponseCode !== "0") {
    return {
      ok: false,
      error: json.ResponseDescription ?? "STK request rejected by M-Pesa",
      responseCode: json.ResponseCode,
    };
  }

  if (!json.MerchantRequestID || !json.CheckoutRequestID) {
    return { ok: false, error: "M-Pesa did not return request IDs." };
  }

  return {
    ok: true,
    merchantRequestId: json.MerchantRequestID,
    checkoutRequestId: json.CheckoutRequestID,
    customerMessage: json.CustomerMessage ?? "Check your phone to approve payment.",
  };
}

export type StkQueryResult =
  | { ok: true; resultCode: number; resultDesc: string | null }
  | { ok: false; error: string };

export async function queryStkPushStatus(checkoutRequestId: string): Promise<StkQueryResult> {
  const shortcode = getMpesaShortcode();
  const passkey = getMpesaPasskey();
  if (!shortcode || !passkey) {
    return { ok: false, error: "M-Pesa shortcode/passkey missing." };
  }
  if (!checkoutRequestId.trim()) {
    return { ok: false, error: "Checkout request ID is missing." };
  }

  const businessCode = Number.parseInt(shortcode, 10);
  if (!Number.isFinite(businessCode)) {
    return { ok: false, error: "MPESA_SHORTCODE must be numeric." };
  }

  const timestamp = darajaTimestampNairobi();
  const password = stkPassword(shortcode, passkey, timestamp);
  const token = await fetchAccessToken();

  const res = await fetch(getMpesaStkPushQueryUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      BusinessShortCode: businessCode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId.trim(),
    }),
    next: { revalidate: 0 },
  });

  const json = (await readJsonSafe(res)) as {
    ResultCode?: string | number;
    ResultDesc?: string;
    errorMessage?: string;
    ResponseDescription?: string;
    raw?: string;
  };

  if (!res.ok) {
    return {
      ok: false,
      error:
        json.errorMessage ??
        json.ResponseDescription ??
        (json.raw ? String(json.raw) : `HTTP ${res.status}`),
    };
  }

  const parsedCode = Number(json.ResultCode);
  if (!Number.isFinite(parsedCode)) {
    return { ok: false, error: json.ResultDesc ?? "Invalid STK query response from Daraja." };
  }

  return { ok: true, resultCode: parsedCode, resultDesc: json.ResultDesc ?? null };
}
