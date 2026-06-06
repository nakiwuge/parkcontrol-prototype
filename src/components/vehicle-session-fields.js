import { FormField } from "@/components/form-field";
import { SelectInput } from "@/components/select-input";
import {
  CAR_TYPES,
  KEY_STATUS_OPTIONS,
  RATE_TYPE_OPTIONS,
} from "@/lib/constants";
import { formatCurrencyUGX } from "@/lib/format";

export function VehicleSessionFields({
  defaults = {},
  site,
  includePlateNumber = true,
}) {
  return (
    <>
      {includePlateNumber ? (
        <FormField label="Plate number" hint="Max 7 characters. No spaces.">
          <input
            type="text"
            name="plate_number"
            placeholder="UBA123A"
            required
            maxLength={7}
            pattern="[A-Za-z0-9]{1,7}"
            defaultValue={defaults.plate_number ?? ""}
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm uppercase outline-none focus:border-accent"
          />
        </FormField>
      ) : null}

      <FormField label="Customer phone number" hint="Optional">
        <input
          type="text"
          name="customer_phone"
          placeholder="+256700000000"
          defaultValue={defaults.customer_phone ?? ""}
          className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-accent"
        />
      </FormField>

      <FormField label="Car type">
        <SelectInput
          name="car_type"
          defaultValue={defaults.car_type ?? "Saloon"}
          options={CAR_TYPES}
        />
      </FormField>

      <FormField label="Key status">
        <SelectInput
          name="key_status"
          defaultValue={defaults.key_status ?? "Key taken"}
          options={KEY_STATUS_OPTIONS}
        />
      </FormField>

      <FormField
        label="Rate type"
        hint={
          site
            ? `Hourly uses ${formatCurrencyUGX(
                site.hourly_rate,
              )}. Fixed uses ${formatCurrencyUGX(
                site.fixed_rate ?? site.hourly_rate,
              )}.`
            : undefined
        }
      >
        <SelectInput
          name="rate_type"
          defaultValue={defaults.rate_type ?? "Hourly"}
          options={RATE_TYPE_OPTIONS}
        />
      </FormField>

      <div className="lg:col-span-2">
        <FormField label="Notes" hint="Optional">
          <textarea
            name="notes"
            rows="4"
            placeholder="Any parking notes for the demo session."
            defaultValue={defaults.notes ?? ""}
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-accent"
          />
        </FormField>
      </div>
    </>
  );
}
