export function normalizePlateQuery(value) {
  return String(value ?? "").trim().toUpperCase();
}

export function filterSessionsByPlate(sessions, plateQuery) {
  if (!plateQuery) {
    return sessions;
  }

  return sessions.filter((session) =>
    String(session.plate_number ?? "").toUpperCase().includes(plateQuery),
  );
}

export function getVehicleSearchEmptyMessage(defaultMessage, plateQuery) {
  if (!plateQuery) {
    return defaultMessage;
  }

  return `No vehicles found for plate "${plateQuery}".`;
}
