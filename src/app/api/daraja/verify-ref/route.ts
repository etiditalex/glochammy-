import { pollOrderPaymentStatusAction } from "@/app/actions/checkout-mpesa";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type VerifyPayload = {
  orderId?: string;
  nonce?: string;
};

export async function POST(req: Request) {
  let body: VerifyPayload;
  try {
    body = (await req.json()) as VerifyPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const orderId = body.orderId?.trim() ?? "";
  const nonce = body.nonce?.trim() ?? "";
  if (!orderId || !nonce) {
    return NextResponse.json(
      { ok: false, error: "orderId and nonce are required." },
      { status: 400 },
    );
  }

  const result = await pollOrderPaymentStatusAction({ orderId, nonce });
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
