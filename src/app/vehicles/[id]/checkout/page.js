import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/checkout-form";
import { FlashMessage } from "@/components/flash-message";
import { SectionCard } from "@/components/section-card";
import { SetupNotice } from "@/components/setup-notice";
import { StatusBadge } from "@/components/status-badge";
import { getVehicleSessionDetails } from "@/lib/data";

export default async function CheckoutVehiclePage({ params, searchParams }) {
  const routeParams = await params;
  const filters = await searchParams;
  const details = await getVehicleSessionDetails(routeParams.id);

  if (details === null) {
    notFound();
  }

  if (!details?.isConfigured) {
    return <SetupNotice />;
  }

  const { session, site } = details;
  const canCheckout = ["inside", "needs_confirmation"].includes(session.status);

  return (
    <div className="space-y-6">
      <FlashMessage message={filters?.message} error={filters?.error} />

      <section className="flex flex-col gap-4 rounded-[1.75rem] border border-line bg-white p-6 shadow-sm lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Checkout Vehicle
            </p>
            <StatusBadge status={session.status} />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {session.plate_number}
          </h1>
        </div>
        <Link
          href={`/vehicles/${session.id}`}
          className="rounded-2xl border border-line bg-surface-muted px-4 py-2 text-sm font-semibold text-foreground hover:text-accent"
        >
          Back to Details
        </Link>
      </section>

      <SectionCard
        title="Checkout Summary"
      >
        {canCheckout ? (
          <CheckoutForm session={session} site={site} />
        ) : (
          <div className="space-y-4 rounded-[1.5rem] border border-dashed border-line bg-surface-muted p-5">
            <p className="text-sm leading-7 text-foreground/65">
              This session has already been completed and cannot be checked out again.
            </p>
            <Link
              href={`/vehicles/${session.id}`}
              className="inline-flex rounded-2xl bg-foreground px-4 py-2 text-sm font-semibold text-white hover:bg-foreground/90"
            >
              Return to vehicle details
            </Link>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
