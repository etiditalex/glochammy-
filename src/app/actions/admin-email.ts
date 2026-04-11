"use server";

import { requireAdmin } from "@/app/actions/admin";
import { sendMarketingBroadcast } from "@/lib/email/marketing";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AdminEmailActionResult =
  | { ok: true; sent: number; failed: number; message: string }
  | { ok: false; error: string };

const MAX_SUBJECT = 200;
const MAX_BODY = 200_000;

export async function sendAdminBroadcastEmailAction(input: {
  subject: string;
  htmlBody: string;
  audience: "customers" | "custom";
  customEmails?: string;
}): Promise<AdminEmailActionResult> {
  const supabase = createServerSupabaseClient();
  const gate = await requireAdmin(supabase);
  if (!gate.ok) return gate;

  const subject = input.subject.trim();
  if (!subject) {
    return { ok: false, error: "Enter a subject line." };
  }
  if (subject.length > MAX_SUBJECT) {
    return { ok: false, error: `Subject must be ${MAX_SUBJECT} characters or fewer.` };
  }

  const htmlBody = input.htmlBody ?? "";
  if (htmlBody.trim().length === 0) {
    return { ok: false, error: "Enter a message body (HTML is supported)." };
  }
  if (htmlBody.length > MAX_BODY) {
    return { ok: false, error: `Body must be ${MAX_BODY} characters or fewer.` };
  }

  let recipients: string[] = [];

  if (input.audience === "customers") {
    const { data: rows, error } = await supabase
      .from("profiles")
      .select("email")
      .eq("role", "customer");
    if (error) {
      return { ok: false, error: error.message };
    }
    recipients = (rows ?? [])
      .map((r) => String((r as { email?: string | null }).email ?? ""))
      .filter(Boolean);
  } else {
    recipients = String(input.customEmails ?? "")
      .split(/[\n,;]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const result = await sendMarketingBroadcast({
    subject,
    htmlBody,
    recipients,
  });

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  if (result.skippedNoKey) {
    return {
      ok: false,
      error:
        "Email sending is not configured. Add RESEND_API_KEY and RESEND_FROM_EMAIL to your server environment (see .env.example).",
    };
  }

  let message = `Successfully sent ${result.sent} email${result.sent === 1 ? "" : "s"}.`;
  if (result.failed > 0) {
    message += ` ${result.failed} could not be delivered (check server logs).`;
  }
  return { ok: true, sent: result.sent, failed: result.failed, message };
}
