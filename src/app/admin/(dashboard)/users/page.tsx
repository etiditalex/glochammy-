import { AdminCreateUserForm } from "@/components/admin/admin-create-user-form";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminUsersPage() {
  const supabase = createServerSupabaseClient();
  const { data: admins } = await supabase
    .from("profiles")
    .select("id, email, full_name, created_at")
    .eq("role", "admin")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl text-ink">Team & accounts</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Create Supabase accounts for staff who should use this dashboard (role{" "}
          <span className="font-mono text-xs">admin</span>) or for customers who need a storefront
          login (role <span className="font-mono text-xs">customer</span>).
        </p>
      </div>

      <AdminCreateUserForm />

      <div>
        <h2 className="text-sm font-medium uppercase tracking-nav text-muted">Current dashboard admins</h2>
        <div className="mt-4 overflow-x-auto border border-line bg-white">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="border-b border-line bg-subtle text-2xs uppercase tracking-nav text-muted">
              <tr>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Email</th>
                <th className="px-4 py-2 font-medium">Since</th>
              </tr>
            </thead>
            <tbody>
              {(admins ?? []).map((row) => (
                <tr key={row.id as string} className="border-b border-line/80">
                  <td className="px-4 py-3">{(row.full_name as string) || "—"}</td>
                  <td className="px-4 py-3 break-all">{(row.email as string) || "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted">
                    {row.created_at
                      ? new Date(row.created_at as string).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(admins ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-muted">No admin profiles returned (check Supabase RLS).</p>
        ) : null}
      </div>
    </div>
  );
}
