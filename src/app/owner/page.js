import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { FlashMessage } from "@/components/flash-message";
import { MetricCard } from "@/components/metric-card";
import { PlateSearchForm } from "@/components/plate-search-form";
import { SectionCard } from "@/components/section-card";
import { SetupNotice } from "@/components/setup-notice";
import { StatusBadge } from "@/components/status-badge";
import {
  formatCurrencyUGX,
  formatDateTime,
  formatDurationLabel,
  getDurationMinutes,
} from "@/lib/format";
import { getDashboardSnapshot } from "@/lib/data";
import {
  filterSessionsByPlate,
  getVehicleSearchEmptyMessage,
  normalizePlateQuery,
} from "@/lib/vehicle-search";

export default async function OwnerDashboardPage({ searchParams }) {
  const filters = await searchParams;
  const selectedCompletedDate = String(filters?.completed_date ?? "").trim();
  const dashboard = await getDashboardSnapshot({
    completedDate: selectedCompletedDate,
  });
  const plateQuery = normalizePlateQuery(filters?.plate);
  const filteredActiveSessions = filterSessionsByPlate(
    dashboard.activeSessions,
    plateQuery,
  );
  const filteredCompletedPayments = filterSessionsByPlate(
    dashboard.completedPayments,
    plateQuery,
  );
  const activeEmptyMessage = getVehicleSearchEmptyMessage(
    "No active vehicles yet.",
    plateQuery,
  );
  const completedEmptyMessage = getVehicleSearchEmptyMessage(
    "No completed payments yet.",
    plateQuery,
  );

  return (
    <div className="space-y-6">
      <FlashMessage message={filters?.message} error={filters?.error} />

      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          Owner Dashboard
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Revenue visibility and parking performance
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-foreground/65">
          This view is designed for parking owners and Rompact partners to see
          occupancy, expected revenue, collections, and staff activity in real
          time.
        </p>
      </section>

      {!dashboard.isConfigured ? <SetupNotice /> : null}

      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
        <MetricCard
          label="Cars Entered Today"
          value={dashboard.owner.carsEnteredToday}
          accent="muted"
        />
        <MetricCard
          label="Cars Inside Now"
          value={dashboard.owner.carsInsideNow}
          accent="dark"
        />
        <MetricCard
          label="Cars Exited Today"
          value={dashboard.owner.carsExitedToday}
          accent="muted"
        />
        <MetricCard
          label="Expected Revenue"
          value={formatCurrencyUGX(dashboard.owner.expectedRevenue)}
          accent="accent"
        />
        <MetricCard
          label="Collected Revenue"
          value={formatCurrencyUGX(dashboard.owner.collectedRevenue)}
          accent="dark"
        />
        <MetricCard
          label="Current Hourly Rate"
          value={formatCurrencyUGX(dashboard.site.hourly_rate)}
          accent="muted"
        />
      </section>

      <SectionCard
        title="Active Cars"
        subtitle="Vehicles currently on site or waiting for confirmation."
        actions={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/settings"
              className="rounded-2xl bg-foreground px-4 py-2 text-sm font-semibold text-white hover:bg-foreground/90"
            >
              Open Settings
            </Link>
            <Link
              href="/reports/daily"
              className="rounded-2xl border border-line bg-surface-muted px-4 py-2 text-sm font-semibold text-foreground hover:text-accent"
            >
              View Daily Report
            </Link>
          </div>
        }
      >
        <div className="mb-5">
          <PlateSearchForm
            action="/owner"
            defaultValue={plateQuery}
            hiddenFields={{ completed_date: dashboard.completedPaymentsDateKey }}
            summary="Search active and completed owner tables by number plate."
          />
        </div>
        <DataTable
          columns={["Plate", "Receipt", "Entry Time", "Duration", "Source", "Status", "Action"]}
          rowCount={filteredActiveSessions.length}
          emptyMessage={activeEmptyMessage}
        >
          {filteredActiveSessions.map((session) => (
            <tr key={session.id}>
              <td className="px-4 py-4 text-sm font-semibold">{session.plate_number}</td>
              <td className="px-4 py-4 font-mono text-xs text-foreground/70">
                {session.receipt_number}
              </td>
              <td className="px-4 py-4 text-sm text-foreground/70">
                {formatDateTime(session.entry_time)}
              </td>
              <td className="px-4 py-4 text-sm text-foreground/70">
                {formatDurationLabel(getDurationMinutes(session.entry_time, new Date()))}
              </td>
              <td className="px-4 py-4 text-sm capitalize text-foreground/70">
                {session.source?.replace("_", " ")}
              </td>
              <td className="px-4 py-4">
                <StatusBadge status={session.status} />
              </td>
              <td className="px-4 py-4">
                <Link
                  href={`/vehicles/${session.id}`}
                  className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-foreground hover:border-accent/40 hover:text-accent"
                >
                  View details
                </Link>
              </td>
            </tr>
          ))}
        </DataTable>
      </SectionCard>

      <SectionCard
        title="Completed Payments"
        subtitle={`Paid and unpaid completed sessions for ${dashboard.completedPaymentsDateLabel}.`}
        surface="white"
        actions={
          <form action="/owner" className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {plateQuery ? (
              <input type="hidden" name="plate" value={plateQuery} />
            ) : null}
            <label htmlFor="completed-date" className="sr-only">
              Filter completed payments by date
            </label>
            <input
              id="completed-date"
              type="date"
              name="completed_date"
              defaultValue={dashboard.completedPaymentsDateKey}
              className="rounded-2xl border border-line bg-white px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="rounded-2xl bg-foreground px-4 py-2.5 text-sm font-semibold text-white hover:bg-foreground/90"
            >
              Apply Date
            </button>
          </form>
        }
      >
        <div className="mb-5">
          <PlateSearchForm
            action="/owner"
            defaultValue={plateQuery}
            hiddenFields={{ completed_date: dashboard.completedPaymentsDateKey }}
            summary="Search active and completed owner tables by number plate."
          />
        </div>
        <DataTable
          columns={[
            "Plate",
            "Receipt",
            "Exit Time",
            "Status",
            "Amount Due",
            "Amount Paid",
            "Payment",
            "Action",
          ]}
          rowCount={filteredCompletedPayments.length}
          emptyMessage={completedEmptyMessage}
        >
          {filteredCompletedPayments.map((session) => (
            <tr key={session.id}>
              <td className="px-4 py-4 text-sm font-semibold">{session.plate_number}</td>
              <td className="px-4 py-4 font-mono text-xs text-foreground/70">
                {session.receipt_number}
              </td>
              <td className="px-4 py-4 text-sm text-foreground/70">
                {formatDateTime(session.exit_time)}
              </td>
              <td className="px-4 py-4">
                <StatusBadge status={session.status} />
              </td>
              <td className="px-4 py-4 text-sm text-foreground/70">
                {formatCurrencyUGX(session.amount_due)}
              </td>
              <td className="px-4 py-4 text-sm text-foreground/70">
                {formatCurrencyUGX(session.amount_paid)}
              </td>
              <td className="px-4 py-4 text-sm text-foreground/70">
                {session.payment_method || "Not set"}
              </td>
              <td className="px-4 py-4">
                <Link
                  href={`/vehicles/${session.id}`}
                  className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-foreground hover:border-accent/40 hover:text-accent"
                >
                  View details
                </Link>
              </td>
            </tr>
          ))}
        </DataTable>
      </SectionCard>

      <SectionCard
        title="Staff Activity"
        subtitle="Recent actions recorded across entries, confirmations, checkouts, and demo SMS."
        actions={
          <Link
            href="/activity"
            className="rounded-2xl border border-line bg-surface-muted px-4 py-2 text-sm font-semibold text-foreground hover:text-accent"
          >
            View All Activity
          </Link>
        }
      >
        <DataTable
          columns={["Time", "Action", "Description", "Created By"]}
          rowCount={dashboard.staffActivity.slice(0, 12).length}
          emptyMessage="No activity logged yet."
        >
          {dashboard.staffActivity.slice(0, 12).map((log) => (
            <tr key={log.id}>
              <td className="px-4 py-4 text-sm text-foreground/70">
                {formatDateTime(log.created_at)}
              </td>
              <td className="px-4 py-4 text-sm font-semibold text-foreground">
                {log.action}
              </td>
              <td className="px-4 py-4 text-sm text-foreground/70">
                {log.description}
              </td>
              <td className="px-4 py-4 text-sm text-foreground/70">
                {log.created_by}
              </td>
            </tr>
          ))}
        </DataTable>
      </SectionCard>
    </div>
  );
}
