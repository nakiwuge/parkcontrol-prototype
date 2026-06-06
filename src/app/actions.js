"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  CAMERA_PLATES,
  DEFAULT_PARKING_SITE,
  DEMO_STAFF_NAME,
  SYSTEM_CAMERA_NAME,
} from "@/lib/constants";
import { calculateCharge, buildCheckoutSmsPreview, buildEntrySmsPreview, getNextReceiptNumber } from "@/lib/parking";
import { createActivityLog, ensureDefaultParkingSite } from "@/lib/data";
import { requireSupabaseServerClient } from "@/lib/supabase";
import { sendDemoSms } from "@/lib/sms";

function toText(value) {
  return String(value ?? "").trim();
}

function normalizePlateNumber(value) {
  return toText(value).toUpperCase().replace(/\s+/g, "");
}

function getPlateNumberErrorMessage(plateNumber) {
  if (!plateNumber) {
    return "Plate number is required.";
  }

  if (plateNumber.length > 7) {
    return "Plate number must not exceed 7 characters.";
  }

  if (!/^[A-Z0-9]+$/.test(plateNumber)) {
    return "Plate number must use only letters and numbers with no spaces.";
  }

  return null;
}

function revalidateAll(sessionId) {
  revalidatePath("/");
  revalidatePath("/staff");
  revalidatePath("/staff/entry");
  revalidatePath("/owner");
  revalidatePath("/reports/daily");
  revalidatePath("/settings");
  revalidatePath("/activity");
  revalidatePath("/waitlist");

  if (sessionId) {
    revalidatePath(`/vehicles/${sessionId}`);
    revalidatePath(`/vehicles/${sessionId}/checkout`);
  }
}

function buildRedirect(path, key, message) {
  const searchParams = new URLSearchParams({
    [key]: message,
  });

  return `${path}?${searchParams.toString()}`;
}

