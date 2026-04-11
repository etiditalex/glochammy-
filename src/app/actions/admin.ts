"use server";

import { randomUUID } from "node:crypto";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type AdminActionResult =
  | { ok: true }
  | { ok: false; error: string };

const CATEGORY_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function parseImages(raw: string): string[] {
  return raw
    .split(/\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
}

async function resolveCategorySlug(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  raw: string,
): Promise<{ ok: true; slug: string } | { ok: false; error: string }> {
  const slug = raw.trim();
  if (!slug) return { ok: false, error: "Pick a category." };
  const { data, error } = await supabase
    .from("product_categories")
    .select("slug")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) {
    return {
      ok: false,
      error: "Unknown category. Add it under Category list in the admin first.",
    };
  }
  return { ok: true, slug: data.slug as string };
}

export async function requireAdmin(supabase: ReturnType<typeof createServerSupabaseClient>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      ok: false as const,
      error: "Sign in at /admin/login. Your session may have expired.",
    };
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") {
    return {
      ok: false as const,
      error:
        "This account is not an admin. In Supabase → Table Editor → profiles, set role to admin for your user.",
    };
  }
  return { ok: true as const, user };
}

function parsePriceToCents(formData: FormData): { ok: true; price_cents: number } | { ok: false; error: string } {
  const raw = String(formData.get("price") ?? "")
    .trim()
    .replace(/,/g, "");
  if (raw === "") return { ok: false, error: "Enter a price." };
  const major = Number.parseFloat(raw);
  if (!Number.isFinite(major) || major < 0) {
    return { ok: false, error: "Enter a valid price (0 or greater)." };
  }
  return { ok: true, price_cents: Math.round(major * 100) };
}

function mapProductError(err: { message: string; code?: string }): string {
  if (err.code === "23505") return "That URL slug is already used. Change the slug.";
  return err.message;
}

