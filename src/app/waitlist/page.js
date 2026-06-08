import Link from "next/link";
import { createWaitlistLeadAction } from "@/app/actions";
import { FlashMessage } from "@/components/flash-message";
import { FormField } from "@/components/form-field";
import { MarketingBottomNav } from "@/components/marketing-bottom-nav";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingHeader } from "@/components/marketing-header";
import { SelectInput } from "@/components/select-input";
import { SectionCard } from "@/components/section-card";
import { SetupNotice } from "@/components/setup-notice";
import { SubmitButton } from "@/components/submit-button";
import {
  WAITLIST_PACKAGE_OPTIONS,
  WAITLIST_STATUS_OPTIONS,
  WAITLIST_TIMELINE_OPTIONS,
} from "@/lib/constants";
import { getDashboardSnapshot } from "@/lib/data";

function inputClassName() {
  return "w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent";
}

export default async function WaitlistPage({ searchParams }) {
  const filters = await searchParams;
  const dashboard = await getDashboardSnapshot();

  return (
    <div className="min-h-screen bg-background pb-24 text-foreground sm:pb-0">
      <MarketingHeader />

      <main>
        <section className="border-b border-line">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <div className="space-y-6">
              <FlashMessage message={filters?.message} error={filters?.error} />

              <section className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                  Waitlist
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
                  Join the ParkControl waitlist
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-foreground/65 sm:text-base">
                  Tell us about your parking business and preferred setup. We&apos;ll
                  follow up with a personalized demo and next steps.
                </p>
                <div className="pt-2">
                  <Link
                    href="/staff"
                    className="inline-flex items-center justify-center rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-foreground hover:border-accent hover:text-accent"
                  >
                    Try It Out
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            {!dashboard.isConfigured ? <SetupNotice /> : null}

            <SectionCard
              subtitle="Fill out the form to join the waitlist and share your parking management needs."
              surface="white"
            >
              <form action={createWaitlistLeadAction} className="grid gap-5 lg:grid-cols-2">
                <FormField label="Client name">
                  <input
                    type="text"
                    name="client_name"
                    required
                    placeholder="Ruth Nansubuga"
                    className={inputClassName()}
                  />
                </FormField>

                <FormField label="Business or site name (optional)">
                  <input
                    type="text"
                    name="business_name"
                    placeholder="City Mall Parking"
                    className={inputClassName()}
                  />
                </FormField>

                <FormField label="Contact phone" hint="Required">
                  <input
                    type="text"
                    name="contact_phone"
                    required
                    placeholder="+256700000000"
                    className={inputClassName()}
                  />
                </FormField>

                <FormField label="Contact email (optional)">
                  <input
                    type="email"
                    name="contact_email"
                    placeholder="client@example.com"
                    className={inputClassName()}
                  />
                </FormField>

                <FormField label="Location">
                  <input
                    type="text"
                    name="location"
                    placeholder="Kampala"
                    className={inputClassName()}
                  />
                </FormField>

                <FormField label="Parking size" hint="Slots, floors, or estimated volume">
                  <input
                    type="text"
                    name="parking_size"
                    placeholder="120 slots"
                    className={inputClassName()}
                  />
                </FormField>

                <FormField label="Budget">
                  <input
                    type="text"
                    name="budget_range"
                    placeholder="UGX 5M to 10M"
                    className={inputClassName()}
                  />
                </FormField>

                <FormField label="Package interest">
                  <SelectInput
                    name="package_interest"
                    defaultValue="Pro"
                    options={WAITLIST_PACKAGE_OPTIONS}
                  />
                </FormField>

                <FormField label="Decision timeline">
                  <SelectInput
                    name="decision_timeline"
                    defaultValue="Within 1 month"
                    options={WAITLIST_TIMELINE_OPTIONS}
                  />
                </FormField>

                <FormField label="Follow-up status" hint="Required">
                  <SelectInput
                    name="follow_up_status"
                    defaultValue="New Lead"
                    options={WAITLIST_STATUS_OPTIONS}
                  />
                </FormField>

                <FormField label="Next follow-up date (optional)">
                  <input
                    type="date"
                    name="next_follow_up_date"
                    className={inputClassName()}
                  />
                </FormField>

                <div className="lg:col-span-2">
                  <FormField label="Notes" hint="Pain points, objections, deal context, and next step">
                    <textarea
                      name="notes"
                      rows="4"
                      placeholder="Client wants better payment tracking and owner visibility. Demo follow-up next week."
                      className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent"
                    />
                  </FormField>
                </div>

                <div className="lg:col-span-2 flex justify-end">
                  <SubmitButton
                    type="submit"
                    className="rounded-2xl bg-foreground px-5 py-3 text-sm font-semibold text-white hover:bg-foreground/90"
                  >
                    Save Lead
                  </SubmitButton>
                </div>
              </form>
            </SectionCard>
          </div>
        </section>
      </main>

      <MarketingFooter />
      <MarketingBottomNav />
    </div>
  );
}
