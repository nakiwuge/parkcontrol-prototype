"use client";

import Link from "next/link";
import { useState } from "react";
import { checkoutVehicleAction } from "@/app/actions";
import { formatCurrencyUGX, formatDateTime, formatDurationLabel } from "@/lib/format";
import { calculateCharge, getEffectiveRateAmount } from "@/lib/parking";
import { SubmitButton } from "@/components/submit-button";

export function CheckoutForm({ session, site }) {
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const charge = calculateCharge({
    entryTime: session.entry_time,
    exitTime: new Date(),
    hourlyRate: site.hourly_rate,
    fixedRate: site.fixed_rate,
    lostReceiptFine: site.lost_receipt_fine,
    lostReceiptApplied: false,
    rateType: session.rate_type,
  });
  const displayRateAmount = getEffectiveRateAmount({
    rateType: session.rate_type,
    hourlyRate: site.hourly_rate,
    fixedRate: site.fixed_rate,
  });
  const rateLabel = session.rate_type === "Fixed" ? "Fixed rate" : "Hourly rate";

  function handleSubmit(event) {
    const submitter = event.nativeEvent.submitter;
    const intent = submitter?.value;

    if (intent === "paid" && paymentMethod === "Unpaid") {
      event.preventDefault();
      window.alert("Select Cash or Mobile Money to mark a paid checkout.");
    }
  }

  return (
    <form action={checkoutVehicleAction} onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="vehicle_session_id" value={session.id} />
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4 rounded-[1.5rem] border border-line bg-surface-muted p-5">
          <div className="border-b border-line pb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/45">
              Session details
            </p>
            <p className="mt-2 text-lg font-semibold text-foreground">
              {session.plate_number}
            </p>
            <p className="mt-1 font-mono text-xs text-foreground/58">
              {session.receipt_number}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground/60">Entry time</span>
            <span className="text-right text-sm font-semibold">
              {formatDateTime(session.entry_time)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground/60">Exit time</span>
            <span className="text-right text-sm font-semibold">
              {formatDateTime(new Date())}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground/60">Duration</span>
            <span className="font-semibold">
              {formatDurationLabel(charge.durationMinutes)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground/60">Rate type</span>
            <span className="font-semibold">{session.rate_type}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground/60">{rateLabel}</span>
            <span className="font-semibold">
              {formatCurrencyUGX(displayRateAmount)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground/60">Rounded hours</span>
            <span className="font-semibold">{charge.roundedHours}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground/60">Parking amount</span>
            <span className="font-semibold">
              {formatCurrencyUGX(charge.parkingAmount)}
            </span>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-line bg-white p-5">
          <div className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-foreground">
                Payment method
              </span>
              <select
                name="payment_method"
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
                className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-accent"
              >
                <option>Cash</option>
                <option>Mobile Money</option>
                <option>Unpaid</option>
              </select>
            </label>

            <div className="rounded-[1.5rem] bg-foreground p-5 text-white">
              <p className="text-sm font-medium text-white/70">Total amount due</p>
              <p className="mt-3 text-4xl font-semibold tracking-tight">
                {formatCurrencyUGX(charge.totalAmountDue)}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <SubmitButton
              type="submit"
              name="intent"
              value="paid"
              className="rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
              pendingLabel="Processing..."
            >
              Mark as Paid
            </SubmitButton>
            <SubmitButton
              type="submit"
              name="intent"
              value="unpaid_exit"
              className="rounded-2xl border border-line bg-white px-5 py-3 text-sm font-semibold text-foreground hover:border-rose-300 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
              pendingLabel="Processing..."
            >
              Mark as Unpaid Exit
            </SubmitButton>
            <Link
              href={`/vehicles/${session.id}`}
              className="inline-flex items-center justify-center rounded-2xl border border-line bg-surface-muted px-5 py-3 text-sm font-semibold text-foreground/70 hover:text-foreground"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
