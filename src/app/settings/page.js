import { FlashMessage } from "@/components/flash-message";
import { ParkingSettingsForm } from "@/components/parking-settings-form";
import { SectionCard } from "@/components/section-card";
import { SetupNotice } from "@/components/setup-notice";
import { getDashboardSnapshot } from "@/lib/data";

export default async function SettingsPage({ searchParams }) {
  const filters = await searchParams;
  const dashboard = await getDashboardSnapshot();
  const site = dashboard.site;

  return (
    <div className="space-y-6">
      <FlashMessage message={filters?.message} error={filters?.error} />

      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          Settings
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Parking site settings
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-foreground/65">
          Keep operational settings in one place. Update the parking site
          identity and pricing used across staff, owner, and report views.
        </p>
      </section>

      {!dashboard.isConfigured ? <SetupNotice /> : null}

      <SectionCard
        title="Parking Configuration"
        subtitle="Changes here update site details and checkout pricing throughout the prototype."
        surface="white"
      >
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[1.5rem] border border-line bg-white p-5 shadow-sm">
            <ParkingSettingsForm site={site} disabled={!dashboard.isConfigured} />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
