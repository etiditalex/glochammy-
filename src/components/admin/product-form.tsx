"use client";

import {
  createProductAction,
  deleteProductAction,
  updateProductAction,
  uploadProductImageAction,
} from "@/app/actions/admin";
import { formatMoney } from "@/lib/format";
import type { ProductCategoryOption } from "@/lib/products/categories";
import { useRouter } from "next/navigation";
import { type ChangeEvent, type FormEvent, useRef, useState } from "react";

type ProductRow = {
  id?: string;
  slug: string;
  name: string;
  description: string;
  long_description: string;
  price_cents: number;
  currency: string;
  category: string;
  images: string[];
  featured: boolean;
};

const field =
  "mt-1 w-full border border-line bg-white px-3 py-2 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
const label = "text-2xs uppercase tracking-nav text-muted";

function ProductImageUploadBar({
  onUploaded,
}: {
  onUploaded: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [uploadErr, setUploadErr] = useState<string | null>(null);

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadErr(null);
    setBusy(true);
    const fd = new FormData();
    fd.set("file", file);
    const res = await uploadProductImageAction(fd);
    setBusy(false);
    e.target.value = "";
    if (!res.ok) {
      setUploadErr(res.error);
      return;
    }
    onUploaded(res.url);
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <label className="sr-only" htmlFor="product-image-upload">
          Upload product image
        </label>
        <input
          id="product-image-upload"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={(ev) => void onFile(ev)}
          disabled={busy}
          className="text-sm text-ink file:mr-2 file:border file:border-line file:bg-white file:px-3 file:py-1.5 file:text-2xs file:uppercase file:tracking-nav"
        />
        {busy ? (
          <span className="text-2xs uppercase tracking-nav text-muted">Uploading…</span>
        ) : null}
      </div>
      {uploadErr ? (
        <p className="text-sm text-red-700" role="alert">
          {uploadErr}
        </p>
      ) : (
        <p className="text-2xs text-muted">
          JPEG, PNG, GIF, or WebP, max 5MB. After upload, the public URL appears in the box below (run the
          product-images storage migration in Supabase if upload fails).
        </p>
      )}
    </div>
  );
}

export function ProductForm({
  initial,
  categories,
}: {
  initial?: ProductRow;
  categories: ProductCategoryOption[];
}) {
  const router = useRouter();
  const imagesRef = useRef<HTMLTextAreaElement>(null);
  const isEdit = Boolean(initial?.id);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    setPending(true);
    const result = isEdit && initial?.id
      ? await updateProductAction(initial.id, fd)
      : await createProductAction(fd);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  async function onDelete() {
    if (!initial?.id || !confirm("Delete this product? It will disappear from the shop.")) return;
    setPending(true);
    const result = await deleteProductAction(initial.id, initial.slug);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  const imagesValue = initial?.images?.length ? initial.images.join("\n") : "";

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="max-w-2xl space-y-5 border border-line bg-white p-6">
      <div>
        <label htmlFor="slug" className={label}>
          Slug (URL)
        </label>
        <input
          id="slug"
          name="slug"
          required
          defaultValue={initial?.slug}
          className={field}
        />
      </div>
      <div>
        <label htmlFor="name" className={label}>
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={initial?.name}
          className={field}
        />
      </div>
      <div>
        <label htmlFor="description" className={label}>
          Short description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={2}
          defaultValue={initial?.description}
          className={field}
        />
      </div>
      <div>
        <label htmlFor="longDescription" className={label}>
          Long description (optional)
        </label>
        <textarea
          id="longDescription"
          name="longDescription"
          rows={5}
          defaultValue={initial?.long_description}
          placeholder="Extra detail for the product page. If you leave this blank, the short description is used."
          className={field}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className={label}>
            Price ({initial?.currency ?? "KES"})
          </label>
          <input
            id="price"
            name="price"
            type="number"
            required
            min={0}
            step="0.01"
            inputMode="decimal"
            defaultValue={
              initial?.price_cents != null ? String(initial.price_cents / 100) : undefined
            }
            placeholder="e.g. 1500"
            className={field}
          />
          <p className="mt-1.5 text-2xs leading-relaxed text-muted">
            Enter the normal price (e.g. <span className="text-ink">1500</span> for{" "}
            {formatMoney(150000, initial?.currency ?? "KES")}), not cents.
          </p>
        </div>
        <div>
          <label htmlFor="currency" className={label}>
            Currency
          </label>
          <input
            id="currency"
            name="currency"
            defaultValue={initial?.currency ?? "KES"}
            className={field}
          />
        </div>
      </div>
      <div>
        <label htmlFor="category" className={label}>
          Category
        </label>
        <select
          id="category"
          name="category"
          required
          defaultValue={initial?.category ?? categories[0]?.slug}
          className={field}
        >
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        {categories.length === 0 ? (
          <p className="mt-2 text-sm text-red-700">
            No categories yet. Add some under{" "}
            <a href="/admin/categories" className="underline underline-offset-4">
              Category list
            </a>
            .
          </p>
        ) : (
          <p className="mt-2 text-2xs text-muted">
            Manage labels and order under{" "}
            <a href="/admin/categories" className="text-ink underline underline-offset-4">
              Category list
            </a>
            .
          </p>
        )}
      </div>
      <div>
        <div className="mb-3">
          <p className={label}>Images</p>
          <ProductImageUploadBar
            onUploaded={(url) => {
              const ta = imagesRef.current;
              if (!ta) return;
              ta.value = ta.value.trim() ? `${ta.value.trim()}\n${url}` : url;
            }}
          />
        </div>
        <label htmlFor="images" className={label}>
          Image URLs (one per line)
        </label>
        <textarea
          ref={imagesRef}
          id="images"
          name="images"
          rows={4}
          defaultValue={imagesValue}
          placeholder="https://… or upload above — URLs are saved here."
          className={field}
        />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            value="true"
            defaultChecked={initial?.featured}
            className="h-4 w-4 border-line"
          />
          <label htmlFor="featured" className="text-sm text-ink">
            Featured
          </label>
        </div>
        <p className="mt-2 text-2xs leading-relaxed text-muted">
          Featured products appear on the <strong className="font-normal text-ink">home page</strong>{" "}
          and can be highlighted on the <strong className="font-normal text-ink">shop</strong> filters.
          All products are listed on <strong className="font-normal text-ink">/shop</strong> regardless.
        </p>
      </div>

      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="border border-ink bg-ink px-5 py-2 text-2xs font-medium uppercase tracking-nav text-white disabled:opacity-50"
        >
          {pending ? "Saving…" : isEdit ? "Save changes" : "Create product"}
        </button>
        {isEdit ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => void onDelete()}
            className="border border-line bg-white px-5 py-2 text-2xs font-medium uppercase tracking-nav text-red-700 disabled:opacity-50"
          >
            Delete
          </button>
        ) : null}
      </div>
    </form>
  );
}
