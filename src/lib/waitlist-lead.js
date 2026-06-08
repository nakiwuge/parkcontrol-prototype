function toText(value) {
  return String(value ?? "").trim();
}

function toNullableText(value) {
  const normalized = toText(value);
  return normalized || null;
}

export function getWaitlistLeadFormValues(formData) {
  return {
    clientName: toText(formData.get("client_name")),
    businessName: toNullableText(formData.get("business_name")),
    contactPhone: toNullableText(formData.get("contact_phone")),
    contactEmail: toNullableText(formData.get("contact_email")),
    location: toNullableText(formData.get("location")),
    parkingSize: toNullableText(formData.get("parking_size")),
    budgetRange: toNullableText(formData.get("budget_range")),
    packageInterest: toNullableText(formData.get("package_interest")),
    decisionTimeline: toNullableText(formData.get("decision_timeline")),
    followUpStatus: toNullableText(formData.get("follow_up_status")) || "New Lead",
    nextFollowUpDate: toNullableText(formData.get("next_follow_up_date")),
    notes: toNullableText(formData.get("notes")),
  };
}

export function buildWaitlistLeadPayload(formValues) {
  return {
    client_name: formValues.clientName,
    business_name: formValues.businessName,
    contact_phone: formValues.contactPhone,
    contact_email: formValues.contactEmail,
    location: formValues.location,
    parking_size: formValues.parkingSize,
    budget_range: formValues.budgetRange,
    package_interest: formValues.packageInterest,
    decision_timeline: formValues.decisionTimeline,
    follow_up_status: formValues.followUpStatus,
    next_follow_up_date: formValues.nextFollowUpDate,
    notes: formValues.notes,
  };
}
