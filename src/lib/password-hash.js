import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SCRYPT_KEY_LENGTH = 64;
const HASH_PREFIX = "scrypt";

function toText(value) {
  return String(value ?? "").trim();
}

export function normalizeAdminEmail(value) {
  return toText(value).toLowerCase();
}

export function hashPassword(password) {
  const normalizedPassword = toText(password);

  if (!normalizedPassword) {
    throw new Error("Password is required.");
  }

  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(normalizedPassword, salt, SCRYPT_KEY_LENGTH).toString("hex");

  return `${HASH_PREFIX}:${salt}:${hash}`;
}

export function verifyPassword(password, passwordHash) {
  const normalizedPassword = toText(password);
  const [prefix, salt, storedHash] = String(passwordHash ?? "").split(":");

  if (
    !normalizedPassword ||
    prefix !== HASH_PREFIX ||
    !salt ||
    !storedHash
  ) {
    return false;
  }

  const derivedHash = scryptSync(
    normalizedPassword,
    salt,
    SCRYPT_KEY_LENGTH,
  ).toString("hex");

  const storedBuffer = Buffer.from(storedHash, "hex");
  const derivedBuffer = Buffer.from(derivedHash, "hex");

  if (storedBuffer.length !== derivedBuffer.length) {
    return false;
  }

  return timingSafeEqual(storedBuffer, derivedBuffer);
}
