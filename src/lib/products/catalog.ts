import {
  getFeaturedProducts as staticFeatured,
  getProductBySlug as staticGetBySlug,
  products as staticProducts,
} from "@/lib/data/products";
import { FALLBACK_PRODUCT_IMAGE_URL } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createPublicSupabaseServerClient } from "@/lib/supabase/server-public";
import type { Product } from "@/lib/types/commerce";

export { isSupabaseConfigured } from "@/lib/supabase/env";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  long_description: string;
  price_cents: number;
  currency: string;
  category: string;
  images: string[] | null;
  featured: boolean | null;
};

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    longDescription: row.long_description,
    priceCents: row.price_cents,
    currency: row.currency,
    category: row.category,
    images: row.images?.length ? row.images : [FALLBACK_PRODUCT_IMAGE_URL],
    featured: row.featured ?? false,
  };
}

export async function getShopProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return staticProducts;

  try {
    const supabase = createPublicSupabaseServerClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      console.error("getShopProducts", error.message);
      return staticProducts;
    }
    if (!data?.length) return staticProducts;
    return (data as ProductRow[]).map(rowToProduct);
  } catch (e) {
    console.error("getShopProducts", e);
    return staticProducts;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (!isSupabaseConfigured()) return staticGetBySlug(slug);

  try {
    const supabase = createPublicSupabaseServerClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("getProductBySlug", error.message);
      return staticGetBySlug(slug);
    }
    if (!data) return staticGetBySlug(slug);
    return rowToProduct(data as ProductRow);
  } catch (e) {
    console.error("getProductBySlug", e);
    return staticGetBySlug(slug);
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return staticFeatured();

  try {
    const supabase = createPublicSupabaseServerClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("featured", true)
      .order("sort_order", { ascending: true });

    if (error || !data?.length) return staticFeatured();
    return (data as ProductRow[]).map(rowToProduct);
  } catch {
    return staticFeatured();
  }
}

export async function getRelatedProducts(slug: string, limit: number): Promise<Product[]> {
  const current = await getProductBySlug(slug);
  if (!current) return [];
  const all = await getShopProducts();
  return all
    .filter((p) => p.slug !== slug && p.category === current.category)
    .slice(0, limit);
}

/** Slugs for static generation; prefers DB when configured. */
export async function getProductSlugs(): Promise<string[]> {
  const products = await getShopProducts();
  return products.map((p) => p.slug);
}
