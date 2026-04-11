import { AdminEmailForm } from "@/components/admin/admin-email-form";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminEmailPage() {
  const supabase = createServerSupabaseClient();
  const { count } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "customer")
    .not("email", "is", null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ink">Email</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Send announcements, offers, or salon updates. Messages include a short footer with
          contact details and why the recipient is hearing from you.
        </p>
      </div>

      <AdminEmailForm customerCount={count ?? 0} />
    </div>
  );
}
