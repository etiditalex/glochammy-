import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { MainNav } from "@/components/layout/main-nav";
import { UtilityBar } from "@/components/layout/utility-bar";

/**
 * Trust strip scrolls away; only utility + nav stay sticky — shorter sticky
 * surface and less paint cost on mobile while the old banner used to rotate.
 */
export function SiteHeader() {
  return (
    <div className="print:hidden w-full min-w-0">
      <AnnouncementBar />
      <div className="sticky top-0 z-50 isolate w-full min-w-0 bg-white/95 backdrop-blur-[6px] supports-[backdrop-filter]:bg-white/90">
        <UtilityBar />
        <MainNav />
      </div>
    </div>
  );
}
