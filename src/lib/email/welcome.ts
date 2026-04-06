import { Resend } from "resend";
import { BRAND } from "@/lib/constants";

export async function sendWelcomeEmail(params: { to: string; firstName: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return { ok: false as const, skipped: true as const };

  const resend = new Resend(apiKey);
  const name = params.firstName.trim() || "there";

  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: `Welcome to ${BRAND.shortName}`,
    html: `<p>Hi ${escapeHtml(name)},</p><p>Thanks for creating an account with ${escapeHtml(BRAND.shortName)}. We are glad you are here.</p><p>If you did not sign up, you can ignore this message.</p>`,
  });

  if (error) {
    console.error("Resend welcome email:", error);
    return { ok: false as const, skipped: false as const };
  }
  return { ok: true as const };
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
