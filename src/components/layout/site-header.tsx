import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { MainNav } from "@/components/layout/main-nav";
import { UtilityBar } from "@/components/layout/utility-bar";

export function SiteHeader() {
  return (
    <div className="sticky top-0 z-50 isolate w-full min-w-0">
      <AnnouncementBar />
      <UtilityBar />
      <MainNav />
    </div>
  );
}
