import { Resend } from "resend";
import { BRAND } from "@/lib/constants";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Strip obvious script injection; body is still admin-controlled HTML. */
export function sanitizeAdminEmailHtml(raw: string): string {
  return raw
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
}

function wrapMarketingHtml(contentHtml: string): string {
  const footer = `<p style="margin-top:2rem;padding-top:1rem;border-top:1px solid #e8e6e3;font-size:12px;line-height:1.5;color:#666;">
You are receiving this because you have a relationship with ${escapeHtml(BRAND.shortName)} (e.g. customer account or mailing list).
<br />Questions: <a href="mailto:${escapeHtml(BRAND.email)}">${escapeHtml(BRAND.email)}</a> · ${escapeHtml(BRAND.addressLine)}
</p>`;
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:24px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a1a;background:#faf9f7;">
<div style="max-width:560px;margin:0 auto;">
${contentHtml}
${footer}
</div></body></html>`;
}

export type SendMarketingBroadcastResult =
  | {
      ok: true;
      sent: number;
      failed: number;
      skippedNoKey: boolean;
    }
  | { ok: false; error: string };

/**
 * Sends the same HTML message to many recipients (one Resend API call per recipient).
 * Dedupes addresses; invalid emails are dropped.
 */
export async function sendMarketingBroadcast(params: {
  subject: string;
  htmlBody: string;
  recipients: string[];
}): Promise<SendMarketingBroadcastResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    return { ok: true, sent: 0, failed: 0, skippedNoKey: true };
  }

  const subject = params.subject.trim();
  if (!subject) {
    return { ok: false, error: "Subject is required." };
  }

  const seen = new Set<string>();
  const list: string[] = [];
  for (const raw of params.recipients) {
    const e = raw.trim().toLowerCase();
    if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) continue;
    if (seen.has(e)) continue;
    seen.add(e);
    list.push(e);
  }

  if (list.length === 0) {
    return { ok: false, error: "No valid recipient email addresses." };
  }

  const inner = sanitizeAdminEmailHtml(params.htmlBody.trim());
  if (!inner) {
    return { ok: false, error: "Message body cannot be empty." };
  }

  const html = wrapMarketingHtml(inner);
  const resend = new Resend(apiKey);

  let sent = 0;
  let failed = 0;

  for (const to of list) {
    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });
    if (error) {
      console.error("Resend marketing email:", to, error);
      failed += 1;
    } else {
      sent += 1;
    }
  }

  return { ok: true, sent, failed, skippedNoKey: false };
}
