import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const dynamic = "force-dynamic";

export default function AdminInventoryPage() {
  return (
    <AdminPlaceholder title="Inventory list">
      <p>
        Stock levels will appear here when inventory tracking is connected (quantities per
        product, SKU, and location). Your live catalog is managed under{" "}
        <strong className="text-ink">Product list</strong>.
      </p>
    </AdminPlaceholder>
  );
}
