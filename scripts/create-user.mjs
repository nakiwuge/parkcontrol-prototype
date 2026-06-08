import { createClient } from "@supabase/supabase-js";
import { randomBytes, scryptSync } from "node:crypto";

const SCRYPT_KEY_LENGTH = 64;
const ALLOWED_ROLES = new Set(["admin", "site_owner", "staff"]);

function toText(value) {
  return String(value ?? "").trim();
}

function normalizeEmail(value) {
  return toText(value).toLowerCase();
}

function hashPassword(password) {
  const normalizedPassword = toText(password);
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(normalizedPassword, salt, SCRYPT_KEY_LENGTH).toString("hex");

  return `scrypt:${salt}:${hash}`;
}

function requireEnv(name) {
  const value = toText(process.env[name]);

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

function getRole() {
  const role = toText(process.env.USER_ROLE || "admin");

  if (!ALLOWED_ROLES.has(role)) {
    throw new Error("USER_ROLE must be one of: admin, site_owner, staff.");
  }

  return role;
}

async function main() {
  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseSecretKey = requireEnv("SUPABASE_SECRET_KEY");
  const email = normalizeEmail(requireEnv("USER_EMAIL"));
  const password = requireEnv("USER_PASSWORD");
  const role = getRole();
  const siteId = toText(process.env.USER_SITE_ID) || null;
  const client = createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  const passwordHash = hashPassword(password);

  const { data: existingUser, error: lookupError } = await client
    .from("users")
    .select("id")
    .ilike("email", email)
    .limit(1)
    .maybeSingle();

  if (lookupError) {
    throw new Error(lookupError.message);
  }

  if (existingUser) {
    const { error: updateError } = await client
      .from("users")
      .update({
        email,
        password_hash: passwordHash,
        role,
        site_id: siteId,
      })
      .eq("id", existingUser.id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    console.log(`Updated user: ${email} (${role})`);
    return;
  }

  const { error: insertError } = await client.from("users").insert({
    email,
    password_hash: passwordHash,
    role,
    site_id: siteId,
  });

  if (insertError) {
    throw new Error(insertError.message);
  }

  console.log(`Created user: ${email} (${role})`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
