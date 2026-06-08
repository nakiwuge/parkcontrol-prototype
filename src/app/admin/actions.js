"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSupabaseAdminClient } from "@/lib/supabase";
import { clearAdminSession, createAdminSession } from "@/lib/admin-auth";
import { normalizeAdminEmail, verifyPassword } from "@/lib/password-hash";
import {
  buildWaitlistLeadPayload,
  getWaitlistLeadFormValues,
} from "@/lib/waitlist-lead";

function toText(value) {
  return String(value ?? "").trim();
}

function buildRedirect(path, key, message) {
  const searchParams = new URLSearchParams({
    [key]: message,
  });

  return `${path}?${searchParams.toString()}`;
}

export async function loginAdminAction(formData) {
  const client = requireSupabaseAdminClient();
  const email = normalizeAdminEmail(formData.get("email"));
  const password = toText(formData.get("password"));

  if (!email || !password) {
    redirect(
      buildRedirect(
        "/admin/login",
        "error",
        "Email and password are required.",
      ),
    );
  }

  const { data: user, error } = await client
    .from("users")
    .select("id, email, password_hash, role, site_id")
    .ilike("email", email)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (
    !user ||
    user.role !== "admin" ||
    !verifyPassword(password, user.password_hash)
  ) {
    redirect(
      buildRedirect(
        "/admin/login",
        "error",
        "Invalid email or password.",
      ),
    );
  }

  await createAdminSession(user);

  redirect("/admin");
}

export async function logoutAdminAction() {
  await clearAdminSession();

  redirect(
    buildRedirect(
      "/admin/login",
      "message",
      "You have been signed out.",
    ),
  );
}

export async function updateWaitlistLeadAction(formData) {
  const client = requireSupabaseAdminClient();
  const leadId = toText(formData.get("lead_id"));
  const formValues = getWaitlistLeadFormValues(formData);

  if (!leadId) {
    redirect(buildRedirect("/admin", "error", "Waitlist lead not found."));
  }

  if (!formValues.clientName) {
    redirect(
      buildRedirect(
        `/admin/leads/${leadId}`,
        "error",
        "Client name is required.",
      ),
    );
  }

  const { error } = await client
    .from("sales_waitlist")
    .update(buildWaitlistLeadPayload(formValues))
    .eq("id", leadId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/leads/${leadId}`);

  redirect(
    buildRedirect(
      `/admin/leads/${leadId}`,
      "message",
      `Lead updated for ${formValues.clientName}.`,
    ),
  );
}
