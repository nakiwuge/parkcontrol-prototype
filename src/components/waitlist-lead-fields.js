import { FormField } from "@/components/form-field";
import { SelectInput } from "@/components/select-input";
import {
  WAITLIST_PACKAGE_OPTIONS,
  WAITLIST_STATUS_OPTIONS,
  WAITLIST_TIMELINE_OPTIONS,
} from "@/lib/constants";

function inputClassName() {
  return "w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent";
}

export function WaitlistLeadFields({ defaults = {} }) {
  return (
    <>
      <FormField label="Client name">
        <input
          type="text"
          name="client_name"
          required
          defaultValue={defaults.client_name || ""}
          placeholder="Ruth Nansubuga"
          className={inputClassName()}
        />
      </FormField>

      <FormField label="Business or site name (optional)">
        <input
          type="text"
          name="business_name"
          defaultValue={defaults.business_name || ""}
          placeholder="City Mall Parking"
          className={inputClassName()}
        />
      </FormField>

      <FormField label="Contact phone" hint="Required">
        <input
          type="text"
          name="contact_phone"
          required
          defaultValue={defaults.contact_phone || ""}
          placeholder="+256700000000"
          className={inputClassName()}
        />
      </FormField>

      <FormField label="Contact email (optional)">
        <input
          type="email"
          name="contact_email"
          defaultValue={defaults.contact_email || ""}
          placeholder="client@example.com"
          className={inputClassName()}
        />
      </FormField>

      <FormField label="Location">
        <input
          type="text"
          name="location"
          defaultValue={defaults.location || ""}
          placeholder="Kampala"
          className={inputClassName()}
        />
      </FormField>

      <FormField label="Parking size" hint="Slots, floors, or estimated volume">
        <input
          type="text"
          name="parking_size"
          defaultValue={defaults.parking_size || ""}
          placeholder="120 slots"
          className={inputClassName()}
        />
      </FormField>

      <FormField label="Budget">
        <input
          type="text"
          name="budget_range"
          defaultValue={defaults.budget_range || ""}
          placeholder="UGX 5M to 10M"
          className={inputClassName()}
        />
      </FormField>

      <FormField label="Package interest">
        <SelectInput
          name="package_interest"
          defaultValue={defaults.package_interest || "Pro"}
          options={WAITLIST_PACKAGE_OPTIONS}
        />
      </FormField>

      <FormField label="Decision timeline">
        <SelectInput
          name="decision_timeline"
          defaultValue={defaults.decision_timeline || "Within 1 month"}
          options={WAITLIST_TIMELINE_OPTIONS}
        />
      </FormField>

      <FormField label="Follow-up status" hint="Required">
        <SelectInput
          name="follow_up_status"
          defaultValue={defaults.follow_up_status || "New Lead"}
          options={WAITLIST_STATUS_OPTIONS}
        />
      </FormField>

      <FormField label="Next follow-up date (optional)">
        <input
          type="date"
          name="next_follow_up_date"
          defaultValue={defaults.next_follow_up_date || ""}
          className={inputClassName()}
        />
      </FormField>

      <div className="lg:col-span-2">
        <FormField label="Notes" hint="Pain points, objections, deal context, and next step">
          <textarea
            name="notes"
            rows="4"
            defaultValue={defaults.notes || ""}
            placeholder="Client wants better payment tracking and owner visibility. Demo follow-up next week."
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent"
          />
        </FormField>
      </div>
    </>
  );
}
