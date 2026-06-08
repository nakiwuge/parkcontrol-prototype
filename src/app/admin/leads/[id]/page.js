import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionCard } from "@/components/section-card";
import { formatDateOnly, formatDateTime } from "@/lib/format";
import { getWaitlistEntryDetails } from "@/lib/data";
import { requireAdmin } from "@/lib/admin-auth";

function buildLeadDetails(entry) {
  return [
    { label: "Client name", value: entry.client_name },
    { label: "Business name", value: entry.business_name || "Not provided" },
    { label: "Contact phone", value: entry.contact_phone || "Not provided" },
    { label: "Contact email", value: entry.contact_email || "Not provided" },
    { label: "Location", value: entry.location || "Not provided" },
    { label: "Parking size", value: entry.parking_size || "Not provided" },
    { label: "Budget range", value: entry.budget_range || "Not provided" },
    { label: "Package interest", value: entry.package_interest || "Not provided" },
    { label: "Decision timeline", value: entry.decision_timeline || "Not provided" },
    { label: "Follow-up status", value: entry.follow_up_status || "Not set" },
    {
      label: "Next follow-up date",
      value: entry.next_follow_up_date
        ? formatDateOnly(entry.next_follow_up_date)
        : "Not scheduled",
    },
    { label: "Created by", value: entry.created_by || "Not set" },
    { label: "Created at", value: formatDateTime(entry.created_at) },
    { label: "Updated at", value: formatDateTime(entry.updated_at) },
  ];
}

export default async function AdminLeadDetailsPage({ params }) {
  await requireAdmin();
  const routeParams = await params;
  const entry = await getWaitlistEntryDetails(routeParams.id);

  if (!entry) {
    notFound();
  }

  const details = buildLeadDetails(entry);

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-[1.9rem] border border-line bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                  Waitlist Lead
                </p>
                <span className="rounded-full border border-line bg-surface-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/58">
                  {entry.follow_up_status || "Not set"}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  {entry.client_name}
                </h1>
                <p className="mt-2 text-sm text-foreground/58">
                  {entry.business_name || "No business name provided"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-line bg-surface-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/58">
                  {entry.location || "Location not provided"}
                </span>
                <span className="rounded-full border border-line bg-surface-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/58">
                  {entry.package_interest || "No package selected"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin"
                className="rounded-2xl border border-line bg-surface-muted px-4 py-2 text-sm font-semibold text-foreground hover:text-accent"
              >
                Back to Leads
              </Link>
            </div>
          </div>
        </section>

        <SectionCard
          title="Lead Details"
          subtitle="Every field captured from the waitlist form for this lead."
          surface="white"
        >
          <div className="overflow-hidden rounded-[1.4rem] border border-line">
            <div className="grid divide-y divide-line bg-surface">
              {details.map((item) => (
                <div
                  key={item.label}
                  className="grid gap-2 px-4 py-4 sm:grid-cols-[220px_minmax(0,1fr)] sm:items-start sm:gap-4 sm:px-5"
                >
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/48">
                    {item.label}
                  </dt>
                  <dd className="text-sm text-foreground/78">{item.value}</dd>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-[1.4rem] border border-line bg-surface-muted p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/48">
              Notes
            </p>
            <p className="mt-3 text-sm leading-7 text-foreground/74">
              {entry.notes || "No notes provided."}
            </p>
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
