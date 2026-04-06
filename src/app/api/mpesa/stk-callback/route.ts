import { createServiceSupabaseClient } from "@/lib/supabase/server-service";
import { getSupabaseServiceRoleKey } from "@/lib/supabase/env";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function metadataAmountAndReceipt(meta: unknown): { amount: number | null; receipt: string | null } {
  if (!meta || typeof meta !== "object" || !("Item" in meta)) {
    return { amount: null, receipt: null };
  }
  const items = (meta as { Item?: unknown }).Item;
  if (!Array.isArray(items)) return { amount: null, receipt: null };
  let amount: number | null = null;
  let receipt: string | null = null;
  for (const raw of items) {
    if (!raw || typeof raw !== "object" || !("Name" in raw)) continue;
    const row = raw as { Name?: string; Value?: string | number };
    if (row.Name === "Amount" && row.Value != null) amount = Number(row.Value);
    if (row.Name === "MpesaReceiptNumber" && row.Value != null)
      receipt = String(row.Value);
  }
  return { amount, receipt };
}

/** Safaricom Daraja STK Callback (server-to-server POST). */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ResultCode: 1, ResultDesc: "Invalid JSON" },
      { status: 400 },
    );
  }

  const stk = (body as { Body?: { stkCallback?: Record<string, unknown> } }).Body?.stkCallback;
  if (!stk) {
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }

  const checkoutId = stk.CheckoutRequestID != null ? String(stk.CheckoutRequestID) : "";
  const resultCode = Number(stk.ResultCode ?? 1);
  const { amount, receipt } = metadataAmountAndReceipt(stk.CallbackMetadata);

  if (!getSupabaseServiceRoleKey()) {
    console.error("mpesa stk-callback: SUPABASE_SERVICE_ROLE_KEY is not set");
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }

  try {
    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase.rpc("complete_order_from_mpesa_callback", {
      p_checkout_request_id: checkoutId,
      p_result_code: resultCode,
      p_amount_kes: amount ?? 0,
      p_mpesa_receipt: receipt ?? "",
    });

    if (error) {
      console.error("mpesa callback rpc", error);
    } else if (
      resultCode === 0 &&
      data &&
      typeof data === "object" &&
      (data as { ok?: boolean }).ok === true &&
      (data as { updated?: number }).updated === 1
    ) {
      revalidatePath("/admin");
      revalidatePath("/admin/orders");
    }
  } catch (e) {
    console.error("mpesa callback", e);
  }

  return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
}
