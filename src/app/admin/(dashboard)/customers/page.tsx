import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminCustomersPage() {
  const supabase = createServerSupabaseClient();
  const { data: rows } = await supabase
    .from("profiles")
    .select("id, email, full_name, avatar_url, role, created_at")
    .eq("role", "customer")
    .order("created_at", { ascending: false });

  const customers = rows ?? [];

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl text-ink">Customers</h1>

      <div className="overflow-x-auto border border-line bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line bg-subtle text-2xs uppercase tracking-nav text-muted">
            <tr>
              <th className="px-3 py-2 font-medium"></th>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Email</th>
              <th className="px-3 py-2 font-medium">Joined</th>
              <th className="px-3 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id as string} className="border-b border-line/80">
                <td className="px-3 py-3 w-14">
                  {c.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.avatar_url as string}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover border border-line"
                    />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-subtle text-xs text-muted">
                      —
                    </span>
                  )}
                </td>
                <td className="px-3 py-3">{(c.full_name as string) || "—"}</td>
                <td className="px-3 py-3 break-all">{(c.email as string) || "—"}</td>
                <td className="px-3 py-3 text-xs text-muted whitespace-nowrap">
                  {c.created_at
                    ? new Date(c.created_at as string).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-3 py-3 text-right">
                  <Link
                    href={`/admin/customers/${c.id}`}
                    className="text-2xs uppercase tracking-nav text-ink underline underline-offset-4"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