export async function createProductAction(formData: FormData): Promise<AdminActionResult> {
  const supabase = createServerSupabaseClient();
  const gate = await requireAdmin(supabase);
  if (!gate.ok) return gate;

  const slug = String(formData.get("slug") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const longDescription = String(formData.get("longDescription") ?? "").trim();
  const price = parsePriceToCents(formData);
  if (!price.ok) return price;
  const currency = String(formData.get("currency") ?? "KES").trim() || "KES";
  const categoryRes = await resolveCategorySlug(
    supabase,
    String(formData.get("category") ?? ""),
  );
  if (!categoryRes.ok) return categoryRes;
  const featured = formData.get("featured") === "on" || formData.get("featured") === "true";
  const images = parseImages(String(formData.get("images") ?? ""));

  if (!slug || !name || !description) {
    return { ok: false, error: "Fill name, slug, short description, category, and price." };
  }

  const longFinal = longDescription || description;

  const { error } = await supabase.from("products").insert({
    slug,
    name,
    description,
    long_description: longFinal,
    price_cents: price.price_cents,
    currency,
    category: categoryRes.slug,
    images,
    featured,
  });
  if (error) return { ok: false, error: mapProductError(error) };

  revalidatePath("/shop");
  revalidatePath("/");
  revalidatePath(`/shop/${slug}`);
  return { ok: true };
}

export async function uploadProductImageAction(
  formData: FormData,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const supabase = createServerSupabaseClient();
  const gate = await requireAdmin(supabase);
  if (!gate.ok) return gate;

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Choose an image file." };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { ok: false, error: "Image must be 5MB or smaller." };
  }
  const mime = file.type.toLowerCase();
  if (!/^image\/(jpeg|jpg|png|gif|webp)$/i.test(mime)) {
    return { ok: false, error: "Use JPEG, PNG, GIF, or WebP." };
  }

  const ext =
    mime === "image/jpeg" || mime === "image/jpg"
      ? "jpg"
      : mime === "image/png"
        ? "png"
        : mime === "image/gif"
          ? "gif"
          : "webp";
  const path = `products/${randomUUID()}.${ext}`;

  const buf = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from("product-images").upload(path, buf, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (error) return { ok: false, error: error.message };

  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}

export async function updateProductAction(
  productId: string,
  formData: FormData,
): Promise<AdminActionResult> {
  const supabase = createServerSupabaseClient();
  const gate = await requireAdmin(supabase);
  if (!gate.ok) return gate;

  const slug = String(formData.get("slug") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const longDescription = String(formData.get("longDescription") ?? "").trim();
  const price = parsePriceToCents(formData);
  if (!price.ok) return price;
  const currency = String(formData.get("currency") ?? "KES").trim() || "KES";
  const categoryRes = await resolveCategorySlug(
    supabase,
    String(formData.get("category") ?? ""),
  );
  if (!categoryRes.ok) return categoryRes;
  const featured = formData.get("featured") === "on" || formData.get("featured") === "true";
  const images = parseImages(String(formData.get("images") ?? ""));

  if (!slug || !name || !description) {
    return { ok: false, error: "Fill name, slug, short description, category, and price." };
  }

  const longFinal = longDescription || description;

  const { error } = await supabase
    .from("products")
    .update({
      slug,
      name,
      description,
      long_description: longFinal,
      price_cents: price.price_cents,
      currency,
      category: categoryRes.slug,
      images,
      featured,
    })
    .eq("id", productId);

  if (error) return { ok: false, error: mapProductError(error) };

  revalidatePath("/shop");
  revalidatePath("/");
  revalidatePath(`/shop/${slug}`);
  return { ok: true };
}

export async function deleteProductAction(productId: string, slug: string): Promise<AdminActionResult> {
  const supabase = createServerSupabaseClient();
  const gate = await requireAdmin(supabase);
  if (!gate.ok) return gate;

  const { error } = await supabase.from("products").delete().eq("id", productId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/shop");
  revalidatePath("/");
  revalidatePath(`/shop/${slug}`);
  return { ok: true };
}

export async function createProductCategoryAction(
  formData: FormData,
): Promise<AdminActionResult> {
  const supabase = createServerSupabaseClient();
  const gate = await requireAdmin(supabase);
  if (!gate.ok) return gate;

  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const sortRaw = String(formData.get("sortOrder") ?? "").trim();
  const sortOrder = sortRaw === "" ? 0 : Number.parseInt(sortRaw, 10);

  if (!slug || !CATEGORY_SLUG_RE.test(slug)) {
    return {
      ok: false,
      error: "Slug: use lowercase letters, numbers, and hyphens only (e.g. gift-sets).",
    };
  }
  if (!name) return { ok: false, error: "Enter a display name." };
  if (!Number.isFinite(sortOrder)) {
    return { ok: false, error: "Sort order must be a whole number." };
  }

  const { error } = await supabase.from("product_categories").insert({
    slug,
    name,
    sort_order: sortOrder,
  });
  if (error) {
    if (error.code === "23505") return { ok: false, error: "That slug already exists." };
    return { ok: false, error: error.message };
  }
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  revalidatePath("/admin/products/new");
  return { ok: true };
}

export async function updateProductCategoryAction(
  slug: string,
  formData: FormData,
): Promise<AdminActionResult> {
  const supabase = createServerSupabaseClient();
  const gate = await requireAdmin(supabase);
  if (!gate.ok) return gate;

  const name = String(formData.get("name") ?? "").trim();
  const sortRaw = String(formData.get("sortOrder") ?? "").trim();
  const sortOrder = sortRaw === "" ? 0 : Number.parseInt(sortRaw, 10);

  if (!name) return { ok: false, error: "Enter a display name." };
  if (!Number.isFinite(sortOrder)) {
    return { ok: false, error: "Sort order must be a whole number." };
  }

  const { error } = await supabase
    .from("product_categories")
    .update({ name, sort_order: sortOrder })
    .eq("slug", slug);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  return { ok: true };
}

export async function deleteProductCategoryAction(slug: string): Promise<AdminActionResult> {
  const supabase = createServerSupabaseClient();
  const gate = await requireAdmin(supabase);
  if (!gate.ok) return gate;

  const { count, error: countErr } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category", slug);

  if (countErr) return { ok: false, error: countErr.message };
  if ((count ?? 0) > 0) {
    return {
      ok: false,
      error: "This category still has products. Reassign or delete them first.",
    };
  }

  const { error } = await supabase.from("product_categories").delete().eq("slug", slug);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  return { ok: true };
}

export async function updateBookingStatusAction(
  bookingId: string,
  status: "pending" | "confirmed" | "cancelled" | "completed",
): Promise<AdminActionResult> {
  const supabase = createServerSupabaseClient();
  const gate = await requireAdmin(supabase);
  if (!gate.ok) return gate;

  const { error } = await supabase.from("bookings").update({ status }).eq("id", bookingId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/bookings");
  return { ok: true };
}

export async function updateInquiryStatusAction(
  inquiryId: string,
  status: "new" | "read" | "replied" | "archived",
): Promise<AdminActionResult> {
  const supabase = createServerSupabaseClient();
  const gate = await requireAdmin(supabase);
  if (!gate.ok) return gate;

  const { error } = await supabase.from("inquiries").update({ status }).eq("id", inquiryId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/inquiries");
  return { ok: true };
}

const ORDER_STATUSES = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus,
): Promise<AdminActionResult> {
  const supabase = createServerSupabaseClient();
  const gate = await requireAdmin(supabase);
  if (!gate.ok) return gate;

  if (!ORDER_STATUSES.includes(status)) {
    return { ok: false, error: "Invalid status." };
  }

  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin");
  return { ok: true };
}
