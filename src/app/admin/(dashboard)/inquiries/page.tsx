import { InquiryStatusPicker } from "@/components/admin/inquiry-status-picker";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminInquiriesPage() {
  const supabase = createServerSupabaseClient();
  const { data: rows } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl text-ink">Inquiries</h1>

      <div className="space-y-4">
        {(rows ?? []).map((q) => (
          <article
            key={q.id as string}
            className="border border-line bg-white p-5 shadow-none"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-2xs uppercase tracking-nav text-muted">
                  {q.subject as string}
                </p>
                <p className="mt-1 font-medium text-ink">
                  {q.name as string}{" "}
                  <span className="font-normal text-muted">· {q.email as string}</span>
                </p>
                <p className="mt-1 text-xs text-muted">
                  {q.created_at
                    ? new Date(q.created_at as string).toLocaleString()
                    : ""}
                </p>
              </div>
              <InquiryStatusPicker
                inquiryId={q.id as string}
                current={q.status as "new" | "read" | "replied" | "archived"}
              />
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink">
              {q.message as string}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