function toPositiveInteger(value, fallback) {
  const parsed = Number.parseInt(String(value ?? "").trim(), 10);

  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

function toNullableText(value) {
  const normalized = toText(value);
  return normalized || null;
}

export async function createVehicleEntryAction(formData) {
  const client = requireSupabaseServerClient();
  const site = await ensureDefaultParkingSite(client);

  const plateNumber = normalizePlateNumber(formData.get("plate_number"));
  const customerPhone = toText(formData.get("customer_phone"));
  const carType = toText(formData.get("car_type")) || "Saloon";
  const keyStatus = toText(formData.get("key_status")) || "Key taken";
  const rateType = toText(formData.get("rate_type")) || "Hourly";
  const notes = toText(formData.get("notes"));

  const plateNumberError = getPlateNumberErrorMessage(plateNumber);

  if (plateNumberError) {
    redirect(buildRedirect("/staff/entry", "error", plateNumberError));
  }

  const receiptNumber = await getNextReceiptNumber(client);
  const entryTime = new Date().toISOString();

  const { data: session, error } = await client
    .from("vehicle_sessions")
    .insert({
      parking_site_id: site.id,
      plate_number: plateNumber,
      receipt_number: receiptNumber,
      customer_phone: customerPhone || null,
      car_type: carType,
      key_status: keyStatus,
      rate_type: rateType,
      entry_time: entryTime,
      status: "inside",
      source: "manual",
      notes: notes || null,
      created_by: DEMO_STAFF_NAME,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await createActivityLog(client, {
    vehicle_session_id: session.id,
    action: "vehicle_entry_created",
    description: `Vehicle entry created for ${plateNumber}.`,
    created_by: DEMO_STAFF_NAME,
  });

  revalidateAll(session.id);

  redirect(
    buildRedirect(
      "/staff",
      "message",
      `Vehicle entry created for ${plateNumber}.`,
    ),
  );
}

export async function simulateCameraCaptureAction() {
  const client = requireSupabaseServerClient();
  const site = await ensureDefaultParkingSite(client);

  const receiptNumber = await getNextReceiptNumber(client);
  const plateNumber = normalizePlateNumber(
    CAMERA_PLATES[Math.floor(Math.random() * CAMERA_PLATES.length)],
  );
  const entryTime = new Date().toISOString();

  const { data: session, error } = await client
    .from("vehicle_sessions")
    .insert({
      parking_site_id: site.id,
      plate_number: plateNumber,
      receipt_number: receiptNumber,
      car_type: "Saloon",
      key_status: "Key taken",
      rate_type: "Hourly",
      entry_time: entryTime,
      status: "needs_confirmation",
      source: "camera_detected",
      created_by: SYSTEM_CAMERA_NAME,
      notes: "Created from demo camera simulation.",
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await createActivityLog(client, {
    vehicle_session_id: session.id,
    action: "camera_capture_simulated",
    description: `Camera detected vehicle ${plateNumber} awaiting staff confirmation.`,
    created_by: SYSTEM_CAMERA_NAME,
  });

  revalidateAll(session.id);

  redirect(
    buildRedirect(
      "/staff",
      "message",
      `Camera capture created for ${plateNumber}.`,
    ),
  );
}

export async function confirmCameraVehicleAction(formData) {
  const client = requireSupabaseServerClient();
  const sessionId = toText(formData.get("vehicle_session_id"));

  const { data: session, error: sessionError } = await client
    .from("vehicle_sessions")
    .select("*")
    .eq("id", sessionId)
    .maybeSingle();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  if (!session) {
    redirect(buildRedirect("/staff", "error", "Vehicle session not found."));
  }

  const { error } = await client
    .from("vehicle_sessions")
    .update({
      status: "inside",
    })
    .eq("id", sessionId);

  if (error) {
    throw new Error(error.message);
  }

  await createActivityLog(client, {
    vehicle_session_id: sessionId,
    action: "camera_detection_confirmed",
    description: `Camera detected vehicle confirmed by staff for ${session.plate_number}.`,
    created_by: DEMO_STAFF_NAME,
  });

  revalidateAll(sessionId);

  redirect(
    buildRedirect(
      "/staff",
      "message",
      `Camera detected vehicle confirmed for ${session.plate_number}.`,
    ),
  );
}

export async function updateCameraVehicleDetailsAction(formData) {
  const client = requireSupabaseServerClient();
  const sessionId = toText(formData.get("vehicle_session_id"));
  const intent = toText(formData.get("intent")) || "save";

  const { data: session, error: sessionError } = await client
    .from("vehicle_sessions")
    .select("*")
    .eq("id", sessionId)
    .maybeSingle();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  if (!session) {
    redirect(buildRedirect("/staff", "error", "Vehicle session not found."));
  }

  const plateNumber = normalizePlateNumber(formData.get("plate_number"));
  const customerPhone = toText(formData.get("customer_phone"));
  const carType = toText(formData.get("car_type")) || session.car_type || "Saloon";
  const keyStatus = toText(formData.get("key_status")) || session.key_status || "Key taken";
  const rateType = toText(formData.get("rate_type")) || session.rate_type || "Hourly";
  const notes = toText(formData.get("notes"));

  const plateNumberError = getPlateNumberErrorMessage(plateNumber);

  if (plateNumberError) {
    redirect(
      buildRedirect(
        `/vehicles/${sessionId}`,
        "error",
        plateNumberError,
      ),
    );
  }

  const updatePayload = {
    plate_number: plateNumber,
    customer_phone: customerPhone || null,
    car_type: carType,
    key_status: keyStatus,
    rate_type: rateType,
    notes: notes || null,
  };

  if (intent === "confirm") {
    updatePayload.status = "inside";
  }

  const { error } = await client
    .from("vehicle_sessions")
    .update(updatePayload)
    .eq("id", sessionId);

  if (error) {
    throw new Error(error.message);
  }

  await createActivityLog(client, {
    vehicle_session_id: sessionId,
    action:
      intent === "confirm"
        ? "camera_detection_details_saved_and_confirmed"
        : "camera_detection_details_updated",
    description:
      intent === "confirm"
        ? `Camera detected vehicle reviewed and confirmed for ${plateNumber}.`
        : `Camera detected vehicle details updated for ${plateNumber}.`,
    created_by: DEMO_STAFF_NAME,
  });

  revalidateAll(sessionId);

  redirect(
    intent === "confirm"
      ? buildRedirect(
          "/staff",
          "message",
          `Camera vehicle reviewed and confirmed for ${plateNumber}.`,
        )
      : buildRedirect(
          `/vehicles/${sessionId}`,
          "message",
          `Camera vehicle details saved for ${plateNumber}.`,
        ),
  );
}

export async function updateParkingSettingsAction(formData) {
  const client = requireSupabaseServerClient();
  const site = await ensureDefaultParkingSite(client);

  const name = toText(formData.get("name")) || site.name || DEFAULT_PARKING_SITE.name;
  const location =
    toText(formData.get("location")) ||
    site.location ||
    DEFAULT_PARKING_SITE.location;
  const hourlyRate = toPositiveInteger(
    formData.get("hourly_rate"),
    site.hourly_rate ?? DEFAULT_PARKING_SITE.hourly_rate,
  );
  const fixedRate = toPositiveInteger(
    formData.get("fixed_rate"),
    site.fixed_rate ?? site.hourly_rate ?? DEFAULT_PARKING_SITE.fixed_rate,
  );
  const lostReceiptFine = toPositiveInteger(
    formData.get("lost_receipt_fine"),
    site.lost_receipt_fine ?? DEFAULT_PARKING_SITE.lost_receipt_fine,
  );

  const { error } = await client
    .from("parking_sites")
    .update({
      name,
      location,
      hourly_rate: hourlyRate,
      fixed_rate: fixedRate,
      lost_receipt_fine: lostReceiptFine,
    })
    .eq("id", site.id);

  if (error) {
    throw new Error(error.message);
  }

  await createActivityLog(client, {
    action: "parking_settings_updated",
    description: `Parking settings updated for ${name}. Hourly ${hourlyRate}, fixed ${fixedRate}, lost receipt fine ${lostReceiptFine}.`,
    created_by: "Demo Owner",
  });

  revalidateAll();

  redirect(
    buildRedirect(
      "/settings",
      "message",
      `Settings updated for ${name}.`,
    ),
  );
}

export async function checkoutVehicleAction(formData) {
  const client = requireSupabaseServerClient();
  const sessionId = toText(formData.get("vehicle_session_id"));
  const intent = toText(formData.get("intent"));
  const selectedPaymentMethod = toText(formData.get("payment_method"));
  const lostReceiptApplied = formData.get("lost_receipt") === "on";

  const { data: session, error: sessionError } = await client
    .from("vehicle_sessions")
    .select("*, parking_sites(*)")
    .eq("id", sessionId)
    .maybeSingle();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  if (!session) {
    redirect(buildRedirect("/staff", "error", "Vehicle session not found."));
  }

  const site = session.parking_sites ?? DEFAULT_PARKING_SITE;
  const exitTime = new Date().toISOString();
  const charge = calculateCharge({
    entryTime: session.entry_time,
    exitTime,
    hourlyRate: site.hourly_rate,
    fixedRate: site.fixed_rate,
    lostReceiptFine: site.lost_receipt_fine,
    lostReceiptApplied,
    rateType: session.rate_type,
  });

  if (intent === "paid" && !["Cash", "Mobile Money"].includes(selectedPaymentMethod)) {
    redirect(
      buildRedirect(
        `/vehicles/${sessionId}/checkout`,
        "error",
        "Select Cash or Mobile Money to mark a paid checkout.",
      ),
    );
  }

  const isPaid = intent === "paid";
  const status = isPaid ? "paid" : "unpaid_exit";
  const paymentMethod = isPaid ? selectedPaymentMethod : "Unpaid";
  const amountPaid = isPaid ? charge.totalAmountDue : 0;

  const { error } = await client
    .from("vehicle_sessions")
    .update({
      exit_time: exitTime,
      duration_minutes: charge.durationMinutes,
      amount_due: charge.totalAmountDue,
      amount_paid: amountPaid,
      payment_method: paymentMethod,
      status,
      checked_out_by: DEMO_STAFF_NAME,
      lost_receipt_applied: lostReceiptApplied,
      lost_receipt_fine_amount: charge.lostReceiptFineAmount,
    })
    .eq("id", sessionId);

  if (error) {
    throw new Error(error.message);
  }

  await createActivityLog(client, {
    vehicle_session_id: sessionId,
    action: isPaid ? "vehicle_checked_out_paid" : "vehicle_exited_unpaid",
    description: isPaid
      ? `Vehicle checked out and paid. Amount ${charge.totalAmountDue}.`
      : `Vehicle exited unpaid. Amount due ${charge.totalAmountDue}.`,
    created_by: DEMO_STAFF_NAME,
  });

  revalidateAll(sessionId);

  redirect(
    buildRedirect(
      "/staff",
      "message",
      isPaid
        ? `Vehicle ${session.plate_number} checked out and paid.`
        : `Vehicle ${session.plate_number} exited unpaid.`,
    ),
  );
}

export async function sendDemoSmsAction(previousState, formData) {
  try {
    const client = requireSupabaseServerClient();
    const sessionId = toText(formData.get("vehicle_session_id"));
    const messageType = toText(formData.get("message_type")) || "entry";

    const { data: session, error } = await client
      .from("vehicle_sessions")
      .select("*")
      .eq("id", sessionId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!session?.customer_phone) {
      return {
        status: "error",
        message: "This vehicle does not have a customer phone number.",
      };
    }

    const message =
      messageType === "checkout"
        ? buildCheckoutSmsPreview(session)
        : buildEntrySmsPreview(session);

    await sendDemoSms(session.customer_phone, message);
    await createActivityLog(client, {
      vehicle_session_id: sessionId,
      action: "sms_receipt_sent",
      description: `SMS receipt sent to ${session.customer_phone}.`,
      created_by: DEMO_STAFF_NAME,
    });

    revalidateAll(sessionId);

    return {
      status: "success",
      message: `SMS sent to ${session.customer_phone}.`,
    };
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
}

export async function createWaitlistLeadAction(formData) {
  const client = requireSupabaseServerClient();

  const clientName = toText(formData.get("client_name"));
  const businessName = toNullableText(formData.get("business_name"));
  const contactPhone = toNullableText(formData.get("contact_phone"));
  const contactEmail = toNullableText(formData.get("contact_email"));
  const location = toNullableText(formData.get("location"));
  const parkingSize = toNullableText(formData.get("parking_size"));
  const budgetRange = toNullableText(formData.get("budget_range"));
  const packageInterest = toNullableText(formData.get("package_interest"));
  const decisionTimeline = toNullableText(formData.get("decision_timeline"));
  const followUpStatus =
    toNullableText(formData.get("follow_up_status")) || "New Lead";
  const nextFollowUpDate = toNullableText(formData.get("next_follow_up_date"));
  const notes = toNullableText(formData.get("notes"));

  if (!clientName) {
    redirect(
      buildRedirect("/waitlist", "error", "Client name is required."),
    );
  }

  const { error } = await client.from("sales_waitlist").insert({
    client_name: clientName,
    business_name: businessName,
    contact_phone: contactPhone,
    contact_email: contactEmail,
    location,
    parking_size: parkingSize,
    budget_range: budgetRange,
    package_interest: packageInterest,
    decision_timeline: decisionTimeline,
    follow_up_status: followUpStatus,
    next_follow_up_date: nextFollowUpDate,
    notes,
    created_by: "Demo Sales",
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidateAll();

  redirect(
    buildRedirect(
      "/waitlist",
      "message",
      `Waitlist lead saved for ${clientName}.`,
    ),
  );
}
