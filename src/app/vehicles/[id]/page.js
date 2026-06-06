import Link from "next/link";
import { notFound } from "next/navigation";
import { CameraReviewForm } from "@/components/camera-review-form";
import { DataTable } from "@/components/data-table";
import { FlashMessage } from "@/components/flash-message";
import { ReceiptQrCard } from "@/components/receipt-qr-card";
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
  getEffectiveRateAmount,
} from "@/lib/parking";
import { getVehicleSessionDetails } from "@/lib/data";

export default async function VehicleDetailsPage({ params, searchParams }) {
  const routeParams = await params;
  const filters = await searchParams;
  const details = await getVehicleSessionDetails(routeParams.id);

  if (details === null) {
    notFound();
  }

  if (!details?.isConfigured) {
    return <SetupNotice />;
  }

  const { session, site, activityLogs, liveCharge } = details;
  const activeRateAmount = getEffectiveRateAmount({
    rateType: session.rate_type,
    hourlyRate: site.hourly_rate,
    fixedRate: site.fixed_rate,
  });
  const rateLabel = session.rate_type === "Fixed" ? "Fixed rate" : "Hourly rate";
  const liveDuration = session.exit_time
    ? formatDurationLabel(session.duration_minutes)
    : formatDurationLabel(getDurationMinutes(session.entry_time, new Date()));
  const summaryItems = [
    {
      label: "Current status",
      value:
        session.status === "needs_confirmation"
          ? "Needs review"
          : session.status === "inside"
            ? "Inside"
            : session.status === "paid"
              ? "Paid"
              : "Unpaid exit",
      tone: "dark",
    },
    {
      label: "Duration",
      value: liveDuration,
      tone: "muted",
    },
    {
      label: "Current total",
      value: formatCurrencyUGX(
        session.exit_time ? session.amount_due : liveCharge.totalAmountDue,
      ),
      tone: "accent",
    },
    {
      label: "Amount paid",
      value: formatCurrencyUGX(session.amount_paid),
      tone: "white",
    },
  ];
  const operationalDetails = [
    { label: "Receipt number", value: session.receipt_number },
    { label: "Entry time", value: formatDateTime(session.entry_time) },
    { label: "Exit time", value: formatDateTime(session.exit_time) },
    { label: "Rate type", value: session.rate_type },
    { label: rateLabel, value: formatCurrencyUGX(activeRateAmount) },
    {
      label: "Site fixed rate",
      value: formatCurrencyUGX(site.fixed_rate ?? site.hourly_rate),
    },
    { label: "Source", value: session.source?.replace("_", " ") || "Unknown" },
    { label: "Key status", value: session.key_status || "Not set" },
    { label: "Checked out by", value: session.checked_out_by || "Not yet checked out" },
  ];
  const customerDetails = [
    { label: "Customer phone", value: session.customer_phone || "Not provided" },
    { label: "Car type", value: session.car_type || "Not set" },
    { label: "Created by", value: session.created_by || "System" },
  ];
  const paymentStatusLabel =
    session.status === "paid"
      ? "Payment recorded"
      : session.status === "unpaid_exit"
        ? "Unpaid exit"
        : "Awaiting checkout";
  const summaryCardStyles = {
    dark: {
      card: "border-foreground/12 bg-foreground text-white shadow-[0_20px_36px_rgba(31,41,55,0.16)]",
      label: "text-white/60",
      value: "text-white",
      line: "bg-white/14",
    },
    accent: {
      card: "border-accent/12 bg-[#f5f8f1] text-foreground shadow-[0_18px_34px_rgba(107,122,82,0.08)]",
      label: "text-foreground/48",
      value: "text-foreground",
      line: "bg-accent/16",
    },
    muted: {
      card: "border-line bg-surface text-foreground shadow-sm",
      label: "text-foreground/48",
      value: "text-foreground",
      line: "bg-foreground/10",
    },
    white: {
      card: "border-line bg-white text-foreground shadow-[0_16px_28px_rgba(31,41,55,0.05)]",
      label: "text-foreground/48",
      value: "text-foreground",
      line: "bg-foreground/10",
    },
  };

  return (
    <div className="space-y-6">
      <FlashMessage message={filters?.message} error={filters?.error} />

      <section className="rounded-[1.9rem] border border-line bg-surface p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                Vehicle Record
              </p>
              <StatusBadge status={session.status} />
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {session.plate_number}
              </h1>
              <p className="mt-2 font-mono text-sm text-foreground/55">
                {session.receipt_number}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-line bg-surface-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/58">
                {site.name}
              </span>
              <span className="rounded-full border border-line bg-surface-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/58">
                {session.source?.replace("_", " ") || "Unknown source"}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {session.status === "inside" ? (
              <Link
                href={`/vehicles/${session.id}/checkout`}
                className="rounded-2xl bg-foreground px-4 py-2 text-sm font-semibold text-white hover:bg-foreground/90"
              >
                Checkout Vehicle
              </Link>
            ) : null}
            <Link
              href="/staff"
              className="rounded-2xl border border-line bg-surface-muted px-4 py-2 text-sm font-semibold text-foreground hover:text-accent"
            >
              Back to Staff View
            </Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
          {summaryItems.map((item) => (
            <article
              key={item.label}
              className={`rounded-[1.45rem] border px-4 py-4 sm:px-5 sm:py-5 ${
                summaryCardStyles[item.tone].card
              }`}
            >
              <p
                className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${
                  summaryCardStyles[item.tone].label
                }`}
              >
                {item.label}
              </p>
              <p
                className={`mt-4 text-xl font-semibold tracking-tight sm:text-[1.65rem] ${
                  summaryCardStyles[item.tone].value
                }`}
              >
                {item.value}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span
                  className={`h-1.5 flex-1 rounded-full ${
                    summaryCardStyles[item.tone].line
                  }`}
                />
                <span
                  className={`h-1.5 w-8 rounded-full ${
                    summaryCardStyles[item.tone].line
                  }`}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      {session.status === "needs_confirmation" ? (
        <SectionCard
          title="Review Camera Capture"
          subtitle="Add the missing vehicle details before the camera-detected session is confirmed."
        >
          <CameraReviewForm session={session} site={site} />
        </SectionCard>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard
          title="Session Record"
          subtitle="Structured operational details for this vehicle session."
        >
          <div className="overflow-hidden rounded-[1.4rem] border border-line">
            <div className="grid divide-y divide-line bg-surface">
              {operationalDetails.map((item) => (
                <div
                  key={item.label}
                  className="grid gap-2 px-4 py-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-start sm:gap-4 sm:px-5"
                >
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/48">
                    {item.label}
                  </dt>
                  <dd className="text-sm font-medium capitalize text-foreground/78">
                    {item.value}
                  </dd>
                </div>
              ))}
            </div>
          </div>

          {session.notes ? (
            <div className="mt-5 rounded-[1.4rem] border border-line bg-surface-muted p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/48">
                Notes
              </p>
              <p className="mt-3 text-sm leading-7 text-foreground/74">{session.notes}</p>
            </div>
          ) : null}
        </SectionCard>

        <div className="space-y-6">
          <SectionCard
            title="Customer & Payment"
            subtitle="Core customer, vehicle, and payment metadata."
          >
            <div className="space-y-4">
              <div className="rounded-[1.5rem] border border-foreground/10 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/46">
                      Payment status
                    </p>
                    <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                      {paymentStatusLabel}
                    </p>
                  </div>
                  <span className="rounded-full border border-line bg-surface-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/52">
                    {session.payment_method || "Not set"}
                  </span>
                </div>
              </div>

              <div className="overflow-hidden rounded-[1.4rem] border border-line">
                <div className="grid divide-y divide-line bg-surface">
                  {customerDetails.map((item) => (
                    <div
                      key={item.label}
                      className="grid gap-2 px-4 py-4 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-start sm:gap-4 sm:px-5"
                    >
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/48">
                        {item.label}
                      </dt>
                      <dd className="text-sm font-medium text-foreground/78">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          <ReceiptQrCard session={session} site={site} />
        </div>
      </div>

      <SectionCard
        title="Activity Log"
        subtitle="Every key step on this vehicle session is captured in order."
      >
        {activityLogs.length ? (
          <div className="space-y-3 md:hidden">
            {activityLogs.map((log) => (
              <article
                key={log.id}
                className="rounded-[1.3rem] border border-line bg-surface-muted p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{log.action}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-foreground/45">
                      {log.created_by}
                    </p>
                  </div>
                  <p className="text-xs text-foreground/55">
                    {formatDateTime(log.created_at)}
                  </p>
                </div>
                <p className="mt-3 text-sm leading-7 text-foreground/72">
                  {log.description}
                </p>
              </article>
            ))}
          </div>
        ) : null}

        <div className={activityLogs.length ? "hidden md:block" : "block"}>
          <DataTable
            columns={["Time", "Action", "Description", "Created By"]}
            rowCount={activityLogs.length}
            emptyMessage="No activity has been logged for this session yet."
          >
            {activityLogs.map((log) => (
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
        </div>
      </SectionCard>
    </div>
  );
}
