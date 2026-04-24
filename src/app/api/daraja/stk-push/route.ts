import { createMpesaCheckoutAction } from "@/app/actions/checkout-mpesa";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type StkPushPayload = {
  lines?: Array<{ productId?: string; quantity?: number }>;
  customerEmail?: string;
  customerName?: string;
  phone?: string;
};

export async function POST(req: Request) {
  let body: StkPushPayload;
  try {
    body = (await req.json()) as StkPushPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const result = await createMpesaCheckoutAction({
    lines: Array.isArray(body.lines)
      ? body.lines
          .filter((line) => typeof line?.productId === "string" && Number.isFinite(line?.quantity))
          .map((line) => ({ productId: String(line.productId), quantity: Number(line.quantity) }))
      : [],
    customerEmail: body.customerEmail ?? "",
    customerName: body.customerName ?? "",
    phone: body.phone ?? "",
  });

  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
