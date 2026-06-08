import Link from "next/link";
import {
  APP_NAME,
  APP_TAGLINE,
  OWNER_LABEL,
  STAFF_LABEL,
} from "@/lib/constants";

const previewCards = [
  {
    title: "Entry to exit flow",
    text: "Create a manual vehicle entry, simulate a camera event, then run a checkout with accurate amount calculation.",
  },
  {
    title: "Payment tracking",
    text: "Show paid exits, unpaid exits, parking charges, and daily totals that parking owners can review quickly.",
  },
  {
    title: "Owner visibility",
    text: "Surface suspicious activity, current occupancy, staff activity, daily reports, and protected admin waitlist access.",
  },
];

export default function OverviewPage() {
  return (
    <div className="space-y-10">
      <section className="grid gap-6 rounded-[2rem] border border-line/70 bg-white/95 p-8 shadow-[0_24px_60px_rgba(17,17,17,0.08)] lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-4 py-1 text-sm font-semibold text-accent">
            Live parking demo prototype
          </div>
          <div className="space-y-4">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {APP_NAME}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-foreground/70">
              {APP_TAGLINE}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/staff"
              className="inline-flex items-center justify-center rounded-2xl bg-foreground px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-foreground/90"
            >
              Open {STAFF_LABEL} View
            </Link>
            <Link
              href="/owner"
              className="inline-flex items-center justify-center rounded-2xl border border-line bg-surface px-5 py-3 text-sm font-semibold text-foreground hover:border-accent/40 hover:text-accent"
            >
              Open {OWNER_LABEL} Dashboard
            </Link>
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-line bg-surface-muted p-6">
          <div className="grid gap-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-foreground/55">Staff View</p>
              <p className="mt-2 text-3xl font-semibold">Live parking floor</p>
              <p className="mt-3 text-sm leading-6 text-foreground/65">
                Manual entry, camera confirmation, checkout, payment marking, and
                demo SMS receipts.
              </p>
            </div>
            <div className="rounded-2xl bg-foreground px-5 py-6 text-white shadow-sm">
              <p className="text-sm font-medium text-white/65">Admin Dashboard</p>
              <p className="mt-2 text-3xl font-semibold">Payment visibility</p>
              <p className="mt-3 text-sm leading-6 text-white/75">
                Current occupancy, suspicious activity, collected payments, and
                printable daily reporting.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {previewCards.map((card) => (
          <article
            key={card.title}
            className="rounded-[1.75rem] border border-line bg-white p-6 shadow-sm"
          >
            <p className="text-base font-semibold text-foreground">{card.title}</p>
            <p className="mt-3 text-sm leading-7 text-foreground/65">{card.text}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
