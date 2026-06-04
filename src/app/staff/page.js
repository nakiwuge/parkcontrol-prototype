import Link from "next/link";
import { simulateCameraCaptureAction } from "@/app/actions";
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

export default async function StaffDashboardPage({ searchParams }) {
  const filters = await searchParams;
  const dashboard = await getDashboardSnapshot();
  const plateQuery = normalizePlateQuery(filters?.plate);
  const filteredActiveSessions = filterSessionsByPlate(
    dashboard.activeSessions,
    plateQuery,
  );
  const activeEmptyMessage = getVehicleSearchEmptyMessage(
    "No active vehicles yet.",
    plateQuery,
  );

  return (
    <div className="space-y-6">
      <FlashMessage message={filters?.message} error={filters?.error} />

      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          Staff View
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
            action="/staff"
            defaultValue={plateQuery}
            summary="Search active vehicles by number plate."
          />
        </div>

        {filteredActiveSessions.length ? (
          <div className="space-y-3 lg:hidden">
            {filteredActiveSessions.map((session) => (
              <article
                key={session.id}
                className="rounded-[1.35rem] border border-line bg-surface-muted p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-foreground">
                      {session.plate_number}
                    </p>
                    <p className="mt-1 font-mono text-xs text-foreground/62">
                      {session.receipt_number}
                    </p>
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
                      {formatDurationLabel(
                        getDurationMinutes(session.entry_time, new Date()),
                      )}
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
            ))}
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
            {filteredActiveSessions.map((session) => (
              <tr key={session.id} className="align-top">
                <td className="px-4 py-4 text-sm font-semibold text-foreground">
                  {session.plate_number}
                </td>
                <td className="px-4 py-4 font-mono text-xs text-foreground/70">
                  {session.receipt_number}
                </td>
                <td className="px-4 py-4 text-sm text-foreground/70">
                  {formatDateTime(session.entry_time)}
                </td>
                <td className="px-4 py-4 text-sm text-foreground/70">
                  {formatDurationLabel(getDurationMinutes(session.entry_time, new Date()))}
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
            ))}
          </DataTable>
        </div>
      </SectionCard>
    </div>
  );
}
