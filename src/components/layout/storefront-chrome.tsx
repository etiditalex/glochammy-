"use client";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const HydrationChallengePopup = dynamic(
  () =>
    import("@/components/layout/hydration-challenge-popup").then(
      (m) => m.HydrationChallengePopup,
    ),
  { ssr: false },
);

/**
 * Public shop uses header + footer. Admin/CMS routes are full-viewport with no storefront chrome.
 */
export function StorefrontChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="flex min-h-screen min-w-0 flex-col">
        <SiteHeader />
        <main className="min-w-0 flex-1 overflow-x-clip">{children}</main>
        <SiteFooter />
      </div>
      <HydrationChallengePopup />
    </>
  );
}
