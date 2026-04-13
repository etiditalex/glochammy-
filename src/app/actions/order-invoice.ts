"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { normalizeOrderUuid } from "@/lib/order-id";
import type { OrderInvoiceData, OrderInvoiceLine } from "@/lib/invoice";

export type CustomerOrderInvoiceResult =
  | { ok: true; invoice: OrderInvoiceData }
  | { ok: false; error: string };

function parseInvoiceRow(row: Record<string, unknown>): OrderInvoiceData | null {
  const rawItems = row.items;
  const items: OrderInvoiceLine[] = Array.isArray(rawItems)
    ? (rawItems as OrderInvoiceLine[]).map((i) => ({
        product_name: String(i.product_name ?? ""),
        quantity: Number(i.quantity ?? 0),
        unit_price_cents: Number(i.unit_price_cents ?? 0),
        line_total_cents: Number(i.line_total_cents ?? 0),
      }))
    : [];
  const id = row.id != null ? String(row.id) : "";
  if (!id) return null;
  return {
    id,
    status: String(row.status ?? ""),
    total_cents: Number(row.total_cents ?? 0),
    currency: String(row.currency ?? "KES"),
    created_at: String(row.created_at ?? ""),
    customer_name: String(row.customer_name ?? ""),
    customer_email: String(row.customer_email ?? ""),
    phone: row.phone != null && String(row.phone).trim() !== "" ? String(row.phone) : null,
    notes: row.notes != null && String(row.notes).trim() !== "" ? String(row.notes) : null,
    mpesa_receipt_number:
      row.mpesa_receipt_number != null && String(row.mpesa_receipt_number).trim() !== ""
        ? String(row.mpesa_receipt_number)
        : null,
    items,
  };
}

export async function customerOrderInvoiceAction(input: {
  orderId: string;
  email: string;
}): Promise<CustomerOrderInvoiceResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Invoices are not available right now." };
  }

  const orderId = normalizeOrderUuid(input.orderId);
  const email = input.email.trim().toLowerCase();
  if (!orderId) {
    return {
      ok: false,
      error: "Enter the full order ID (UUID) from your confirmation or receipt.",
    };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.rpc("customer_order_invoice", {
    p_order_id: orderId,
    p_email: email,
  });

  if (error) {
    console.error("customer_order_invoice", error);
    if (error.message.includes("function") && error.message.includes("does not exist")) {
      return {
        ok: false,
        error:
          "Customer invoices are not enabled on the database yet. Run the latest Supabase migration (customer_order_invoice).",
      };
    }
    return { ok: false, error: error.message };
  }

  if (data == null) {
    return {
      ok: false,
      error:
        "No order matches that ID and email. Use the same email you used at checkout.",
    };
  }

  const row =
    typeof data === "string"
      ? (JSON.parse(data) as Record<string, unknown>)
      : (data as Record<string, unknown>);
  const invoice = parseInvoiceRow(row);
  if (!invoice) {
    return { ok: false, error: "Could not read invoice data." };
  }
  return { ok: true, invoice };
}

export async function accountOrderInvoiceAction(orderIdRaw: string): Promise<CustomerOrderInvoiceResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Invoices are not available right now." };
  }

  const orderId = normalizeOrderUuid(orderIdRaw);
  if (!orderId) {
    return {
      ok: false,
      error: "Enter the full order ID (UUID).",
    };
  }

  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) {
    return { ok: false, error: "Sign in to load an invoice with your order ID only." };
  }

  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (orderErr || !order) {
    return { ok: false, error: "Order not found." };
  }

  if ((order as { user_id: string | null }).user_id !== user.id) {
    return {
      ok: false,
      error:
        "This order is not linked to your account. Use the email + order ID form below or on Order invoice.",
    };
  }

  const { data: itemRows, error: itemsErr } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId)
    .order("id", { ascending: true });

  if (itemsErr) {
    return { ok: false, error: itemsErr.message };
  }

  const o = order as Record<string, unknown>;
  const rows = (itemRows ?? []) as Record<string, unknown>[];
  const invoice = parseInvoiceRow({
    id: o.id,
    status: o.status,
    total_cents: o.total_cents,
    currency: o.currency,
    created_at: o.created_at,
    customer_name: o.customer_name,
    customer_email: o.customer_email,
    phone: o.phone,
    notes: o.notes,
    mpesa_receipt_number: o.mpesa_receipt_number,
    items: rows.map((r) => ({
      product_name: r.product_name,
      quantity: r.quantity,
      unit_price_cents: r.unit_price_cents,
      line_total_cents: r.line_total_cents,
    })),
  });

  if (!invoice) {
    return { ok: false, error: "Could not build invoice." };
  }
  return { ok: true, invoice };
}
