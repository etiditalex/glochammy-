import { BRAND } from "@/lib/constants";
import { runMpesaDiagnostics } from "@/lib/mpesa/diagnostics";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const report = await runMpesaDiagnostics();
  const failing = report.checks.filter((c) => c.status === "fail").length;
  const warning = report.checks.filter((c) => c.status === "warn").length;

  const statusTone =
    failing > 0
      ? "border-red-200 bg-red-50 text-red-800"
      : warning > 0
        ? "border-amber-200 bg-amber-50 text-amber-900"
        : "border-emerald-200 bg-emerald-50 text-emerald-800";
  const summaryText =
    failing > 0
      ? `${failing} failing check${failing === 1 ? "" : "s"}. Fix these first.`
      : warning > 0
        ? `No hard failures. ${warning} warning${warning === 1 ? "" : "s"} to review.`
        : "All diagnostics checks passed.";

  return (
    <div className="space-y-8">
      <div className="border border-line bg-white p-6 sm:p-8">
        <h1 className="font-display text-2xl text-ink sm:text-3xl">Settings</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          Store identity and contact details are defined in code for now (
          <strong className="text-ink">{BRAND.email}</strong>,{" "}
          <strong className="text-ink">{BRAND.phone}</strong>).
        </p>
      </div>

      <section className="border border-line bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl text-ink sm:text-2xl">M-Pesa diagnostics</h2>
            <p className="mt-2 text-sm text-muted">
              Live server checks for Daraja and checkout wiring.
            </p>
          </div>
          <p className="text-2xs uppercase tracking-nav text-muted">
            Checked {new Date(report.checkedAtIso).toLocaleString()}
          </p>
        </div>

        <div className={`mt-4 rounded border px-3 py-2 text-sm ${statusTone}`}>{summaryText}</div>

        <div className="mt-4 rounded border border-line bg-subtle p-3 text-xs text-muted">
          <p className="font-semibold uppercase tracking-nav text-muted">Resolved endpoint URLs</p>
          <p className="mt-2">
            <span className="font-medium text-ink">OAuth:</span> {report.resolvedUrls.oauth}
          </p>
          <p className="mt-1">
            <span className="font-medium text-ink">STK push:</span> {report.resolvedUrls.stkPush}
          </p>
          <p className="mt-1">
            <span className="font-medium text-ink">STK query:</span> {report.resolvedUrls.stkQuery}
          </p>
          <p className="mt-1">
            <span className="font-medium text-ink">Callback:</span>{" "}
            {report.resolvedUrls.callback ?? "Not resolved"}
          </p>
        </div>

        <div className="mt-4 space-y-2">
          {report.checks.map((check) => {
            const badgeTone =
              check.status === "pass"
                ? "bg-emerald-100 text-emerald-800"
                : check.status === "warn"
                  ? "bg-amber-100 text-amber-900"
                  : "bg-red-100 text-red-800";
            const badgeLabel =
              check.status === "pass" ? "PASS" : check.status === "warn" ? "WARN" : "FAIL";
            return (
              <div key={check.id} className="rounded border border-line bg-subtle p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex rounded px-2 py-1 text-2xs font-semibold tracking-nav ${badgeTone}`}
                  >
                    {badgeLabel}
                  </span>
                  <p className="text-sm font-medium text-ink">{check.label}</p>
                </div>
                <p className="mt-1 text-sm text-muted">{check.message}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
