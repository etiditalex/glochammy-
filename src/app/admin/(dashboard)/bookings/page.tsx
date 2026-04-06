import { BookingStatusPicker } from "@/components/admin/booking-status-picker";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminBookingsPage() {
  const supabase = createServerSupabaseClient();
  const { data: rows } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl text-ink">Bookings</h1>

      <div className="overflow-x-auto border border-line bg-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-line bg-subtle text-2xs uppercase tracking-nav text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">Date</th>
              <th className="px-3 py-2 font-medium">Guest</th>
              <th className="px-3 py-2 font-medium">Service</th>
              <th className="px-3 py-2 font-medium">When</th>
              <th className="px-3 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).map((b) => (
              <tr key={b.id} className="border-b border-line/80 align-top">
                <td className="px-3 py-3 text-xs text-muted whitespace-nowrap">
                  {b.created_at
                    ? new Date(b.created_at as string).toLocaleString()
                    : "—"}
                </td>
                <td className="px-3 py-3">
                  <div className="font-medium">{b.name as string}</div>
                  <div className="text-xs text-muted">{b.email as string}</div>
                  <div className="text-xs text-muted">{b.phone as string}</div>
                </td>
                <td className="px-3 py-3">
                  <div>{(b.service_name as string) || (b.service_id as string)}</div>
                  {b.notes ? (
                    <p className="mt-1 max-w-xs text-xs text-muted">{b.notes as string}</p>
                  ) : null}
                </td>
                <td className="px-3 py-3 text-xs whitespace-nowrap">
                  {String(b.preferred_date)} {String(b.preferred_time)}
                </td>
                <td className="px-3 py-3">
                  <BookingStatusPicker
                    bookingId={b.id as string}
                    current={b.status as "pending" | "confirmed" | "cancelled" | "completed"}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
