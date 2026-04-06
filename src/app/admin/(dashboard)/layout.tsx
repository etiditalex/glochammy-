import { AdminShell } from "@/components/admin/admin-shell";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import pkg from "../../../../package.json";
import type { ReactNode } from "react";

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <AdminShell userEmail={user?.email ?? ""} appVersion={pkg.version}>
      {children}
    </AdminShell>
  );
}
