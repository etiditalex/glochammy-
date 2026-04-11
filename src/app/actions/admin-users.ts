"use server";

import { requireAdmin } from "@/app/actions/admin";
import { getSupabaseServiceRoleKey } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server-service";
import { revalidatePath } from "next/cache";

export type AdminUserActionResult = { ok: true; message: string } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createDashboardUserAction(input: {
  email: string;
  password: string;
  fullName: string;
  role: "admin" | "customer";
}): Promise<AdminUserActionResult> {
  const supabase = createServerSupabaseClient();
  const gate = await requireAdmin(supabase);
  if (!gate.ok) return gate;

  if (!getSupabaseServiceRoleKey()) {
    return {
      ok: false,
      error:
        "Creating accounts requires SUPABASE_SERVICE_ROLE_KEY on the server (same as M-Pesa callbacks). Add it in Vercel / .env.local and redeploy.",
    };
  }

  const email = input.email.trim().toLowerCase();
  const password = input.password;
  const fullName = input.fullName.trim();
  const role = input.role;

  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  if (password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }
  if (!fullName) {
    return { ok: false, error: "Enter the person’s full name." };
  }
  if (role !== "admin" && role !== "customer") {
    return { ok: false, error: "Invalid role." };
  }

  let service;
  try {
    service = createServiceSupabaseClient();
  } catch {
    return { ok: false, error: "Server could not open the admin API client." };
  }

  const parts = fullName.split(/\s+/);
  const first = parts[0] ?? "";
  const last = parts.slice(1).join(" ");

  const { data, error } = await service.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      first_name: first,
      last_name: last || first,
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already")) {
      return { ok: false, error: "That email is already registered. Use a different address or reset password in Supabase Auth." };
    }
    return { ok: false, error: error.message };
  }

  if (!data.user) {
    return { ok: false, error: "Account was not created. Try again." };
  }

  const { error: profileError } = await service
    .from("profiles")
    .update({
      role,
      full_name: fullName,
      email,
    })
    .eq("id", data.user.id);

  if (profileError) {
    return {
      ok: false,
      error: `User was created but the profile could not be updated: ${profileError.message}. Fix in Supabase → profiles.`,
    };
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin/customers");

  const message =
    role === "admin"
      ? "They can sign in at /admin/login with this email and password."
      : "Customer account created. They can sign in on the main site at /account.";

  return { ok: true, message };
}
