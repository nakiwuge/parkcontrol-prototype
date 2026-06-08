import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { FlashMessage } from "@/components/flash-message";
import { SectionCard } from "@/components/section-card";
import { SetupNotice } from "@/components/setup-notice";
import { getDashboardSnapshot } from "@/lib/data";
import { formatDateTime } from "@/lib/format";

export default async function StaffActivityPage({ searchParams }) {
  const filters = await searchParams;
  const dashboard = await getDashboardSnapshot();

  return (
    <div className="space-y-6">
      <FlashMessage message={filters?.message} error={filters?.error} />

      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          Staff Activity
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Logged staff and system actions
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-foreground/65">
          Review entries, confirmations, checkouts, SMS actions, and other
          recorded events across the prototype.
        </p>
      </section>

      {!dashboard.isConfigured ? <SetupNotice /> : null}

      <SectionCard
        title="Activity Log"
        subtitle="The most recent recorded actions across the parking flow."
        actions={
          <Link
            href="/owner"
            className="rounded-2xl border border-line bg-surface-muted px-4 py-2 text-sm font-semibold text-foreground hover:text-accent"
          >
            Open Admin Dashboard
          </Link>
        }
      >
        <DataTable
          columns={["Time", "Action", "Description", "Created By"]}
          rowCount={dashboard.staffActivity.length}
          emptyMessage="No activity logged yet."
        >
          {dashboard.staffActivity.map((log) => (
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
