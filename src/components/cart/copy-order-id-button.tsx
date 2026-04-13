"use client";

import { useState } from "react";

type Props = {
  orderId: string;
};

export function CopyOrderIdButton({ orderId }: Props) {
  const [label, setLabel] = useState("Copy");

  async function copy() {
    try {
      await navigator.clipboard.writeText(orderId);
      setLabel("Copied");
      window.setTimeout(() => setLabel("Copy"), 2000);
    } catch {
      setLabel("Failed");
      window.setTimeout(() => setLabel("Copy"), 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void copy()}
      className="shrink-0 border border-line bg-white px-3 py-2 text-2xs font-medium uppercase tracking-nav text-ink transition-colors hover:bg-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
    >
      {label}
    </button>
  );
}
