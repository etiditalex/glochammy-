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

  const productIds = Array.from(new Set(input.lines.map((l) => l.productId)));
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, price_cents, currency")
    .in("id", productIds);

  if (productsError || !products?.length) {
    return {
      ok: false,
      error:
        "Could not load products. Remove old demo items from your bag and add products from the shop again.",
    };
  }

  const byId = new Map(products.map((p) => [p.id as string, p]));
  let totalCents = 0;
  const currency = (products[0]?.currency as string) || "KES";
  const rows: {
    product_id: string;
    product_name: string;
    unit_price_cents: number;
    quantity: number;
    line_total_cents: number;
  }[] = [];

  for (const line of input.lines) {
    const p = byId.get(line.productId);
    if (!p || line.quantity <= 0) {
      return { ok: false, error: "One or more items in your bag are no longer available." };
    }
    const unit = p.price_cents as number;
    const lineTotal = unit * line.quantity;
    totalCents += lineTotal;
    rows.push({
      product_id: line.productId,
      product_name: p.name as string,
      unit_price_cents: unit,
      quantity: line.quantity,
      line_total_cents: lineTotal,
    });
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      customer_email: email,
      customer_name: name,
      phone: input.phone?.trim() || null,
      total_cents: totalCents,
      currency,
      status: "pending",
    })
    .select("id")
    .single();

  if (orderError || !order?.id) {
    console.error("createOrder", orderError);
    return { ok: false, error: orderError?.message ?? "Could not create order." };
  }

  const orderId = order.id as string;

  const { error: itemsError } = await supabase.from("order_items").insert(
    rows.map((r) => ({
      order_id: orderId,
      product_id: r.product_id,
      product_name: r.product_name,
      unit_price_cents: r.unit_price_cents,
      quantity: r.quantity,
      line_total_cents: r.line_total_cents,
    })),
  );

  if (itemsError) {
    await supabase.from("orders").delete().eq("id", orderId);
    console.error("createOrder items", itemsError);
    return { ok: false, error: itemsError.message };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath("/cart");
  if (user?.id) {
    revalidatePath(`/admin/customers/${user.id}`);
  }

  return { ok: true, orderId };
}
