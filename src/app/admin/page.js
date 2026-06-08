import Link from "next/link";
import { logoutAdminAction } from "@/app/admin/actions";
import { DataTable } from "@/components/data-table";
import { MetricCard } from "@/components/metric-card";
import { SectionCard } from "@/components/section-card";
import { formatDateOnly, formatDateTime, getDateKey } from "@/lib/format";
import { getWaitlistEntries } from "@/lib/data";
import { requireAdmin } from "@/lib/admin-auth";

function countDueFollowUps(entries) {
  const todayKey = getDateKey(new Date());

  return entries.filter(
    (entry) => entry.next_follow_up_date && entry.next_follow_up_date <= todayKey,
  ).length;
}

function countNewLeads(entries) {
  return entries.filter((entry) => entry.follow_up_status === "New Lead").length;
}

export default async function AdminDashboardPage() {
  const session = await requireAdmin();
  const waitlistEntries = await getWaitlistEntries();
  const totalLeads = waitlistEntries.length;
  const newLeads = countNewLeads(waitlistEntries);
  const dueFollowUps = countDueFollowUps(waitlistEntries);

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="flex flex-col gap-4 rounded-[2rem] border border-line bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Rompact Admin
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Waitlist oversight
            </h1>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-foreground/45">
              Signed in as {session.email}
            </p>
          </div>

          <form action={logoutAdminAction}>
            <button
              type="submit"
              className="rounded-2xl border border-line bg-surface-muted px-4 py-2 text-sm font-semibold text-foreground hover:text-accent"
            >
              Sign Out
            </button>
          </form>
        </section>

        <section className="grid grid-cols-2 gap-3 xl:grid-cols-3">
          <MetricCard label="Total Leads" value={totalLeads} accent="dark" />
          <MetricCard label="New Leads" value={newLeads} accent="accent" />
          <MetricCard label="Due Follow Ups" value={dueFollowUps} accent="muted" />
        </section>

        <SectionCard
          title="Waitlist Leads"
          subtitle="Latest submitted leads from the public waitlist form."
          surface="white"
        >
          <DataTable
            columns={[
              "Client",
              "Business",
              "Contact",
              "Status",
              "Next Follow Up",
              "Created",
              "Notes",
              "Action",
            ]}
            rowCount={waitlistEntries.length}
            emptyMessage="No waitlist leads have been submitted yet."
          >
            {waitlistEntries.map((entry) => (
              <tr key={entry.id}>
                <td className="px-4 py-4 text-sm font-semibold text-foreground">
                  <div>
                    <p>{entry.client_name}</p>
                    <p className="mt-1 text-xs font-normal text-foreground/58">
                      {entry.location || "Location not provided"}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-foreground/70">
                  {entry.business_name || "Not provided"}
                </td>
                <td className="px-4 py-4 text-sm text-foreground/70">
                  <div>
                    <p>{entry.contact_phone || "No phone"}</p>
                    <p className="mt-1 text-xs text-foreground/55">
                      {entry.contact_email || "No email"}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-foreground/70">
                  {entry.follow_up_status || "Not set"}
                </td>
                <td className="px-4 py-4 text-sm text-foreground/70">
                  {entry.next_follow_up_date
                    ? formatDateOnly(entry.next_follow_up_date)
                    : "Not scheduled"}
                </td>
                <td className="px-4 py-4 text-sm text-foreground/70">
                  {formatDateTime(entry.created_at)}
                </td>
                <td className="px-4 py-4 text-sm text-foreground/70">
                  {entry.notes || "No notes"}
                </td>
                <td className="px-4 py-4">
                  <Link
                    href={`/admin/leads/${entry.id}`}
                    className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-foreground hover:border-accent/40 hover:text-accent"
                  >
                    View details
                  </Link>
                </td>
              </tr>
            ))}
          </DataTable>
        </SectionCard>
      </div>
    </main>
  );
}
