"use client";

import { sendAdminBroadcastEmailAction } from "@/app/actions/admin-email";
import { BRAND } from "@/lib/constants";
import { type FormEvent, useState, useTransition } from "react";

type Props = {
  customerCount: number;
};

export function AdminEmailForm({ customerCount }: Props) {
  const [subject, setSubject] = useState("");
  const [htmlBody, setHtmlBody] = useState("");
  const [audience, setAudience] = useState<"customers" | "custom">("customers");
  const [customEmails, setCustomEmails] = useState("");
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );
  const [pending, startTransition] = useTransition();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFeedback(null);
    startTransition(async () => {
      const res = await sendAdminBroadcastEmailAction({
        subject,
        htmlBody,
        audience,
        customEmails: audience === "custom" ? customEmails : undefined,
      });
      if (res.ok) {
        setFeedback({ type: "ok", text: res.message });
        setSubject("");
        setHtmlBody("");
        setCustomEmails("");
      } else {
        setFeedback({ type: "err", text: res.error });
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="border border-line bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-display text-xl text-ink">Compose</h2>
        <p className="mt-2 text-sm text-muted">
          Uses{" "}
          <a
            href="https://resend.com"
            className="text-ink underline underline-offset-4"
            target="_blank"
            rel="noreferrer"
          >
            Resend
          </a>{" "}
          with the same <code className="text-xs">RESEND_FROM_EMAIL</code> as transactional
          mail. You can use HTML for headings, links, and emphasis.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="email-subject" className="block text-2xs font-medium uppercase tracking-nav text-muted">
              Subject
            </label>
            <input
              id="email-subject"
              name="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              maxLength={200}
              autoComplete="off"
              className="mt-2 w-full border border-line bg-cream px-3 py-2.5 text-sm text-ink placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              placeholder={`e.g. Weekend offer — ${BRAND.shortName}`}
            />
          </div>

          <div>
            <label htmlFor="email-body" className="block text-2xs font-medium uppercase tracking-nav text-muted">
              Message (HTML)
            </label>
            <textarea
              id="email-body"
              name="htmlBody"
              value={htmlBody}
              onChange={(e) => setHtmlBody(e.target.value)}
              required
              rows={14}
              className="mt-2 w-full resize-y border border-line bg-cream px-3 py-2.5 font-mono text-xs leading-relaxed text-ink placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              placeholder={`<p>Hi there,</p>\n<p>We wanted to share …</p>\n<p><a href="https://example.com/shop">Shop the sale</a></p>`}
            />
          </div>
        </div>
      </div>

      <div className="border border-line bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-display text-xl text-ink">Recipients</h2>
        <fieldset className="mt-4 space-y-3">
          <legend className="sr-only">Audience</legend>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="radio"
              name="audience"
              checked={audience === "customers"}
              onChange={() => setAudience("customers")}
              className="mt-1"
            />
            <span>
              <span className="font-medium text-ink">All registered customers</span>
              <span className="mt-0.5 block text-sm text-muted">
                {customerCount === 0
                  ? "No customer profiles with emails found yet."
                  : `${customerCount} profile${customerCount === 1 ? "" : "s"} with the customer role (emails on file).`}
              </span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="radio"
              name="audience"
              checked={audience === "custom"}
              onChange={() => setAudience("custom")}
              className="mt-1"
            />
            <span className="font-medium text-ink">Custom list</span>
          </label>
        </fieldset>

        {audience === "custom" ? (
          <div className="mt-4">
            <label htmlFor="custom-emails" className="block text-2xs font-medium uppercase tracking-nav text-muted">
              Email addresses
            </label>
            <textarea
              id="custom-emails"
              name="customEmails"
              value={customEmails}
              onChange={(e) => setCustomEmails(e.target.value)}
              rows={6}
              className="mt-2 w-full resize-y border border-line bg-cream px-3 py-2.5 font-mono text-xs text-ink placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              placeholder={"one@example.com\nother@example.com"}
            />
            <p className="mt-2 text-xs text-muted">Separate with commas, semicolons, or new lines.</p>
          </div>
        ) : null}
      </div>

      {feedback ? (
        <p
          role="status"
          className={
            feedback.type === "ok"
              ? "rounded-none border border-line bg-subtle px-4 py-3 text-sm text-ink"
              : "rounded-none border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
          }
        >
          {feedback.text}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-[44px] items-center justify-center border border-ink bg-ink px-6 text-2xs font-medium uppercase tracking-nav text-cream transition-colors hover:bg-ink/90 disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send email"}
        </button>
        <p className="text-xs text-muted">
          Each recipient is sent individually. Large lists may take a minute.
        </p>
      </div>
    </form>
  );
}
