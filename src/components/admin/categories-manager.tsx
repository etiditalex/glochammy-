"use client";

import {
  createProductCategoryAction,
  deleteProductCategoryAction,
  updateProductCategoryAction,
} from "@/app/actions/admin";
import type { ProductCategoryOption } from "@/lib/products/categories";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

const field =
  "mt-1 w-full min-w-0 border border-line bg-white px-3 py-2 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
const label = "text-2xs uppercase tracking-nav text-muted";

function CategoryRow({ row }: { row: ProductCategoryOption }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const r = await updateProductCategoryAction(row.slug, fd);
    setPending(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    router.refresh();
  }

  async function onDelete() {
    if (
      !confirm(
        `Delete category "${row.name}"? It must have no products. This cannot be undone.`,
      )
    ) {
      return;
    }
    setError(null);
    setPending(true);
    const r = await deleteProductCategoryAction(row.slug);
    setPending(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    router.refresh();
  }

  return (
    <tr className="border-b border-line/80 align-top">
      <td className="px-4 py-3 font-mono text-xs text-muted">{row.slug}</td>
      <td className="px-4 py-3">
        <form onSubmit={(e) => void onSave(e)} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="min-w-[140px] flex-1">
            <label htmlFor={`name-${row.slug}`} className={label}>
              Display name
            </label>
            <input
              id={`name-${row.slug}`}
              name="name"
              required
              defaultValue={row.name}
              className={field}
            />
          </div>
          <div className="w-28">
            <label htmlFor={`sort-${row.slug}`} className={label}>
              Sort
            </label>
            <input
              id={`sort-${row.slug}`}
              name="sortOrder"
              type="number"
              defaultValue={row.sort_order}
              className={field}
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="border border-line bg-white px-4 py-2 text-2xs font-medium uppercase tracking-nav text-ink hover:bg-subtle disabled:opacity-50"
          >
            Save
          </button>
        </form>
        {error ? (
          <p className="mt-2 text-xs text-red-700" role="alert">
            {error}
          </p>
        ) : null}
      </td>
      <td className="px-4 py-3 text-right">
        <button
          type="button"
          disabled={pending}
          onClick={() => void onDelete()}
          className="text-2xs uppercase tracking-nav text-red-700 underline underline-offset-4 disabled:opacity-50"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export function CategoriesManager({ initial }: { initial: ProductCategoryOption[] }) {
  const router = useRouter();
  const [addError, setAddError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAddError(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const r = await createProductCategoryAction(fd);
    setPending(false);
    if (!r.ok) {
      setAddError(r.error);
      return;
    }
    e.currentTarget.reset();
    const sortEl = e.currentTarget.querySelector<HTMLInputElement>('input[name="sortOrder"]');
    if (sortEl) sortEl.value = "50";
    router.refresh();
  }

  return (
    <div className="space-y-10">
      <section className="border border-line bg-white p-6">
        <h2 className="font-display text-xl text-ink">Add category</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          The <strong className="font-normal text-ink">slug</strong> is used in links (e.g.{" "}
          <code className="text-xs text-ink">/shop?category=gift-sets</code>). Use lowercase letters,
          numbers, and hyphens. The <strong className="font-normal text-ink">display name</strong> is
          what appears on the shop filters. Lower numbers sort first.
        </p>
        <form onSubmit={(e) => void onAdd(e)} className="mt-6 max-w-xl space-y-4">
          <div>
            <label htmlFor="new-slug" className={label}>
              Slug
            </label>
            <input
              id="new-slug"
              name="slug"
              required
              className={field}
              placeholder="e.g. gift-sets"
              autoComplete="off"
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              title="Lowercase letters, numbers, and hyphens only"
            />
          </div>
          <div>
            <label htmlFor="new-name" className={label}>
              Display name
            </label>
            <input
              id="new-name"
              name="name"
              required
              className={field}
              placeholder="e.g. Gift sets"
            />
          </div>
          <div className="max-w-xs">
            <label htmlFor="new-sort" className={label}>
              Sort order
            </label>
            <input
              id="new-sort"
              name="sortOrder"
              type="number"
              defaultValue={50}
              className={field}
            />
          </div>
          {addError ? (
            <p className="text-sm text-red-700" role="alert">
              {addError}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="border border-ink bg-ink px-5 py-2 text-2xs font-medium uppercase tracking-nav text-white disabled:opacity-50"
          >
            {pending ? "Adding…" : "Add category"}
          </button>
        </form>
      </section>

      <section className="border border-line bg-white">
        <div className="border-b border-line bg-subtle px-4 py-3">
          <h2 className="font-display text-lg text-ink">Existing categories</h2>
          <p className="mt-1 text-2xs text-muted">
            Edit names or sort order. Slug cannot be changed here (it is tied to products and URLs).
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-line text-2xs uppercase tracking-nav text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Details</th>
                <th className="px-4 py-3 font-medium text-right"> </th>
              </tr>
            </thead>
            <tbody>
              {initial.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-muted">
                    No categories. Add one above, or run the product_categories migration in Supabase.
                  </td>
                </tr>
              ) : (
                initial.map((row) => <CategoryRow key={row.slug} row={row} />)
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
