import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  getMpesaCallbackUrl,
  getMpesaConsumerKey,
  getMpesaConsumerSecret,
  getMpesaOAuthUrl,
  getMpesaPartyB,
  getMpesaPasskey,
  getMpesaShortcode,
  getMpesaStkPushQueryUrl,
  getMpesaStkPushUrl,
  isMpesaAutoCompleteConfigured,
  isMpesaStkAvailable,
} from "@/lib/mpesa/config";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { Buffer } from "node:buffer";

type CheckStatus = "pass" | "warn" | "fail";

export type MpesaDiagnosticCheck = {
  id: string;
  label: string;
  status: CheckStatus;
  message: string;
};

export type MpesaDiagnosticsReport = {
  checkedAtIso: string;
  checks: MpesaDiagnosticCheck[];
};

async function fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    return await fetch(url, { ...init, signal: controller.signal, cache: "no-store" });
  } finally {
    clearTimeout(timeout);
  }
}

function pass(id: string, label: string, message: string): MpesaDiagnosticCheck {
  return { id, label, status: "pass", message };
}

function warn(id: string, label: string, message: string): MpesaDiagnosticCheck {
  return { id, label, status: "warn", message };
}

function fail(id: string, label: string, message: string): MpesaDiagnosticCheck {
  return { id, label, status: "fail", message };
}

export async function runMpesaDiagnostics(): Promise<MpesaDiagnosticsReport> {
  const checks: MpesaDiagnosticCheck[] = [];

  if (isSupabaseConfigured()) {
    checks.push(pass("supabase-core", "Supabase URL + anon key", "Configured."));
  } else {
    checks.push(
      fail(
        "supabase-core",
        "Supabase URL + anon key",
        "Missing NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_*).",
      ),
    );
  }

  const envChecks: Array<[string, string, string | undefined]> = [
    ["mpesa-consumer-key", "MPESA_CONSUMER_KEY", getMpesaConsumerKey()],
    ["mpesa-consumer-secret", "MPESA_CONSUMER_SECRET", getMpesaConsumerSecret()],
    ["mpesa-shortcode", "MPESA_SHORTCODE", getMpesaShortcode()],
    ["mpesa-passkey", "MPESA_PASSKEY", getMpesaPasskey()],
    ["mpesa-party-b", "MPESA_PARTY_B", getMpesaPartyB()],
    ["mpesa-callback-url", "MPESA_CALLBACK_URL", getMpesaCallbackUrl()],
  ];

  for (const [id, key, value] of envChecks) {
    checks.push(
      value
        ? pass(id, key, "Set.")
        : fail(id, key, `Missing ${key}. Add it in Vercel project environment variables.`),
    );
  }

  const callbackUrl = getMpesaCallbackUrl();
  if (callbackUrl) {
    if (!/^https:\/\//i.test(callbackUrl)) {
      checks.push(
        warn(
          "callback-https",
          "Callback URL protocol",
          "Callback is not HTTPS. Live Daraja callback requires public HTTPS.",
        ),
      );
    } else if (!/\/api\/mpesa\/stk-callback\/?$/i.test(callbackUrl)) {
      checks.push(
        warn(
          "callback-path",
          "Callback URL path",
          "Callback URL does not end with /api/mpesa/stk-callback. Verify Daraja app settings.",
        ),
      );
    } else {
      checks.push(pass("callback-format", "Callback URL format", "Looks correct for this app."));
    }
  }

  if (isMpesaStkAvailable()) {
    checks.push(pass("stk-available", "STK prerequisites", "Checkout can trigger STK requests."));
  } else {
    checks.push(
      fail(
        "stk-available",
        "STK prerequisites",
        "STK is not fully configured. Resolve missing MPESA_* and callback settings above.",
      ),
    );
  }

  if (isMpesaAutoCompleteConfigured()) {
    checks.push(
      pass(
        "service-role",
        "SUPABASE_SERVICE_ROLE_KEY",
        "Set. Callback can auto-update order status.",
      ),
    );
  } else {
    checks.push(
      fail(
        "service-role",
        "SUPABASE_SERVICE_ROLE_KEY",
        "Missing. Callback cannot mark orders paid/cancelled automatically.",
      ),
    );
  }

  const key = getMpesaConsumerKey();
  const secret = getMpesaConsumerSecret();
  if (key && secret) {
    try {
      const basic = Buffer.from(`${key}:${secret}`).toString("base64");
      const oauthRes = await fetchWithTimeout(getMpesaOAuthUrl(), {
        headers: { Authorization: `Basic ${basic}` },
      });
      const text = await oauthRes.text();
      if (!oauthRes.ok) {
        checks.push(
          fail(
            "daraja-oauth",
            "Daraja OAuth token",
            `OAuth failed (${oauthRes.status}). ${text || "No response body."}`,
          ),
        );
      } else {
        checks.push(pass("daraja-oauth", "Daraja OAuth token", "Token request succeeded."));
      }
    } catch (error) {
      checks.push(
        fail(
          "daraja-oauth",
          "Daraja OAuth token",
          `OAuth request error: ${error instanceof Error ? error.message : "Unknown error"}`,
        ),
      );
    }
  }

  for (const [id, label, url] of [
    ["stk-endpoint", "STK push endpoint", getMpesaStkPushUrl()],
    ["stk-query-endpoint", "STK query endpoint", getMpesaStkPushQueryUrl()],
  ] as const) {
    try {
      const res = await fetchWithTimeout(url, { method: "OPTIONS" });
      if (res.status >= 200 && res.status < 500) {
        checks.push(pass(id, label, `Reachable (${res.status}).`));
      } else {
        checks.push(warn(id, label, `Unexpected HTTP ${res.status}.`));
      }
    } catch (error) {
      checks.push(
        warn(
          id,
          label,
          `Could not reach endpoint: ${error instanceof Error ? error.message : "Unknown error"}`,
        ),
      );
    }
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      const randomId = crypto.randomUUID();
      const { error } = await supabase.rpc("order_payment_status_for_nonce", {
        p_order_id: randomId,
        p_nonce: randomId,
      });
      if (error?.message?.toLowerCase().includes("could not find the function")) {
        checks.push(
          fail(
            "poll-rpc",
            "order_payment_status_for_nonce RPC",
            "RPC is missing on this database. Run latest Supabase migrations in production.",
          ),
        );
      } else if (error) {
        checks.push(warn("poll-rpc", "order_payment_status_for_nonce RPC", error.message));
      } else {
        checks.push(pass("poll-rpc", "order_payment_status_for_nonce RPC", "Available."));
      }
    } catch (error) {
      checks.push(
        warn(
          "poll-rpc",
          "order_payment_status_for_nonce RPC",
          `Could not verify RPC: ${error instanceof Error ? error.message : "Unknown error"}`,
        ),
      );
    }
  }

  return {
    checkedAtIso: new Date().toISOString(),
    checks,
  };
}
