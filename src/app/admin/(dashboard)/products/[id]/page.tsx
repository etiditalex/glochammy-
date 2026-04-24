import { ProductForm } from "@/components/admin/product-form";
import { getProductCategories } from "@/lib/products/categories";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

export default async function AdminEditProductPage({ params }: Props) {
  const supabase = createServerSupabaseClient();
  const { data: row } = await supabase.from("products").select("*").eq("id", params.id).maybeSingle();

  if (!row) notFound();

  const initial = {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    description: row.description as string,
    long_description: row.long_description as string,
    price_cents: row.price_cents as number,
    currency: row.currency as string,
    category: String(row.category ?? ""),
    images: (row.images as string[]) ?? [],
    stock_quantity: Number(row.stock_quantity ?? 0),
    featured: Boolean(row.featured),
  };

  const categories = await getProductCategories();

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl text-ink">Edit product</h1>
      <ProductForm initial={initial} categories={categories} />
    </div>
  );
}
