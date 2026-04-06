import { CategoriesManager } from "@/components/admin/categories-manager";
import { getProductCategories } from "@/lib/products/categories";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getProductCategories();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ink">Categories</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Categories power the shop filters and product assignments. Run the{" "}
          <code className="text-xs text-ink">20260408120000_product_categories</code> migration in
          Supabase if this list never updates from the database.
        </p>
      </div>
      <CategoriesManager initial={categories} />
    </div>
  );
}
