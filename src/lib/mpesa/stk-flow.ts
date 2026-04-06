import { initiateStkPush } from "@/lib/mpesa/daraja";
import { isMpesaStkAvailable } from "@/lib/mpesa/config";
import { normalizeKenyaMsisdnForStk } from "@/lib/mpesa/phone";

export type StkFlowResult =
  | {
      ok: true;
      merchantRequestId: string;
      checkoutRequestId: string;
      customerMessage: string;
    }
  | { ok: false; error: string };

/**
 * Validates env + phone, then calls Daraja STK Push.
 */
export async function initiateMpesaStkPush(input: {
  phoneRaw: string;
  amountKes: number;
  orderId: string;
}): Promise<StkFlowResult> {
  if (!isMpesaStkAvailable()) {
    return {
      ok: false,
      error:
        "M-Pesa STK is not configured. Set MPESA_* and MPESA_CALLBACK_URL, and Supabase URL/anon key.",
    };
  }

  const phone254 = normalizeKenyaMsisdnForStk(input.phoneRaw);
  if (!phone254) {
    return {
      ok: false,
      error: "Enter a valid Kenya number (e.g. 07XXXXXXXX or 2547XXXXXXXX).",
    };
  }

  const accountRef = input.orderId.replace(/-/g, "").slice(0, 12);
  const r = await initiateStkPush({
    phone254,
    amountKes: input.amountKes,
    accountReference: accountRef || "ORDER",
    transactionDesc: input.orderId.replace(/-/g, "").slice(0, 13),
  });

  if (!r.ok) {
    return { ok: false, error: r.error };
  }

  return {
    ok: true,
    merchantRequestId: r.merchantRequestId,
    checkoutRequestId: r.checkoutRequestId,
    customerMessage: r.customerMessage,
  };
}
