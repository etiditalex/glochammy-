"use client";

import { useCart } from "@/context/cart-context";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/lib/types/commerce";
import { ButtonPush } from "@/components/ui/button-push";
import { Minus, Plus } from "lucide-react";
import { useMemo, useState } from "react";

type AddToCartPanelProps = {
  product: Product;
};

export function AddToCartPanel({ product }: AddToCartPanelProps) {
  const { addItem, lines, setQuantity } = useCart();
  const [qty, setQty] = useState(1);

  const inCart = useMemo(() => {
    return lines.find((l) => l.productId === product.id)?.quantity ?? 0;
  }, [lines, product.id]);

  function increment() {
    setQty((q) => Math.min(12, q + 1));
  }

  function decrement() {
    setQty((q) => Math.max(1, q - 1));
  }

  return (
    <div className="border-t border-line pt-8">
      <p className="break-words font-display text-[clamp(1.5rem,4vw+0.5rem,1.875rem)] text-ink sm:text-3xl">
        {formatMoney(product.priceCents, product.currency)}
      </p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="inline-flex max-w-full items-center border border-line">
          <button
            type="button"
            onClick={decrement}
            className="flex min-h-[48px] min-w-[48px] items-center justify-center text-ink transition-colors hover:bg-subtle"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" strokeWidth={1.25} />
          </button>
          <span className="min-w-[3rem] px-1 text-center text-base tabular-nums sm:text-sm">
            {qty}
          </span>
          <button
            type="button"
            onClick={increment}
            className="flex min-h-[48px] min-w-[48px] items-center justify-center text-ink transition-colors hover:bg-subtle"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" strokeWidth={1.25} />
          </button>
        </div>
        <ButtonPush
          type="button"
          onClick={() => addItem(product.id, qty)}
          className="sm:min-w-[200px]"
        >
          Add to bag
        </ButtonPush>
      </div>
      {inCart > 0 ? (
        <p className="mt-4 text-sm text-muted" role="status">
          {inCart} in your bag.
          <button
            type="button"
            className="ml-2 underline decoration-1 underline-offset-4"
            onClick={() => setQuantity(product.id, 0)}
          >
            Remove
          </button>
        </p>
      ) : null}
    </div>
  );
}
