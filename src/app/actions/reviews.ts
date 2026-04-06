"use server";

import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createPublicSupabaseServerClient } from "@/lib/supabase/server-public";
import { revalidatePath } from "next/cache";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(id: string): boolean {
  return UUID_RE.test(id);
}

export type ReviewActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitProductReviewAction(input: {
  productId: string;
  productSlug: string;
  name: string;
  email: string;
  rating: number;
  body: string;
}): Promise<ReviewActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Reviews are not available in this environment." };
  }
  if (!isUuid(input.productId)) {
    return { ok: false, error: "Reviews are only available for live catalog products." };
  }

  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const body = input.body.trim();
  const rating = Math.round(Number(input.rating));

  if (!name || !email) {
    return { ok: false, error: "Enter your name and email." };
  }
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return { ok: false, error: "Pick a rating from 1 to 5 stars." };
  }
  if (body.length < 3) {
    return { ok: false, error: "Please write a short review (at least a few characters)." };
  }

  try {
    const supabase = createPublicSupabaseServerClient();
    const { error } = await supabase.from("product_reviews").insert({
      product_id: input.productId,
      reviewer_name: name,
      reviewer_email: email,
      rating,
      body,
    });

    if (error) {
      if (error.code === "23505") {
        return {
          ok: false,
          error: "You already submitted a review for this product with this email.",
        };
      }
      return { ok: false, error: error.message };
    }

    revalidatePath(`/shop/${input.productSlug}`);
    revalidatePath("/shop");
    return { ok: true };
  } catch (e) {
    console.error(e);
    return { ok: false, error: "Could not save your review. Try again later." };
  }
}

export async function toggleProductLikeAction(input: {
  productId: string;
  productSlug: string;
  likerKey: string;
}): Promise<ReviewActionResult & { liked?: boolean }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Likes are not available in this environment." };
  }
  if (!isUuid(input.productId)) {
    return { ok: false, error: "Likes are only available for live catalog products." };
  }
  const key = input.likerKey.trim();
  if (key.length < 8) {
    return { ok: false, error: "Invalid session." };
  }

  try {
    const supabase = createPublicSupabaseServerClient();
    const { data, error } = await supabase.rpc("toggle_product_like", {
      p_product_id: input.productId,
      p_liker_key: key,
    });

    if (error) return { ok: false, error: error.message };
    const liked = Boolean(data);
    revalidatePath(`/shop/${input.productSlug}`);
    return { ok: true, liked };
  } catch (e) {
    console.error(e);
    return { ok: false, error: "Could not update like. Try again." };
  }
}
