import { updateParkingSettingsAction } from "@/app/actions";
import { FormField } from "@/components/form-field";
import { SubmitButton } from "@/components/submit-button";

function inputClassName() {
  return "w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent";
}

export function ParkingSettingsForm({ site, disabled }) {
  return (
    <form action={updateParkingSettingsAction} className="grid gap-5 lg:grid-cols-2">
      <FormField
        label="Parking site name"
        hint="Displayed across dashboards and reports."
      >
        <input
          type="text"
          name="name"
          defaultValue={site.name}
          className={inputClassName()}
        />
      </FormField>

      <FormField
        label="Location"
        hint="Use a short readable location for the prototype."
      >
        <input
          type="text"
          name="location"
          defaultValue={site.location}
          className={inputClassName()}
        />
      </FormField>

      <FormField
        label="Hourly rate"
        hint="Used when a session is marked as Hourly."
      >
        <input
          type="number"
          name="hourly_rate"
          min="1"
          defaultValue={site.hourly_rate}
          className={inputClassName()}
        />
      </FormField>

      <FormField
        label="Fixed rate"
        hint="Used when a session is marked as Fixed."
      >
        <input
          type="number"
          name="fixed_rate"
          min="1"
          defaultValue={site.fixed_rate ?? site.hourly_rate}
          className={inputClassName()}
        />
      </FormField>

      <div className="rounded-[1.4rem] border border-line bg-surface-muted p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/45">
          Effect of changes
        </p>
        <p className="mt-3 text-sm leading-7 text-foreground/68">
          Updates apply immediately to new checkouts, staff pricing previews,
          owner revenue totals, and the daily report.
        </p>
      </div>

      <div className="lg:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-7 text-foreground/60">
          Keep the settings simple for the live prototype. This page is the
          control point for pricing and site identity.
        </p>
        <SubmitButton
          type="submit"
          disabled={disabled}
          className="rounded-2xl bg-foreground px-5 py-3 text-sm font-semibold text-white hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Save Settings
        </SubmitButton>
      </div>
    </form>
  );
}
