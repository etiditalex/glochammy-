"use client";

import { CartCheckout } from "@/components/cart/cart-checkout";
import { useCart } from "@/context/cart-context";
import { products as staticCatalog } from "@/lib/data/products";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/lib/types/commerce";
import { FALLBACK_PRODUCT_IMAGE_URL } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/button-link";
import { ButtonPush } from "@/components/ui/button-push";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";

type CartViewProps = {
  /** When set (e.g. from Supabase-backed shop), resolves line items; otherwise static demo catalog. */
  catalog?: Product[];
  checkoutSession?: { email: string; name: string } | null;
  mpesaConfigured?: boolean;
};

export function CartView({ catalog, checkoutSession, mpesaConfigured }: CartViewProps) {
  const { lines, setQuantity, clear } = useCart();
  const list = catalog ?? staticCatalog;

  const catalogById = useMemo(() => {
    const m = new Map<string, Product>();
    list.forEach((p) => m.set(p.id, p));
    return m;
  }, [list]);

  const rows = useMemo(() => {
    return lines
      .map((line) => {
        const product = catalogById.get(line.productId);
        if (!product) return null;
        return { line, product };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);
  }, [lines, catalogById]);

  const subtotalCents = useMemo(() => {
    return rows.reduce(
      (sum, r) => sum + r.product.priceCents * r.line.quantity,
      0,
    );
  }, [rows]);

  const currency = rows[0]?.product.currency ?? "KES";

  if (rows.length === 0) {
    return (
      <div className="border border-line bg-white p-10 text-center">
        <p className="text-sm text-muted">Your bag is empty.</p>
        <div className="mt-6 flex justify-center">
          <ButtonLink href="/shop">Continue shopping</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-w-0 gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
      <ul className="space-y-6">
        {rows.map(({ line, product }) => (
          <li
            key={product.id}
            className="flex gap-4 border border-line bg-white p-4 sm:gap-6 sm:p-6"
          >
            <Link
              href={`/shop/${product.slug}`}
              className="relative h-24 w-24 shrink-0 bg-subtle sm:h-28 sm:w-28"
            >
              <Image
                src={product.images[0] ?? FALLBACK_PRODUCT_IMAGE_URL}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 96px, 112px"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Link
                    href={`/shop/${product.slug}`}
                    className="break-words text-sm font-medium text-ink hover:opacity-70"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted">
                    {formatMoney(product.priceCents, product.currency)} each
                  </p>
                </div>
                <p className="text-sm font-medium text-ink sm:text-right">
                  {formatMoney(
                    product.priceCents * line.quantity,
                    product.currency,
                  )}
                </p>
              </div>
              <div className="mt-4 inline-flex max-w-full items-center border border-line">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity(product.id, Math.max(0, line.quantity - 1))
                  }
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center text-ink transition-colors hover:bg-subtle"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" strokeWidth={1.25} />
                </button>
                <span className="min-w-[2.75rem] px-1 text-center text-sm tabular-nums">
                  {line.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(product.id, line.quantity + 1)}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center text-ink transition-colors hover:bg-subtle"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" strokeWidth={1.25} />
                </button>
                <button
                  type="button"
                  onClick={() => setQuantity(product.id, 0)}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center border-l border-line text-muted transition-colors hover:bg-subtle hover:text-ink"
                  aria-label={`Remove ${product.name}`}
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.25} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="border border-line bg-cream p-6">
        <h2 className="text-sm font-medium uppercase tracking-nav text-muted">
          Summary
        </h2>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Subtotal</dt>
            <dd className="font-medium text-ink">
              {formatMoney(subtotalCents, currency)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Shipping</dt>
            <dd className="text-ink">Calculated at checkout</dd>
          </div>
        </dl>
        <div className="mt-6 border-t border-line pt-6">
          <div className="flex justify-between gap-4 text-base font-medium text-ink">
            <span>Total</span>
            <span>{formatMoney(subtotalCents, currency)}</span>
          </div>
        </div>
        <CartCheckout
          catalog={list}
          checkoutSession={checkoutSession}
          currency={currency}
          mpesaConfigured={mpesaConfigured ?? false}
        />

        <div className="mt-6 space-y-3">
          <ButtonPush
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => clear()}
          >
            Clear bag
          </ButtonPush>
        </div>
      </aside>
    </div>
  );
}
