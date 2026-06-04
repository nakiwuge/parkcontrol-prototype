import { APP_SHORT_NAME } from "@/lib/constants";
import { formatCurrencyUGX, formatTimeOnly, getDurationMinutes, getRoundedHours } from "@/lib/format";

export async function getNextReceiptNumber(client) {
  const { data, error } = await client
    .from("vehicle_sessions")
    .select("receipt_number")
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(error.message);
  }

  const latestReceipt = data?.[0]?.receipt_number ?? "PC-00000";
  const latestSequence = Number(latestReceipt.replace("PC-", "")) || 0;
  const nextSequence = latestSequence + 1;

  return `PC-${String(nextSequence).padStart(5, "0")}`;
}

export function getEffectiveRateAmount({
  rateType = "Hourly",
  hourlyRate = 0,
  fixedRate,
}) {
  if (rateType === "Fixed") {
    return Number(fixedRate ?? hourlyRate) || 0;
  }

  return Number(hourlyRate) || 0;
}

export function calculateCharge({
  entryTime,
  exitTime = new Date(),
  hourlyRate = 0,
  fixedRate,
  lostReceiptFine = 0,
  lostReceiptApplied = false,
  rateType = "Hourly",
}) {
  const durationMinutes = getDurationMinutes(entryTime, exitTime);
  const roundedHours = getRoundedHours(durationMinutes);
  const baseRate = getEffectiveRateAmount({
    rateType,
    hourlyRate,
    fixedRate,
  });
  const parkingAmount = rateType === "Fixed" ? baseRate : roundedHours * baseRate;
  const lostReceiptFineAmount = lostReceiptApplied ? Number(lostReceiptFine) || 0 : 0;
  const totalAmountDue = parkingAmount + lostReceiptFineAmount;

  return {
    durationMinutes,
    roundedHours,
    baseRate,
    parkingAmount,
    lostReceiptFineAmount,
    totalAmountDue,
  };
}

export function buildEntrySmsPreview(session) {
  return `${APP_SHORT_NAME}: Vehicle ${session.plate_number} entered at ${formatTimeOnly(
    session.entry_time,
  )}. Receipt: ${session.receipt_number}. Keep this message for checkout.`;
}

export function buildCheckoutSmsPreview(session) {
  return `${APP_SHORT_NAME}: Vehicle ${session.plate_number} checked out. Amount paid: ${formatCurrencyUGX(
    session.amount_paid,
  )}. Thank you.`;
}
