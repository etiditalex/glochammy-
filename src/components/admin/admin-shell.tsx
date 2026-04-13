"use client";

import {
  adminNavSections,
  isNavItemActive,
} from "@/components/admin/admin-nav-config";
import { BRAND } from "@/lib/constants";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { LogOut, Menu, X } from "lucide-react";

type Props = {
  children: ReactNode;
  userEmail: string;
  appVersion: string;
};

export function AdminShell({ children, userEmail, appVersion }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    try {
      const supabase = createBrowserSupabaseClient();
      await supabase.auth.signOut();
    } catch {
      /* */
    }
    setSigningOut(false);
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-subtle">
      {/* Mobile overlay */}
      {sidebarOpen ? (
        <button
          type="button"
          className="print:hidden fixed inset-0 z-40 bg-ink/40 lg:hidden"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      {/* Sidebar */}
      <aside
        className={`print:hidden fixed inset-y-0 left-0 z-50 flex w-[min(17rem,88vw)] flex-col border-r border-line bg-ink text-cream transition-transform duration-200 ease-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="border-b border-white/10 bg-accent px-4 py-4">
          <Link
            href="/admin"
            className="flex items-center gap-3"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/20 bg-white/10">
              <Image
                src={BRAND.logoSrc}
                alt=""
                fill
                className="object-cover"
                sizes="40px"
              />
            </span>
            <span className="font-display text-lg leading-tight text-white">
              {BRAND.shortName}
            </span>
          </Link>
          <p className="mt-2 text-2xs uppercase tracking-nav text-white/80">
            Admin
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4" aria-label="Admin">
          {adminNavSections.map((section) => (
            <div key={section.title} className="mb-6">
              <p className="px-3 pb-2 text-2xs font-semibold uppercase tracking-nav text-white/50">
                {section.title}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isNavItemActive(pathname, item.href);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 rounded-none px-3 py-2.5 text-sm transition-colors ${
                          active
                            ? "border-l-2 border-accent bg-white/10 text-white"
                            : "border-l-2 border-transparent text-cream/90 hover:bg-white/5"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-0">
        <header className="print:hidden sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-line bg-white px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen((o) => !o)}
              className="flex h-11 w-11 shrink-0 items-center justify-center border border-line bg-white text-ink hover:bg-subtle lg:hidden"
              aria-expanded={sidebarOpen}
              aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" strokeWidth={1.5} />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={1.5} />
              )}
            </button>
            <div className="min-w-0">
              <p className="truncate font-display text-lg text-ink sm:text-xl">
                {BRAND.shortName} — Admin
              </p>
              <p className="truncate text-2xs uppercase tracking-nav text-muted">
                Store management
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-2xs uppercase tracking-nav text-muted">
                Signed in
              </p>
              <p className="max-w-[240px] truncate text-sm text-ink" title={userEmail}>
                {userEmail || "Administrator"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void signOut()}
              disabled={signingOut}
              className="inline-flex items-center gap-2 border border-line bg-white px-3 py-2 text-2xs font-medium uppercase tracking-nav text-ink hover:bg-subtle disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
              <span className="hidden sm:inline">
                {signingOut ? "Signing out…" : "Sign out"}
              </span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>

        <footer className="print:hidden border-t border-line bg-white px-4 py-3 text-2xs text-muted sm:px-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {BRAND.shortName}. Admin only — not linked from the
              public shop.
            </p>
            <p className="text-muted/80">
              {BRAND.shortName} admin v{appVersion}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
