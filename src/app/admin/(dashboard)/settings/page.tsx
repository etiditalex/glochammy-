import { AdminPlaceholder } from "@/components/admin/admin-placeholder";
import { BRAND } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  return (
    <AdminPlaceholder title="Settings">
      <p className="mb-4">
        Store identity and contact details are defined in code for now (
        <strong className="text-ink">{BRAND.email}</strong>,{" "}
        <strong className="text-ink">{BRAND.phone}</strong>). A future version can move
        editable settings into Supabase for non-developer updates.
      </p>
    </AdminPlaceholder>
  );
}
