"use client";

import {
  updateOrderStatusAction,
  type OrderStatus,
} from "@/app/actions/admin";
import { useRouter } from "next/navigation";
import { useState } from "react";

const statuses: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

type Props = {
  orderId: string;
  current: OrderStatus;
};

export function OrderStatusPicker({ orderId, current }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(current);
  const [pending, setPending] = useState(false);

  async function onChange(next: OrderStatus) {
    setValue(next);
    setPending(true);
    await updateOrderStatusAction(orderId, next);
    setPending(false);
    router.refresh();
  }

  return (
    <select
      value={value}
      disabled={pending}
      onChange={(e) => void onChange(e.target.value as OrderStatus)}
      className="max-w-full border border-line bg-white px-2 py-1 text-xs text-ink"
      aria-label="Order status"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
