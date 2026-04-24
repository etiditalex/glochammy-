import { formatMoney } from "@/lib/format";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminProductsPage() {
  const supabase = createServerSupabaseClient();
  const { data: rows } = await supabase
    .from("products")
    .select("id, slug, name, price_cents, currency, stock_quantity, featured")
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-3xl text-ink">Products</h1>
        <Link
          href="/admin/products/new"
          className="border border-ink bg-ink px-4 py-2 text-2xs font-medium uppercase tracking-nav text-white hover:bg-ink/90"
        >
          Add product
        </Link>
      </div>

      <div className="overflow-x-auto border border-line bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line bg-subtle text-2xs uppercase tracking-nav text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).map((p) => (
              <tr key={p.id} className="border-b border-line/80">
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3 text-muted">{p.slug}</td>
                <td className="px-4 py-3 tabular-nums">
                  {formatMoney(p.price_cents, p.currency)}
                </td>
                <td className="px-4 py-3 tabular-nums">
                  {Number(p.stock_quantity ?? 0)}
                </td>
                <td className="px-4 py-3">{p.featured ? "Yes" : "—"}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-2xs uppercase tracking-nav text-ink underline underline-offset-4"
                  >
                    Edit
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
