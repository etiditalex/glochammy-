"use client";

import { updateBookingStatusAction } from "@/app/actions/admin";
import { useRouter } from "next/navigation";
import { useState } from "react";

const statuses = ["pending", "confirmed", "cancelled", "completed"] as const;

type BookingStatus = (typeof statuses)[number];

type Props = {
  bookingId: string;
  current: BookingStatus;
};

export function BookingStatusPicker({ bookingId, current }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(current);
  const [pending, setPending] = useState(false);

  async function onChange(next: BookingStatus) {
    setValue(next);
    setPending(true);
    await updateBookingStatusAction(bookingId, next);
    setPending(false);
    router.refresh();
  }

  return (
    <select
      value={value}
      disabled={pending}
      onChange={(e) => void onChange(e.target.value as BookingStatus)}
      className="max-w-full border border-line bg-white px-2 py-1 text-xs text-ink"
      aria-label="Booking status"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
