import { AdminShell } from "@/components/admin/admin-shell";
import { ADMIN_USER_EMAIL_HEADER } from "@/lib/supabase/admin-request-email";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import pkg from "../../../../package.json";
import { headers } from "next/headers";
import type { ReactNode } from "react";

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const headerList = headers();
  let userEmail = headerList.get(ADMIN_USER_EMAIL_HEADER) ?? "";
  if (!userEmail) {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userEmail = user?.email ?? "";
  }

  return (
    <AdminShell userEmail={userEmail} appVersion={pkg.version}>
      {children}
    </AdminShell>
  );
}
