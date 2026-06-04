import { unstable_noStore as noStore } from "next/cache";
import {
  DEFAULT_PARKING_SITE,
} from "@/lib/constants";
import {
  formatDateOnly,
  formatDurationLabel,
  formatCurrencyUGX,
  getDateKey,
  getDurationMinutes,
} from "@/lib/format";
import { calculateCharge } from "@/lib/parking";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase";

function sumBy(items, key) {
  return items.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
}

export async function ensureDefaultParkingSite(client) {
  const { data: existingSite, error: existingError } = await client
    .from("parking_sites")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (existingSite) {
    return existingSite;
  }

  const { data: createdSite, error: createError } = await client
    .from("parking_sites")
    .insert(DEFAULT_PARKING_SITE)
    .select()
    .single();

  if (createError) {
    throw new Error(createError.message);
  }

  return createdSite;
}

export async function createActivityLog(client, entry) {
  const { error } = await client.from("activity_logs").insert(entry);

  if (error) {
    throw new Error(error.message);
  }
}

function mapSuspiciousItems(sessions, activityLogs) {
  const editedSessionIds = new Set(
    activityLogs
      .filter((log) => log.action === "record_edited")
      .map((log) => log.vehicle_session_id),
  );

  const suspiciousItems = [];

  sessions.forEach((session) => {
    if (
      session.source === "camera_detected" &&
      session.status === "needs_confirmation"
    ) {
      suspiciousItems.push({
        id: `${session.id}-camera`,
        reason: "Camera detected but not confirmed",
        plate_number: session.plate_number,
        receipt_number: session.receipt_number,
        status: session.status,
        timestamp: session.entry_time,
        detail: "Waiting for staff confirmation.",
        vehicle_session_id: session.id,
      });
    }

    if (session.status === "unpaid_exit") {
      suspiciousItems.push({
        id: `${session.id}-unpaid`,
        reason: "Unpaid exit",
        plate_number: session.plate_number,
        receipt_number: session.receipt_number,
        status: session.status,
        timestamp: session.exit_time ?? session.updated_at,
        detail: `Amount due ${formatCurrencyUGX(session.amount_due)} left unpaid.`,
        vehicle_session_id: session.id,
      });
    }

    if (
      ["inside", "needs_confirmation"].includes(session.status) &&
      getDurationMinutes(session.entry_time, new Date()) > 360
    ) {
      suspiciousItems.push({
        id: `${session.id}-longstay`,
        reason: "Car inside more than 6 hours",
        plate_number: session.plate_number,
        receipt_number: session.receipt_number,
        status: session.status,
        timestamp: session.entry_time,
        detail: `Current stay ${formatDurationLabel(
          getDurationMinutes(session.entry_time, new Date()),
        )}.`,
        vehicle_session_id: session.id,
      });
    }

    if (session.status === "cancelled") {
      suspiciousItems.push({
        id: `${session.id}-cancelled`,
        reason: "Cancelled record",
        plate_number: session.plate_number,
        receipt_number: session.receipt_number,
        status: session.status,
        timestamp: session.updated_at,
        detail: "Record status is marked as cancelled.",
        vehicle_session_id: session.id,
      });
    }

    if (editedSessionIds.has(session.id)) {
      suspiciousItems.push({
        id: `${session.id}-edited`,
        reason: "Edited record",
        plate_number: session.plate_number,
        receipt_number: session.receipt_number,
        status: session.status,
        timestamp: session.updated_at,
        detail: "This session has a recorded edit event.",
        vehicle_session_id: session.id,
      });
    }
  });

  return suspiciousItems.sort(
    (left, right) => new Date(right.timestamp) - new Date(left.timestamp),
  );
}

function buildDashboardMetrics(site, sessions, activityLogs) {
  const todayKey = getDateKey(new Date());
  const activeSessions = sessions.filter((session) =>
    ["inside", "needs_confirmation"].includes(session.status),
  );
  const enteredToday = sessions.filter(
    (session) => getDateKey(session.entry_time) === todayKey,
  );
  const exitedToday = sessions.filter(
    (session) => session.exit_time && getDateKey(session.exit_time) === todayKey,
  );
  const paidToday = exitedToday.filter((session) => session.status === "paid");
  const unpaidToday = exitedToday.filter(
    (session) => session.status === "unpaid_exit",
  );
  const suspiciousItems = mapSuspiciousItems(sessions, activityLogs);

  const expectedRevenue = sumBy(
    exitedToday.filter((session) =>
      ["paid", "unpaid_exit"].includes(session.status),
    ),
    "amount_due",
  );
  const collectedRevenue = sumBy(paidToday, "amount_paid");
  const unpaidAmount = sumBy(unpaidToday, "amount_due");
  const lostReceiptFines = exitedToday.reduce(
    (sum, session) => sum + (Number(session.lost_receipt_fine_amount) || 0),
    0,
  );
  const cashPayments = sumBy(
    paidToday.filter((session) => session.payment_method === "Cash"),
    "amount_paid",
  );
  const mobileMoneyPayments = sumBy(
    paidToday.filter((session) => session.payment_method === "Mobile Money"),
    "amount_paid",
  );

  return {
    activeSessions,
    completedPayments: exitedToday
      .slice()
      .sort((left, right) => new Date(right.exit_time) - new Date(left.exit_time)),
    suspiciousItems,
    staffActivity: activityLogs,
    staff: {
      carsInside: activeSessions.filter((session) => session.status === "inside").length,
      carsEnteredToday: enteredToday.length,
      carsExitedToday: exitedToday.length,
      collectedToday: collectedRevenue,
    },
    owner: {
      carsEnteredToday: enteredToday.length,
      carsInsideNow: activeSessions.length,
      carsExitedToday: exitedToday.length,
      expectedRevenue,
      collectedRevenue,
      unpaidAmount,
      suspiciousItems: suspiciousItems.length,
    },
    report: {
      dateLabel: formatDateOnly(new Date()),
      totalCarsEntered: enteredToday.length,
      totalCarsPaid: paidToday.length,
      totalUnpaidExits: unpaidToday.length,
      carsCurrentlyInside: activeSessions.length,
      expectedRevenue,
      collectedRevenue,
      difference: expectedRevenue - collectedRevenue,
      lostReceiptFines,
      cashPayments,
      mobileMoneyPayments,
    },
    site,
  };
}

