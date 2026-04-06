"use server";

import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type CheckoutLine = {
  productId: string;
  quantity: number;
};

export type CheckoutResult =
  | { ok: true; orderId: string }
  | { ok: false; error: string };

function mapCreateStorefrontOrderError(message: string | undefined): string {
  const raw = message?.trim() ?? "";
  const m = raw.toLowerCase();
  if (!raw) return "Could not create order.";
  if (m.includes("product not found")) {
    return "Could not load one or more products. Remove old demo items from your bag and add products from the shop again.";
  }
  if (m.includes("mixed currency")) {
    return "Your bag mixes currencies. Remove items and add only products priced in one currency.";
  }
  if (m.includes("invalid quantity")) {
    return "One or more line items have an invalid quantity.";
  }
  if (m.includes("no items")) return "Your bag is empty.";
  if (m.includes("email required") || m.includes("name required")) {
    return "Enter your name and email.";
  }
  if (m.includes("create_storefront_order")) {
    return "Run the Supabase migration that adds create_storefront_order (see supabase/migrations).";
  }
  return raw;
}

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

  const { data: orderId, error: orderError } = await supabase.rpc("create_storefront_order", {
    p_customer_email: email,
    p_customer_name: name,
    p_phone: input.phone?.trim() || null,
    p_items: input.lines.map((l) => ({
      product_id: l.productId,
      quantity: l.quantity,
    })),
  });

  if (orderError || !orderId) {
    console.error("createOrder", orderError);
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

  return { ok: true, orderId: String(orderId) };
}
