import { SalesReportPanel, type SalesReportRow } from "@/components/admin/sales-report-panel";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminSalesReportPage() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("walk_in_sales")
    .select(
      "id, sold_at, item_name, quantity, unit_price_cents, total_cents, currency, payment_method, mpesa_code",
    )
    .order("sold_at", { ascending: false })
    .order("created_at", { ascending: false });

  return <SalesReportPanel rows={(data ?? []) as SalesReportRow[]} />;
}
