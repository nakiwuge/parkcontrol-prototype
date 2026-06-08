import Link from "next/link";
import { simulateCameraCaptureAction } from "@/app/actions";
import { DataTable } from "@/components/data-table";
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
import {
  filterSessionsByPlate,
  getVehicleSearchEmptyMessage,
  normalizePlateQuery,
} from "@/lib/vehicle-search";

const OVERDUE_MINUTES = 7 * 60;

export function StaffOverviewContent({
  dashboard,
  plateQuery,
  searchAction,
  headingLabel = "Staff View",
}) {
  const normalizedPlateQuery = normalizePlateQuery(plateQuery);
  const filteredActiveSessions = filterSessionsByPlate(
    dashboard.activeSessions,
    normalizedPlateQuery,
  );
  const overdueActiveSessions = dashboard.activeSessions
    .map((session) => ({
      ...session,
      currentDurationMinutes: getDurationMinutes(session.entry_time, new Date()),
    }))
    .filter((session) => session.currentDurationMinutes > OVERDUE_MINUTES);
  const activeEmptyMessage = getVehicleSearchEmptyMessage(
    "No active vehicles yet.",
    normalizedPlateQuery,
  );

  return (
    <>
      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          {headingLabel}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Parking operations dashboard
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-foreground/65">
          Manage new entries, confirm camera detections, checkout vehicles, and
          monitor daily collections.
        </p>
      </section>

      {!dashboard.isConfigured ? <SetupNotice /> : null}

      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <MetricCard
          label="Cars Inside"
          value={dashboard.staff.carsInside}
          accent="dark"
        />
        <MetricCard
          label="Cars Entered Today"
          value={dashboard.staff.carsEnteredToday}
          accent="accent"
        />
        <MetricCard
          label="Cars Exited Today"
          value={dashboard.staff.carsExitedToday}
          accent="muted"
        />
        <MetricCard
          label="Collected Today"
          value={formatCurrencyUGX(dashboard.staff.collectedToday)}
          accent="accent"
        />
      </section>

      <SectionCard
        title="Active Cars"
        subtitle="Vehicles currently inside or waiting for staff confirmation."
        actions={
          <>
            <Link
              href="/staff/entry"
              className="rounded-2xl bg-foreground px-4 py-2 text-sm font-semibold text-white hover:bg-foreground/90"
            >
              New Vehicle Entry
            </Link>
            <form action={simulateCameraCaptureAction}>
              <button
                type="submit"
                disabled={!dashboard.isConfigured}
                className="rounded-2xl border border-line bg-white px-4 py-2 text-sm font-semibold text-foreground hover:border-accent/40 hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
              >
                Simulate Camera Capture
              </button>
            </form>
            <Link
              href="/reports/daily"
              className="rounded-2xl border border-line bg-surface-muted px-4 py-2 text-sm font-semibold text-foreground hover:text-accent"
            >
              Daily Report
            </Link>
          </>
        }
      >
        <div className="mb-5">
          <PlateSearchForm
            action={searchAction}
            defaultValue={normalizedPlateQuery}
            summary="Search active vehicles by number plate."
          />
        </div>

        {overdueActiveSessions.length ? (
          <div className="mb-5 rounded-[1.4rem] border border-[#c98a4a]/35 bg-[#fbf3e8] p-4 sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9a5b1f]">
                  Checkout alert
                </p>
                <p className="mt-2 text-base font-semibold text-foreground">
                  {overdueActiveSessions.length === 1
                    ? "1 car has been marked active for more than 7 hours."
                    : `${overdueActiveSessions.length} cars have been marked active for more than 7 hours.`}
                </p>
                <p className="mt-2 text-sm leading-7 text-foreground/68">
                  Review these records in case a vehicle was not checked out.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {overdueActiveSessions.slice(0, 3).map((session) => (
                  <Link
                    key={session.id}
                    href={`/vehicles/${session.id}`}
                    className="inline-flex items-center gap-2 rounded-full border border-[#d7b187] bg-white px-3 py-1.5 text-xs font-semibold text-foreground hover:border-[#9a5b1f] hover:text-[#9a5b1f]"
                  >
                    <span>{session.plate_number}</span>
                    <span className="text-foreground/48">
                      {formatDurationLabel(session.currentDurationMinutes)}
                    </span>
                  </Link>
                ))}
                {overdueActiveSessions.length > 3 ? (
                  <span className="inline-flex items-center rounded-full border border-[#d7b187] bg-white px-3 py-1.5 text-xs font-semibold text-foreground/58">
                    +{overdueActiveSessions.length - 3} more
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {filteredActiveSessions.length ? (
          <div className="space-y-3 lg:hidden">
            {filteredActiveSessions.map((session) => {
              const currentDurationMinutes = getDurationMinutes(
                session.entry_time,
                new Date(),
              );
              const isOverdue = currentDurationMinutes > OVERDUE_MINUTES;

              return (
                <article
                  key={session.id}
                  className={`rounded-[1.35rem] border p-4 ${
                    isOverdue
                      ? "border-accent/30 bg-[#f7f8f3]"
                      : "border-line bg-surface-muted"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-foreground">
                        {session.plate_number}
                      </p>
                      <p className="mt-1 font-mono text-xs text-foreground/62">
                        {session.receipt_number}
                      </p>
                      {isOverdue ? (
                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                          Still active after {formatDurationLabel(currentDurationMinutes)}
                        </p>
                      ) : null}
                    </div>
                    <StatusBadge status={session.status} />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/45">
                        Entry
                      </p>
                      <p className="mt-1 text-sm text-foreground/72">
                        {formatDateTime(session.entry_time)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/45">
                        Duration
                      </p>
                      <p className="mt-1 text-sm text-foreground/72">
                        {formatDurationLabel(currentDurationMinutes)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/45">
                        Key
                      </p>
                      <p className="mt-1 text-sm text-foreground/72">
                        {session.key_status || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {session.status === "needs_confirmation" ? (
                      <Link
                        href={`/vehicles/${session.id}`}
                        className="inline-flex flex-1 items-center justify-center rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-strong"
                      >
                        Review &amp; Confirm
                      </Link>
                    ) : null}
                    {session.status === "inside" ? (
                      <Link
                        href={`/vehicles/${session.id}/checkout`}
                        className="inline-flex flex-1 items-center justify-center rounded-2xl bg-foreground px-4 py-2.5 text-sm font-semibold text-white hover:bg-foreground/90"
                      >
                        Checkout
                      </Link>
                    ) : null}
                    <Link
                      href={`/vehicles/${session.id}`}
                      className="inline-flex items-center justify-center rounded-2xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-foreground hover:border-accent/40 hover:text-accent"
                    >
                      Details
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[1.25rem] border border-line bg-white px-4 py-8 text-center text-sm text-foreground/55 lg:hidden">
            {activeEmptyMessage}
          </div>
        )}

        <div className="hidden lg:block">
          <DataTable
            columns={[
              "Plate Number",
              "Receipt Number",
              "Entry Time",
              "Duration",
              "Key Status",
              "Source",
              "Status",
              "Action",
            ]}
            rowCount={filteredActiveSessions.length}
            emptyMessage={activeEmptyMessage}
          >
            {filteredActiveSessions.map((session) => {
              const currentDurationMinutes = getDurationMinutes(
                session.entry_time,
                new Date(),
              );
              const isOverdue = currentDurationMinutes > OVERDUE_MINUTES;

              return (
                <tr
                  key={session.id}
                  className={`align-top ${isOverdue ? "bg-[#f7f8f3]" : ""}`}
                >
                  <td className="px-4 py-4 text-sm font-semibold text-foreground">
                    <div>
                      <p>{session.plate_number}</p>
                      {isOverdue ? (
                        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                          Check if still inside
                        </p>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-foreground/70">
                    {session.receipt_number}
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground/70">
                    {formatDateTime(session.entry_time)}
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground/70">
                    <div>
                      <p>{formatDurationLabel(currentDurationMinutes)}</p>
                      {isOverdue ? (
                        <p className="mt-1 inline-flex whitespace-nowrap rounded-full bg-[#fbf3e8] px-2.5 py-1 text-xs font-semibold text-[#9a5b1f]">
                          Over 7 hours
                        </p>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground/70">
                    {session.key_status || "Not set"}
                  </td>
                  <td className="px-4 py-4 text-sm capitalize text-foreground/70">
                    {session.source?.replace("_", " ")}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={session.status} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      {session.status === "needs_confirmation" ? (
                        <Link
                          href={`/vehicles/${session.id}`}
                          className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-strong"
                        >
                          Review &amp; Confirm
                        </Link>
                      ) : null}
                      {session.status === "inside" ? (
                        <Link
                          href={`/vehicles/${session.id}/checkout`}
                          className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-foreground hover:border-accent/40 hover:text-accent"
                        >
                          Checkout
                        </Link>
                      ) : null}
                      <Link
                        href={`/vehicles/${session.id}`}
                        className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-foreground hover:border-accent/40 hover:text-accent"
                      >
                        View details
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </DataTable>
        </div>
      </SectionCard>
    </>
  );
}
