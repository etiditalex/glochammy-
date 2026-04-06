"use server";

import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { initiateMpesaStkPush } from "@/lib/mpesa/stk-flow";
import { revalidatePath } from "next/cache";
import { parseCreateStorefrontOrderResult, type CheckoutLine } from "@/app/actions/checkout-shared";

export type MpesaCheckoutResult =
  | {
      ok: true;
      orderId: string;
      nonce: string;
      customerMessage: string;
    }
  | { ok: false; error: string };

export async function createMpesaCheckoutAction(input: {
  lines: CheckoutLine[];
  customerEmail: string;
  customerName: string;
  phone: string;
}): Promise<MpesaCheckoutResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Shop checkout is not connected yet." };
  }

  const email = input.customerEmail.trim().toLowerCase();
  const name = input.customerName.trim();
  const phone = input.phone.trim();
  if (!email || !name) {
    return { ok: false, error: "Enter your name and email." };
  }
  if (!phone) {
    return { ok: false, error: "Enter the M-Pesa phone number you will pay with." };
  }
  if (!input.lines.length) {
    return { ok: false, error: "Your bag is empty." };
  }

  for (const line of input.lines) {
    if (line.quantity <= 0) {
      return { ok: false, error: "One or more items have an invalid quantity." };
    }
  }

  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: raw, error: orderError } = await supabase.rpc("create_storefront_order", {
    p_customer_email: email,
    p_customer_name: name,
    p_phone: phone,
    p_items: input.lines.map((l) => ({
      product_id: l.productId,
      quantity: l.quantity,
    })),
  });

  const parsed = parseCreateStorefrontOrderResult(raw);
  if (orderError || !parsed?.orderId || !parsed.mpesaNonce) {
    console.error("createMpesaCheckout", orderError, raw);
    return {
      ok: false,
      error: orderError?.message ?? "Could not create order. Run the latest Supabase migrations.",
    };
  }

  if (parsed.currency !== "KES") {
    return {
      ok: false,
      error: "M-Pesa checkout is only available for prices in KES.",
    };
  }

  const amountKes = Math.round((parsed.totalCents ?? 0) / 100);
  if (amountKes < 1) {
    return { ok: false, error: "Order total is too small to pay with M-Pesa." };
  }

  const stk = await initiateMpesaStkPush({
    phoneRaw: phone,
    amountKes,
    orderId: parsed.orderId,
  });

  if (!stk.ok) {
    return { ok: false, error: stk.error };
  }

  const { data: attached, error: attachError } = await supabase.rpc(
    "attach_mpesa_stk_request",
    {
      p_order_id: parsed.orderId,
      p_nonce: parsed.mpesaNonce,
      p_merchant_request_id: stk.merchantRequestId,
      p_checkout_request_id: stk.checkoutRequestId,
    },
  );

  if (attachError) {
    console.error("attach_mpesa_stk_request", attachError);
    return {
      ok: false,
      error:
        "Payment was started but could not be linked to your order. Contact us with your order reference.",
    };
  }
  if (attached !== true) {
    return {
      ok: false,
      error:
        "Could not link M-Pesa request to this order. If money was deducted, contact support with your order ID.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath("/cart");
  if (user?.id) {
    revalidatePath(`/admin/customers/${user.id}`);
  }

  return {
    ok: true,
    orderId: parsed.orderId,
    nonce: parsed.mpesaNonce,
    customerMessage: stk.customerMessage,
  };
}

export type OrderPollResult =
  | { ok: true; paid: boolean; status: string | null; mpesaReceipt: string | null }
  | { ok: false; error: string };

export async function pollOrderPaymentStatusAction(input: {
  orderId: string;
  nonce: string;
}): Promise<OrderPollResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Not configured." };
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.rpc("order_payment_status_for_nonce", {
    p_order_id: input.orderId,
    p_nonce: input.nonce,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  if (data == null || (typeof data === "object" && data !== null && Object.keys(data).length === 0)) {
    return { ok: false, error: "Order not found." };
  }

  const row = data as {
    paid?: boolean;
    status?: string;
    mpesa_receipt?: string | null;
  };

  return {
    ok: true,
    paid: Boolean(row.paid),
    status: row.status ?? null,
    mpesaReceipt: row.mpesa_receipt ?? null,
  };
}
