import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const supabase = createServerSupabaseClient();

  const [products, bookings, inquiries, customers, orders] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("bookings").select("id", { count: "exact", head: true }),
    supabase.from("inquiries").select("id", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "customer"),
    supabase.from("orders").select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Products", count: products.count ?? 0, href: "/admin/products" },
    { label: "Orders", count: orders.count ?? 0, href: "/admin/orders" },
    { label: "Bookings", count: bookings.count ?? 0, href: "/admin/bookings" },
    { label: "Inquiries", count: inquiries.count ?? 0, href: "/admin/inquiries" },
    { label: "Customers", count: customers.count ?? 0, href: "/admin/customers" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ink">Dashboard</h1>
        <p className="mt-2 text-sm text-muted">
          At-a-glance counts from your Supabase data. Open a section from the sidebar for
          detail.
        </p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {stats.map((s) => (
          <li key={s.label}>
            <Link
              href={s.href}
              className="block border border-line bg-white p-6 shadow-sm transition-colors hover:border-accent/40 hover:bg-cream"
            >
              <p className="text-2xs font-medium uppercase tracking-nav text-muted">
                {s.label}
              </p>
              <p className="mt-3 font-display text-4xl tabular-nums leading-none text-ink">
                {s.count}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
