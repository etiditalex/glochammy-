"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export type SubmitInquiryResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitInquiryAction(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<SubmitInquiryResult> {
  try {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from("inquiries").insert({
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      subject: input.subject.trim(),
      message: input.message.trim(),
    });
    if (error) {
      console.error("submitInquiryAction", error);
      return { ok: false, error: "Could not send your message. Try again later." };
    }
    return { ok: true };
  } catch (e) {
    console.error(e);
    return { ok: false, error: "Contact form is not connected yet." };
  }
}
