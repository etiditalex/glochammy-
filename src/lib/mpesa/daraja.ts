import { Buffer } from "node:buffer";
import {
  getMpesaBaseUrl,
  getMpesaConsumerKey,
  getMpesaConsumerSecret,
  getMpesaPartyB,
  getMpesaPasskey,
  getMpesaShortcode,
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
  const base = getMpesaBaseUrl();
  if (!key || !secret) throw new Error("Missing MPESA_CONSUMER_KEY or MPESA_CONSUMER_SECRET");

  const basic = Buffer.from(`${key}:${secret}`).toString("base64");
  const res = await fetch(
    `${base}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: { Authorization: `Basic ${basic}` },
      next: { revalidate: 0 },
    },
  );
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Daraja OAuth failed: ${res.status} ${t}`);
  }
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new Error("Daraja OAuth: no access_token");
  return json.access_token;
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
  const base = getMpesaBaseUrl();

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

  const res = await fetch(`${base}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    next: { revalidate: 0 },
  });

  const json = (await res.json()) as {
    MerchantRequestID?: string;
    CheckoutRequestID?: string;
    ResponseCode?: string;
    ResponseDescription?: string;
    CustomerMessage?: string;
    errorMessage?: string;
  };

  if (!res.ok) {
    return {
      ok: false,
      error: json.errorMessage ?? json.ResponseDescription ?? `HTTP ${res.status}`,
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
