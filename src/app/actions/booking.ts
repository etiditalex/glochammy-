"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { BookingFormValues } from "@/lib/validators/booking";

export type SubmitBookingResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitBookingAction(
  values: BookingFormValues & { serviceName: string },
): Promise<SubmitBookingResult> {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("bookings").insert({
      user_id: user?.id ?? null,
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone.trim(),
      service_id: values.serviceId,
      service_name: values.serviceName,
      preferred_date: values.date,
      preferred_time: values.time,
      notes: values.notes?.trim() || null,
    });

    if (error) {
      console.error("submitBookingAction", error);
      return { ok: false, error: "Could not save your booking. Try again or call us." };
    }
    return { ok: true };
  } catch (e) {
    console.error(e);
    return { ok: false, error: "Booking service is not configured yet." };
  }
}
