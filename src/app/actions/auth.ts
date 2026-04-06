"use server";

import { sendWelcomeEmail } from "@/lib/email/welcome";
import { getSiteUrl } from "@/lib/env/site-url";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AuthActionResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

export async function registerCustomerAction(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<AuthActionResult> {
  const email = input.email.trim().toLowerCase();
  const password = input.password;
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();

  if (!email || !password || !firstName || !lastName) {
    return { ok: false, error: "Please fill in all fields." };
  }

  try {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${getSiteUrl()}/auth/callback?next=/account`,
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    await sendWelcomeEmail({ to: email, firstName });

    return {
      ok: true,
      message:
        "Check your inbox: we sent a confirmation link (and a welcome note from us). You may need to enter a one-time code if your email provider shows it instead of the link.",
    };
  } catch (e) {
    console.error(e);
    return {
      ok: false,
      error:
        "We could not reach the account service. Confirm Supabase environment variables are set.",
    };
  }
}

export async function requestPasswordResetAction(email: string): Promise<AuthActionResult> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) {
    return { ok: false, error: "Enter your email address." };
  }

  try {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.auth.resetPasswordForEmail(normalized, {
      redirectTo: `${getSiteUrl()}/auth/callback?next=/account`,
    });
    if (error) {
      return { ok: false, error: error.message };
    }
    return {
      ok: true,
      message: "If an account exists for that email, you will receive reset instructions shortly.",
    };
  } catch (e) {
    console.error(e);
    return {
      ok: false,
      error: "Password reset is not available until Supabase is configured.",
    };
  }
}
