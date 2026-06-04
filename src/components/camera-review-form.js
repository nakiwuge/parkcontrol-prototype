import Link from "next/link";
import { updateCameraVehicleDetailsAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { VehicleSessionFields } from "@/components/vehicle-session-fields";

export function CameraReviewForm({ session, site }) {
  return (
    <form action={updateCameraVehicleDetailsAction} className="grid gap-5 lg:grid-cols-2">
      <input type="hidden" name="vehicle_session_id" value={session.id} />

      <VehicleSessionFields defaults={session} site={site} />

      <div className="lg:col-span-2 flex flex-col gap-3 sm:flex-row">
        <SubmitButton
          type="submit"
          name="intent"
          value="save"
          className="rounded-2xl border border-line bg-white px-5 py-3 text-sm font-semibold text-foreground hover:border-accent/40 hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          Save Details
        </SubmitButton>
        <SubmitButton
          type="submit"
          name="intent"
          value="confirm"
          className="rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
        >
          Save and Confirm
        </SubmitButton>
        <Link
          href="/staff"
          className="inline-flex items-center justify-center rounded-2xl border border-line bg-surface-muted px-5 py-3 text-sm font-semibold text-foreground hover:text-accent"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
