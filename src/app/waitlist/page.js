import Link from "next/link";
import { createWaitlistLeadAction } from "@/app/actions";
import { FlashMessage } from "@/components/flash-message";
import { MarketingBottomNav } from "@/components/marketing-bottom-nav";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingHeader } from "@/components/marketing-header";
import { SectionCard } from "@/components/section-card";
import { SetupNotice } from "@/components/setup-notice";
import { SubmitButton } from "@/components/submit-button";
import { WaitlistLeadFields } from "@/components/waitlist-lead-fields";
import { getDashboardSnapshot } from "@/lib/data";

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
                <WaitlistLeadFields />

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
