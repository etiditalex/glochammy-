import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createPublicSupabaseServerClient } from "@/lib/supabase/server-public";

export type ProductReviewPublic = {
  id: string;
  reviewer_name: string;
  rating: number;
  body: string;
  created_at: string;
};

export type ProductReviewStats = {
  averageRating: number | null;
  reviewCount: number;
  likeCount: number;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuidProductId(id: string): boolean {
  return UUID_RE.test(id);
}

export async function getProductReviewStats(productId: string): Promise<ProductReviewStats> {
  const empty: ProductReviewStats = {
    averageRating: null,
    reviewCount: 0,
    likeCount: 0,
  };
  if (!isSupabaseConfigured() || !isUuidProductId(productId)) return empty;

  try {
    const supabase = createPublicSupabaseServerClient();

    const [{ data: ratings, error: rErr }, { count: likeCount, error: lErr }] = await Promise.all([
      supabase.from("product_reviews").select("rating").eq("product_id", productId),
      supabase.from("product_likes").select("*", { count: "exact", head: true }).eq("product_id", productId),
    ]);

    if (rErr && !rErr.message.includes("schema cache")) {
      console.error("getProductReviewStats reviews", rErr.message);
    }
    if (lErr && !lErr.message.includes("schema cache")) {
      console.error("getProductReviewStats likes", lErr.message);
    }

    const list = ratings ?? [];
    const reviewCount = list.length;
    const averageRating =
      reviewCount > 0
        ? list.reduce((s, row: { rating: number }) => s + row.rating, 0) / reviewCount
        : null;

    return {
      averageRating,
      reviewCount,
      likeCount: likeCount ?? 0,
    };
  } catch (e) {
    console.error(e);
    return empty;
  }
}

export async function getProductReviewsList(productId: string): Promise<ProductReviewPublic[]> {
  if (!isSupabaseConfigured() || !isUuidProductId(productId)) return [];

  try {
    const supabase = createPublicSupabaseServerClient();
    const { data, error } = await supabase
      .from("product_reviews")
      .select("id, reviewer_name, rating, body, created_at")
      .eq("product_id", productId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      if (!error.message.includes("schema cache")) {
        console.error("getProductReviewsList", error.message);
      }
      return [];
    }
    return (data ?? []) as ProductReviewPublic[];
  } catch {
    return [];
  }
}
