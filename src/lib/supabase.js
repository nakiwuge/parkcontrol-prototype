import { createClient } from "@supabase/supabase-js";

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

function createServerClient(supabaseKey) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

export function getSupabaseServerClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export function requireSupabaseServerClient() {
  const client = getSupabaseServerClient();

  if (!client) {
    throw new Error(
      "Supabase environment variables are missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return client;
}

export function isSupabaseAdminConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SECRET_KEY,
  );
}

export function getSupabaseAdminClient() {
  if (!isSupabaseAdminConfigured()) {
    return null;
  }

  return createServerClient(process.env.SUPABASE_SECRET_KEY);
}

export function requireSupabaseAdminClient() {
  const client = getSupabaseAdminClient();

  if (!client) {
    throw new Error(
      "Supabase admin environment variables are missing. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY.",
    );
  }

  return client;
}
