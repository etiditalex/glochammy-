"use client";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  orderId?: string;
  intervalMs?: number;
};

export function OrdersAutoRefresh({ orderId, intervalMs = 30000 }: Props) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    let refreshTimer: number | null = null;
    const scheduleRefresh = () => {
      if (refreshTimer != null) return;
      refreshTimer = window.setTimeout(() => {
        refreshTimer = null;
        router.refresh();
      }, 250);
    };

    const channel = supabase
      .channel(`admin-orders-realtime-${orderId ?? "all"}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          ...(orderId ? { filter: `id=eq.${orderId}` } : {}),
        },
        () => {
          scheduleRefresh();
        },
      )
      .subscribe();

    // Fallback poll in case realtime is blocked/disconnected.
    const id = window.setInterval(() => {
      router.refresh();
    }, intervalMs);
    return () => {
      window.clearInterval(id);
      if (refreshTimer != null) window.clearTimeout(refreshTimer);
      void supabase.removeChannel(channel);
    };
  }, [router, intervalMs, orderId]);

  return null;
}