function buildEmptySnapshot() {
  return {
    isConfigured: false,
    site: DEFAULT_PARKING_SITE,
    activeSessions: [],
    completedPayments: [],
    suspiciousItems: [],
    staffActivity: [],
    staff: {
      carsInside: 0,
      carsEnteredToday: 0,
      carsExitedToday: 0,
      collectedToday: 0,
    },
    owner: {
      carsEnteredToday: 0,
      carsInsideNow: 0,
      carsExitedToday: 0,
      expectedRevenue: 0,
      collectedRevenue: 0,
      unpaidAmount: 0,
      suspiciousItems: 0,
    },
    report: {
      dateLabel: formatDateOnly(new Date()),
      totalCarsEntered: 0,
      totalCarsPaid: 0,
      totalUnpaidExits: 0,
      carsCurrentlyInside: 0,
      expectedRevenue: 0,
      collectedRevenue: 0,
      difference: 0,
      lostReceiptFines: 0,
      cashPayments: 0,
      mobileMoneyPayments: 0,
    },
  };
}

export async function getDashboardSnapshot() {
  noStore();

  if (!isSupabaseConfigured()) {
    return buildEmptySnapshot();
  }

  const client = getSupabaseServerClient();
  const site = await ensureDefaultParkingSite(client);

  const [{ data: sessions, error: sessionsError }, { data: activityLogs, error: logsError }] =
    await Promise.all([
      client
        .from("vehicle_sessions")
        .select("*")
        .order("entry_time", { ascending: false })
        .limit(200),
      client
        .from("activity_logs")
        .select("*, vehicle_sessions(plate_number, receipt_number, status)")
        .order("created_at", { ascending: false })
        .limit(200),
    ]);

  if (sessionsError) {
    throw new Error(sessionsError.message);
  }

  if (logsError) {
    throw new Error(logsError.message);
  }

  const snapshot = buildDashboardMetrics(site, sessions ?? [], activityLogs ?? []);

  return {
    isConfigured: true,
    ...snapshot,
  };
}

export async function getVehicleSessionDetails(id) {
  noStore();

  if (!isSupabaseConfigured()) {
    return {
      isConfigured: false,
      session: null,
      site: DEFAULT_PARKING_SITE,
      activityLogs: [],
      liveCharge: calculateCharge({
        entryTime: new Date(),
        hourlyRate: DEFAULT_PARKING_SITE.hourly_rate,
        fixedRate: DEFAULT_PARKING_SITE.fixed_rate,
        lostReceiptFine: DEFAULT_PARKING_SITE.lost_receipt_fine,
      }),
    };
  }

  const client = getSupabaseServerClient();
  const site = await ensureDefaultParkingSite(client);

  const [{ data: session, error: sessionError }, { data: activityLogs, error: logsError }] =
    await Promise.all([
      client.from("vehicle_sessions").select("*").eq("id", id).maybeSingle(),
      client
        .from("activity_logs")
        .select("*")
        .eq("vehicle_session_id", id)
        .order("created_at", { ascending: false }),
    ]);

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  if (logsError) {
    throw new Error(logsError.message);
  }

  if (!session) {
    return null;
  }

  const liveCharge = calculateCharge({
    entryTime: session.entry_time,
    hourlyRate: site.hourly_rate,
    fixedRate: site.fixed_rate,
    lostReceiptFine: site.lost_receipt_fine,
    rateType: session.rate_type,
  });

  return {
    isConfigured: true,
    site,
    session,
    activityLogs: activityLogs ?? [],
    liveCharge,
  };
}

export function buildSummaryRows(site, report) {
  return [
    { label: "Date", value: report.dateLabel },
    { label: "Parking Site", value: `${site.name}, ${site.location}` },
    { label: "Hourly rate", value: formatCurrencyUGX(site.hourly_rate) },
    {
      label: "Fixed rate",
      value: formatCurrencyUGX(site.fixed_rate ?? site.hourly_rate),
    },
    { label: "Total cars entered", value: String(report.totalCarsEntered) },
    { label: "Total cars paid", value: String(report.totalCarsPaid) },
    { label: "Total unpaid exits", value: String(report.totalUnpaidExits) },
    { label: "Cars currently inside", value: String(report.carsCurrentlyInside) },
    { label: "Expected revenue", value: formatCurrencyUGX(report.expectedRevenue) },
    { label: "Collected revenue", value: formatCurrencyUGX(report.collectedRevenue) },
    { label: "Cash payments", value: formatCurrencyUGX(report.cashPayments) },
    {
      label: "Mobile money payments",
      value: formatCurrencyUGX(report.mobileMoneyPayments),
    },
  ];
}
