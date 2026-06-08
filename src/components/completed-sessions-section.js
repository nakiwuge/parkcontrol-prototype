import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { PlateSearchForm } from "@/components/plate-search-form";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { formatCurrencyUGX, formatDateTime } from "@/lib/format";

export function CompletedSessionsSection({
  title,
  subtitle,
  actionPath,
  dateInputId,
  dateValue,
  plateQuery,
  sessions,
  emptyMessage,
  searchSummary,
  surface = "white",
  backHref,
  backLabel,
}) {
  return (
    <SectionCard
      title={title}
      subtitle={subtitle}
      surface={surface}
      actions={
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <form action={actionPath} className="flex items-center gap-2">
            {plateQuery ? (
              <input type="hidden" name="plate" value={plateQuery} />
            ) : null}
            <label htmlFor={dateInputId} className="sr-only">
              Filter completed sessions by date
            </label>
            <input
              id={dateInputId}
              type="date"
              name="completed_date"
              defaultValue={dateValue}
              className="min-w-0 flex-1 rounded-2xl border border-line bg-white px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent sm:flex-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-2xl bg-foreground px-4 py-2.5 text-sm font-semibold text-white hover:bg-foreground/90"
            >
              Apply Date
            </button>
          </form>
          {backHref && backLabel ? (
            <Link
              href={backHref}
              className="rounded-2xl border border-line bg-surface-muted px-4 py-2.5 text-sm font-semibold text-foreground hover:text-accent"
            >
              {backLabel}
            </Link>
          ) : null}
        </div>
      }
    >
      <div className="mb-5">
        <PlateSearchForm
          action={actionPath}
          defaultValue={plateQuery}
          hiddenFields={{ completed_date: dateValue }}
          summary={searchSummary}
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
          "Action",
        ]}
        rowCount={sessions.length}
        emptyMessage={emptyMessage}
      >
        {sessions.map((session) => (
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
  );
}
