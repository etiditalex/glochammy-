"use client";

import type { CartLine } from "@/lib/types/commerce";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type CartState = Record<string, number>;

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "glochammy-cart-v1";

const CartContext = createContext<CartContextValue | null>(null);

function readInitialState(): CartState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as CartState;
  } catch {
    return {};
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CartState>({});

  useEffect(() => {
    setState(readInitialState());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const lines: CartLine[] = useMemo(
    () =>
      Object.entries(state)
        .filter(([, qty]) => qty > 0)
        .map(([productId, quantity]) => ({ productId, quantity })),
    [state],
  );

  const itemCount = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines],
  );

  const addItem = useCallback((productId: string, quantity = 1) => {
    setState((prev) => {
      const nextQty = (prev[productId] ?? 0) + quantity;
      return { ...prev, [productId]: nextQty };
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setState((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setState((prev) => {
      const next = { ...prev };
      if (quantity <= 0) {
        delete next[productId];
      } else {
        next[productId] = quantity;
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => setState({}), []);

  const value = useMemo(
    () => ({
      lines,
      itemCount,
      addItem,
      removeItem,
      setQuantity,
      clear,
    }),
    [lines, itemCount, addItem, removeItem, setQuantity, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
