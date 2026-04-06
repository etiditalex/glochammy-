import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type ProductCategoryOption = {
  slug: string;
  name: string;
  sort_order: number;
};

/** Matches seed + static fallback products when DB is off or table missing. */
const DEFAULT_CATEGORIES: ProductCategoryOption[] = [
  { slug: "skincare", name: "Skincare", sort_order: 10 },
  { slug: "hair", name: "Hair", sort_order: 20 },
  { slug: "body", name: "Body", sort_order: 30 },
  { slug: "fragrance", name: "Fragrance", sort_order: 40 },
];

export async function getProductCategories(): Promise<ProductCategoryOption[]> {
  if (!isSupabaseConfigured()) return DEFAULT_CATEGORIES;

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("product_categories")
      .select("slug, name, sort_order")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error || !data?.length) return DEFAULT_CATEGORIES;
    return data as ProductCategoryOption[];
  } catch {
    return DEFAULT_CATEGORIES;
  }
}
