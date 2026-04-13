import { WalkInSalesManager, type WalkInSaleRow } from "@/components/admin/walk-in-sales-manager";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("walk_in_sales")
    .select("*")
    .order("sold_at", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ink">Inventory & sales ledger</h1>
        <p className="mt-2 text-sm text-muted">
          Record physical shop sales (cash or M-Pesa), including items not listed on the website.
        </p>
      </div>
      <WalkInSalesManager initial={(data ?? []) as WalkInSaleRow[]} />
    </div>
  );
}
