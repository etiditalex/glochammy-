import { MainNav } from "@/components/layout/main-nav";
import { UtilityBar } from "@/components/layout/utility-bar";

/** Utility row and main navigation stay sticky together. */
export function SiteHeader() {
  return (
    <div className="print:hidden sticky top-0 z-50 isolate w-full min-w-0 bg-white/95 backdrop-blur-[6px] supports-[backdrop-filter]:bg-white/90">
      <UtilityBar />
      <MainNav />
    </div>
  );
}
