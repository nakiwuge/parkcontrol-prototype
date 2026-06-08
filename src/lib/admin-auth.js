import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { normalizeAdminEmail } from "@/lib/password-hash";

const SESSION_COOKIE_NAME = "parkcontrol_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

function toText(value) {
  return String(value ?? "").trim();
}

function getSessionSecret() {
  const secret = toText(process.env.ADMIN_SESSION_SECRET);

  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET is missing. Add it to enable admin login.",
    );
  }

  return secret;
}

function encodeBase64Url(value) {
  return Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodeBase64Url(value) {
  const normalized = String(value ?? "")
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );

  return Buffer.from(padded, "base64").toString("utf8");
}

function signSessionPayload(payload) {
  return createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function buildSessionCookieValue(payload) {
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = signSessionPayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

function parseSessionCookieValue(value) {
  const [encodedPayload, signature] = String(value ?? "").split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signSessionPayload(encodedPayload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload));

    if (
      !payload?.userId ||
      !payload?.email ||
      !payload?.role ||
      !payload?.expiresAt ||
      payload.expiresAt <= Date.now()
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      email: normalizeAdminEmail(payload.email),
      role: payload.role,
      siteId: payload.siteId || null,
      expiresAt: payload.expiresAt,
    };
  } catch {
    return null;
  }
}

export async function createAdminSession(user) {
  const cookieStore = await cookies();
  const payload = {
    userId: user.id,
    email: normalizeAdminEmail(user.email),
    role: user.role,
    siteId: user.site_id || null,
    expiresAt: Date.now() + (SESSION_MAX_AGE_SECONDS * 1000),
  };

  cookieStore.set(SESSION_COOKIE_NAME, buildSessionCookieValue(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return null;
  }

  const session = parseSessionCookieValue(sessionCookie);

  if (!session) {
    cookieStore.delete(SESSION_COOKIE_NAME);
    return null;
  }

  return session;
}

export async function requireAdmin() {
  const session = await getAdminSession();

  if (!session || session.role !== "admin") {
    redirect("/admin/login");
  }

  return session;
}
