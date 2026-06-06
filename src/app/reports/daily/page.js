import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { PlateSearchForm } from "@/components/plate-search-form";
import { PrintReportButton } from "@/components/print-report-button";
import { SectionCard } from "@/components/section-card";
import { SetupNotice } from "@/components/setup-notice";
import { StatusBadge } from "@/components/status-badge";
import { buildSummaryRows, getDashboardSnapshot } from "@/lib/data";
import { formatCurrencyUGX, formatDateTime } from "@/lib/format";
import {
  filterSessionsByPlate,
  getVehicleSearchEmptyMessage,
  normalizePlateQuery,
} from "@/lib/vehicle-search";

export default async function DailyReportPage({ searchParams }) {
  const filters = await searchParams;
  const selectedDate = String(filters?.date ?? "").trim();
  const dashboard = await getDashboardSnapshot({
    reportDate: selectedDate,
  });
  const plateQuery = normalizePlateQuery(filters?.plate);
  const filteredCompletedPayments = filterSessionsByPlate(
    dashboard.completedPayments,
    plateQuery,
  );
  const completedEmptyMessage = getVehicleSearchEmptyMessage(
    "No completed sessions to report yet.",
    plateQuery,
  );
  const rows = buildSummaryRows(dashboard.site, dashboard.report);
  const paymentBreakdownRows = [
    {
      label: "Cash payments",
      value: formatCurrencyUGX(dashboard.report.cashPayments),
    },
    {
      label: "Mobile money payments",
      value: formatCurrencyUGX(dashboard.report.mobileMoneyPayments),
    },
    {
      label: "Unpaid amount",
      value: formatCurrencyUGX(dashboard.report.unpaidAmount),
    },
  ];

  return (
    <div className="space-y-6">
      <section className="print-hidden space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          Daily Report
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Printable parking revenue summary
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-foreground/65">
          A simple owner-facing daily report showing volume, payment mix, fines,
          and current occupancy.
        </p>
      </section>

      {!dashboard.isConfigured ? <SetupNotice /> : null}

      <SectionCard
        title="Daily Summary"
        subtitle="Designed for quick printing and discussion with parking owners."
        actions={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <form action="/reports/daily" className="flex items-center gap-2">
              {plateQuery ? (
                <input type="hidden" name="plate" value={plateQuery} />
              ) : null}
              <label htmlFor="report-date" className="sr-only">
                Filter report by day
              </label>
              <input
                id="report-date"
                type="date"
                name="date"
                defaultValue={dashboard.report.dateKey}
                className="min-w-0 flex-1 rounded-2xl border border-line bg-white px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent sm:flex-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-2xl bg-foreground px-4 py-2.5 text-sm font-semibold text-white hover:bg-foreground/90"
              >
                Apply Day
              </button>
            </form>
            <PrintReportButton className="w-full sm:w-auto" />
          </div>
        }
      >
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="overflow-hidden rounded-[1.25rem] border border-line">
            <table className="min-w-full divide-y divide-line">
              <thead className="bg-surface-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-foreground/50">
                    Metric
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-foreground/50">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-white">
                {rows.map((row) => (
                  <tr key={row.label}>
                    <td className="px-4 py-4 text-sm font-semibold text-foreground">
                      {row.label}
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground/75">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <div className="overflow-hidden rounded-[1.25rem] border border-line">
              <table className="min-w-full divide-y divide-line">
                <thead className="bg-surface-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-foreground/50">
                      Payment breakdown
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-foreground/50">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line bg-white">
                  {paymentBreakdownRows.map((row) => (
                    <tr key={row.label}>
                      <td className="px-4 py-4 text-sm font-semibold text-foreground">
                        {row.label}
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground/75">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Completed Sessions"
        subtitle="Today’s paid and unpaid exits in report format."
        actions={
          <Link
            href="/owner"
            className="rounded-2xl border border-line bg-surface-muted px-4 py-2 text-sm font-semibold text-foreground hover:text-accent"
          >
            Open Owner Dashboard
          </Link>
        }
      >
        <div className="mb-5">
          <PlateSearchForm
            action="/reports/daily"
            defaultValue={plateQuery}
            hiddenFields={{ date: dashboard.report.dateKey }}
            summary="Search completed sessions by number plate."
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
            "Payment Method",
          ]}
          rowCount={filteredCompletedPayments.length}
          emptyMessage={completedEmptyMessage}
        >
          {filteredCompletedPayments.map((session) => (
            <tr key={session.id}>
              <td className="px-4 py-4 text-sm font-semibold text-foreground">
                {session.plate_number}
              </td>
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
            </tr>
          ))}
        </DataTable>
      </SectionCard>
    </div>
  );
}
