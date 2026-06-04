import { APP_TIME_ZONE } from "@/lib/constants";

export function formatCurrencyUGX(amount = 0) {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

export function formatDateTime(value) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-UG", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: APP_TIME_ZONE,
  }).format(new Date(value));
}

export function formatDateOnly(value) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-UG", {
    dateStyle: "full",
    timeZone: APP_TIME_ZONE,
  }).format(new Date(value));
}

export function formatTimeOnly(value) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-UG", {
    timeStyle: "short",
    timeZone: APP_TIME_ZONE,
  }).format(new Date(value));
}

export function getDateKey(value) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: APP_TIME_ZONE,
  }).formatToParts(new Date(value));

  const year = parts.find((part) => part.type === "year")?.value ?? "0000";
  const month = parts.find((part) => part.type === "month")?.value ?? "00";
  const day = parts.find((part) => part.type === "day")?.value ?? "00";

  return `${year}-${month}-${day}`;
}

export function getDurationMinutes(start, end = new Date()) {
  if (!start) {
    return 0;
  }

  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  const diff = Math.max(0, endTime - startTime);

  return Math.max(1, Math.ceil(diff / 60000));
}

export function getRoundedHours(durationMinutes) {
  return Math.max(1, Math.ceil((Number(durationMinutes) || 0) / 60));
}

export function formatDurationLabel(durationMinutes) {
  const safeMinutes = Number(durationMinutes) || 0;

  if (safeMinutes < 60) {
    return `${safeMinutes} min`;
  }

  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;

  if (!minutes) {
    return `${hours} hr${hours === 1 ? "" : "s"}`;
  }

  return `${hours} hr${hours === 1 ? "" : "s"} ${minutes} min`;
}
