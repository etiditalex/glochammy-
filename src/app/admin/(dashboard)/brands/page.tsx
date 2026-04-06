import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const dynamic = "force-dynamic";

export default function AdminBrandsPage() {
  return (
    <AdminPlaceholder title="Brand list">
      <p>
        Add brand management here (name, logo, sort order) when you extend the product schema.
        Product pages currently use free-text categories from the catalog.
      </p>
    </AdminPlaceholder>
  );
}
