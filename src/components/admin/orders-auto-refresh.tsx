"use client";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type Props = {
  orderId?: string;
  /** Polling fallback when realtime is unavailable (default 90s). */
  intervalMs?: number;
};

/**
 * Prefers Supabase realtime; only polls when the channel isn't healthy.
 */
export function OrdersAutoRefresh({ orderId, intervalMs = 90000 }: Props) {
  const router = useRouter();
  const realtimeHealthy = useRef(false);

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
      .subscribe((status) => {
        realtimeHealthy.current = status === "SUBSCRIBED";
      });

    const id = window.setInterval(() => {
      if (!realtimeHealthy.current) {
        router.refresh();
      }
    }, intervalMs);

    return () => {
      window.clearInterval(id);
      if (refreshTimer != null) window.clearTimeout(refreshTimer);
      void supabase.removeChannel(channel);
    };
  }, [router, intervalMs, orderId]);

  return null;
}
