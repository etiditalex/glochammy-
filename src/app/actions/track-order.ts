"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { normalizeOrderUuid } from "@/lib/order-id";

export type TrackedOrderItem = {
  product_name: string;
  quantity: number;
  line_total_cents: number;
};

export type TrackedOrder = {
  id: string;
  status: string;
  total_cents: number;
  currency: string;
  created_at: string;
  customer_name: string;
  items: TrackedOrderItem[];
};

export type TrackOrderLookupResult =
  | { ok: true; order: TrackedOrder }
  | { ok: false; error: string };

export async function trackOrderLookupAction(input: {
  orderId: string;
  email: string;
}): Promise<TrackOrderLookupResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Order lookup is not available right now." };
  }

  const orderId = normalizeOrderUuid(input.orderId);
  const email = input.email.trim().toLowerCase();
  if (!orderId) {
    return {
      ok: false,
      error: "Enter the full order ID (UUID) from your confirmation email or receipt.",
    };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase.rpc("track_order_lookup", {
    p_order_id: orderId,
    p_email: email,
  });

  if (error) {
    console.error("track_order_lookup", error);
    if (error.message.includes("function") && error.message.includes("does not exist")) {
      return {
        ok: false,
        error:
          "Order lookup is not enabled on the database yet. Ask your developer to run the latest Supabase migration (track_order_lookup).",
      };
    }
    return { ok: false, error: error.message };
  }

  if (data == null) {
    return {
      ok: false,
      error:
        "No order matches that ID and email. Check the full order ID and use the same email you used at checkout.",
    };
  }

  const row =
    typeof data === "string"
      ? (JSON.parse(data) as Record<string, unknown>)
      : (data as Record<string, unknown>);
  const rawItems = row.items;
  const items: TrackedOrderItem[] = Array.isArray(rawItems)
    ? (rawItems as TrackedOrderItem[])
    : [];

  return {
    ok: true,
    order: {
      id: String(row.id),
      status: String(row.status),
      total_cents: Number(row.total_cents),
      currency: String(row.currency ?? "KES"),
      created_at: String(row.created_at),
      customer_name: String(row.customer_name ?? ""),
      items,
    },
  };
}
