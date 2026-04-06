"use client";

import { updateInquiryStatusAction } from "@/app/actions/admin";
import { useRouter } from "next/navigation";
import { useState } from "react";

const statuses = ["new", "read", "replied", "archived"] as const;

type InquiryStatus = (typeof statuses)[number];

type Props = {
  inquiryId: string;
  current: InquiryStatus;
};

export function InquiryStatusPicker({ inquiryId, current }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(current);
  const [pending, setPending] = useState(false);

  async function onChange(next: InquiryStatus) {
    setValue(next);
    setPending(true);
    await updateInquiryStatusAction(inquiryId, next);
    setPending(false);
    router.refresh();
  }

  return (
    <select
      value={value}
      disabled={pending}
      onChange={(e) => void onChange(e.target.value as InquiryStatus)}
      className="max-w-full border border-line bg-white px-2 py-1 text-xs text-ink"
      aria-label="Inquiry status"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
