import { formatMoney } from "@/lib/format";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

export default async function AdminCustomerDetailPage({ params }: Props) {
  const supabase = createServerSupabaseClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, avatar_url, role, created_at")
    .eq("id", params.id)
    .maybeSingle();

  if (!profile || profile.role !== "customer") notFound();

  const email = (profile.email as string) ?? "";

  const { data: ordersByUser } = await supabase
    .from("orders")
    .select("id, total_cents, currency, status, created_at")
    .eq("user_id", params.id)
    .order("created_at", { ascending: false });

  const { data: ordersByEmail } = email
    ? await supabase
        .from("orders")
        .select("id, total_cents, currency, status, created_at")
        .eq("customer_email", email)
        .order("created_at", { ascending: false })
    : { data: [] };

  const orderMap = new Map<
    string,
    NonNullable<typeof ordersByUser>[number]
  >();
  for (const o of ordersByUser ?? []) orderMap.set(o.id as string, o);
  for (const o of ordersByEmail ?? []) orderMap.set(o.id as string, o);
  const orders = Array.from(orderMap.values()).sort(
    (a, b) =>
      new Date(b.created_at as string).getTime() -
      new Date(a.created_at as string).getTime(),
  );

  const { data: inquiries } = email
    ? await supabase
        .from("inquiries")
        .select("*")
        .eq("email", email.trim().toLowerCase())
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div className="space-y-10">
      <nav className="text-2xs uppercase tracking-nav text-muted">
        <Link href="/admin/customers" className="hover:text-ink">
          Client list
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{(profile.full_name as string) || email || "Customer"}</span>
      </nav>

      <div className="flex flex-wrap items-start gap-6 border border-line bg-white p-6">
        <div>
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url as string}
              alt=""
              className="h-20 w-20 rounded-full border border-line object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-line bg-subtle text-sm text-muted">
              —
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-3xl text-ink">
            {(profile.full_name as string) || "Customer"}
          </h1>
          <p className="mt-1 break-all text-sm text-muted">{email || "—"}</p>
          <p className="mt-2 text-2xs text-muted">
            Joined{" "}
            {profile.created_at
              ? new Date(profile.created_at as string).toLocaleString()
              : "—"}
          </p>
        </div>
      </div>

      <section>
        <h2 className="font-display text-xl text-ink">Orders</h2>
        <p className="mt-1 text-sm text-muted">
          Includes orders placed while signed in and any guest orders using this email at
          checkout.
        </p>
        <div className="mt-4 overflow-x-auto border border-line bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-line bg-subtle text-2xs uppercase tracking-nav text-muted">
              <tr>
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Total</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-8 text-center text-muted">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id as string} className="border-b border-line/80">
                    <td className="px-3 py-3 text-xs whitespace-nowrap text-muted">
                      {o.created_at
                        ? new Date(o.created_at as string).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-3 py-3 tabular-nums">
                      {formatMoney(o.total_cents as number, o.currency as string)}
                    </td>
                    <td className="px-3 py-3 capitalize text-muted">{o.status as string}</td>
                    <td className="px-3 py-3 text-right">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="text-2xs uppercase tracking-nav text-ink underline underline-offset-4"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl text-ink">Inquiries</h2>
        <p className="mt-1 text-sm text-muted">
          Contact form messages that match this email.
        </p>
        <div className="mt-4 space-y-4">
          {(inquiries ?? []).length === 0 ? (
            <p className="border border-line bg-white p-6 text-sm text-muted">No inquiries.</p>
          ) : (
            (inquiries ?? []).map((q) => (
              <article
                key={q.id as string}
                className="border border-line bg-white p-4 text-sm"
              >
                <p className="text-2xs uppercase tracking-nav text-muted">
                  {q.subject as string} ·{" "}
                  {q.created_at
                    ? new Date(q.created_at as string).toLocaleString()
                    : ""}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-ink">{q.message as string}</p>
                <p className="mt-2 text-2xs capitalize text-muted">Status: {q.status as string}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
