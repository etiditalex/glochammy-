import { ProductForm } from "@/components/admin/product-form";
import { getProductCategories } from "@/lib/products/categories";

export const dynamic = "force-dynamic";

export default async function AdminNewProductPage() {
  const categories = await getProductCategories();

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl text-ink">New product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
