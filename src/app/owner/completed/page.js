import { CompletedSessionsSection } from "@/components/completed-sessions-section";
import { FlashMessage } from "@/components/flash-message";
import { SetupNotice } from "@/components/setup-notice";
import { getDashboardSnapshot } from "@/lib/data";
import {
  filterSessionsByPlate,
  getVehicleSearchEmptyMessage,
  normalizePlateQuery,
} from "@/lib/vehicle-search";

export default async function AdminCompletedCarsPage({ searchParams }) {
  const filters = await searchParams;
  const selectedCompletedDate = String(filters?.completed_date ?? "").trim();
  const dashboard = await getDashboardSnapshot({
    completedDate: selectedCompletedDate,
  });
  const plateQuery = normalizePlateQuery(filters?.plate);
  const filteredCompletedSessions = filterSessionsByPlate(
    dashboard.completedPayments,
    plateQuery,
  );
  const emptyMessage = getVehicleSearchEmptyMessage(
    "No completed cars found for the selected day.",
    plateQuery,
  );

  return (
    <div className="space-y-6">
      <FlashMessage message={filters?.message} error={filters?.error} />

      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          Admin Dashboard
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Completed cars
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-foreground/65">
          Review paid and unpaid completed vehicle sessions for the selected day.
        </p>
      </section>

      {!dashboard.isConfigured ? <SetupNotice /> : null}

      <CompletedSessionsSection
        title="Completed Cars"
        subtitle={`Completed sessions for ${dashboard.completedPaymentsDateLabel}.`}
        actionPath="/owner/completed"
        dateInputId="admin-completed-date"
        dateValue={dashboard.completedPaymentsDateKey}
        plateQuery={plateQuery}
        sessions={filteredCompletedSessions}
        emptyMessage={emptyMessage}
        searchSummary="Search completed cars by number plate."
        backHref="/owner"
        backLabel="Back to Overview"
      />
    </div>
  );
}
