import Link from "next/link";
import { createVehicleEntryAction } from "@/app/actions";
import { FlashMessage } from "@/components/flash-message";
import { SectionCard } from "@/components/section-card";
import { SetupNotice } from "@/components/setup-notice";
import { SubmitButton } from "@/components/submit-button";
import { VehicleSessionFields } from "@/components/vehicle-session-fields";
import { getDashboardSnapshot } from "@/lib/data";

function getReturnToPath(value) {
  return value === "/owner" || value === "/owner/staff" ? value : "/staff";
}

export default async function NewVehicleEntryPage({ searchParams }) {
  const filters = await searchParams;
  const dashboard = await getDashboardSnapshot();
  const returnTo = getReturnToPath(filters?.returnTo);
  const backLabel = returnTo === "/owner" ? "Back to Admin Dashboard" : "Back to Staff View";
  const cancelLabel = returnTo === "/owner" ? "Cancel to Admin Dashboard" : "Cancel";

  return (
    <div className="space-y-6">
      <FlashMessage message={filters?.message} error={filters?.error} />

      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          New Vehicle Entry
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Create a manual parking entry
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-foreground/65">
          This creates a live vehicle session, generates the next receipt number,
          logs the activity, and returns the vehicle to the selected dashboard.
        </p>
      </section>

      {!dashboard.isConfigured ? <SetupNotice /> : null}

      <SectionCard
        title="Vehicle details"
        actions={
          <Link
            href={returnTo}
            className="rounded-2xl border border-line bg-surface-muted px-4 py-2 text-sm font-semibold text-foreground hover:text-accent"
          >
            {backLabel}
          </Link>
        }
      >
        <form action={createVehicleEntryAction} className="grid gap-5 lg:grid-cols-2">
          <input type="hidden" name="redirect_to" value={returnTo} />
          <VehicleSessionFields site={dashboard.site} />

          <div className="lg:col-span-2 flex flex-col gap-3 sm:flex-row">
            <SubmitButton
              type="submit"
              disabled={!dashboard.isConfigured}
              className="rounded-2xl bg-foreground px-5 py-3 text-sm font-semibold text-white hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Save Vehicle Entry
            </SubmitButton>
            <Link
              href={returnTo}
              className="inline-flex items-center justify-center rounded-2xl border border-line bg-surface-muted px-5 py-3 text-sm font-semibold text-foreground hover:text-accent"
            >
              {cancelLabel}
            </Link>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}
