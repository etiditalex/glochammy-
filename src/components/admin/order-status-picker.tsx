"use client";

import {
  updateOrderStatusAction,
  type OrderStatus,
} from "@/app/actions/admin";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValue(current);
  }, [current]);

  async function onChange(next: OrderStatus) {
    const previous = value;
    setError(null);
    setValue(next);
    setPending(true);
    const result = await updateOrderStatusAction(orderId, next);
    setPending(false);
    if (!result.ok) {
      setValue(previous);
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="inline-flex max-w-full flex-col items-stretch gap-1">
    <select
      value={value}
      disabled={pending}
      onChange={(e) => void onChange(e.target.value as OrderStatus)}
      className="max-w-full border border-line bg-white px-2 py-1 text-xs capitalize text-ink"
      aria-label="Order status"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
      {error ? (
        <span className="text-[10px] text-red-700" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
