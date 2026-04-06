"use server";

import {
  mapCreateStorefrontOrderError,
  parseCreateStorefrontOrderResult,
  type CheckoutLine,
} from "@/app/actions/checkout-shared";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type { CheckoutLine };

export type CheckoutResult =
  | { ok: true; orderId: string }
  | { ok: false; error: string };

export async function createOrderAction(input: {
  lines: CheckoutLine[];
  customerEmail: string;
  customerName: string;
  phone?: string;
}): Promise<CheckoutResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Shop checkout is not connected yet." };
  }

  const email = input.customerEmail.trim().toLowerCase();
  const name = input.customerName.trim();
  if (!email || !name) {
    return { ok: false, error: "Enter your name and email." };
  }
  if (!input.lines.length) {
    return { ok: false, error: "Your bag is empty." };
  }

  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  for (const line of input.lines) {
    if (line.quantity <= 0) {
      return { ok: false, error: "One or more items have an invalid quantity." };
    }
  }

  const { data: raw, error: orderError } = await supabase.rpc("create_storefront_order", {
    p_customer_email: email,
    p_customer_name: name,
    p_phone: input.phone?.trim() || null,
    p_items: input.lines.map((l) => ({
      product_id: l.productId,
      quantity: l.quantity,
    })),
  });

  const parsed = parseCreateStorefrontOrderResult(raw);
  if (orderError || !parsed) {
    console.error("createOrder", orderError, raw);
    return {
      ok: false,
      error: mapCreateStorefrontOrderError(orderError?.message),
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath("/cart");
  if (user?.id) {
    revalidatePath(`/admin/customers/${user.id}`);
  }

  return { ok: true, orderId: parsed.orderId };
}
