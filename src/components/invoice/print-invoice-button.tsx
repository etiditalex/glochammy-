"use client";

import { Printer } from "lucide-react";

export function PrintInvoiceButton({ label = "Print invoice" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 border border-line bg-white px-4 py-2.5 text-2xs font-medium uppercase tracking-nav text-ink transition-colors hover:bg-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink print:hidden"
    >
      <Printer className="h-4 w-4" strokeWidth={1.5} aria-hidden />
      {label}
    </button>
  );
}
