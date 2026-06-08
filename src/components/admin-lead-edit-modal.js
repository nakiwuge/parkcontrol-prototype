"use client";

import { useEffect, useState } from "react";
import { updateWaitlistLeadAction } from "@/app/admin/actions";
import { SubmitButton } from "@/components/submit-button";
import { WaitlistLeadFields } from "@/components/waitlist-lead-fields";

export function AdminLeadEditModal({ entry }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-2xl bg-foreground px-4 py-2 text-sm font-semibold text-white hover:bg-foreground/90"
      >
        Edit Lead
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/45 px-3 py-6 sm:px-6">
          <div
            className="absolute inset-0"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-lead-title"
            className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[1.75rem] border border-line bg-white p-4 shadow-[0_24px_60px_rgba(31,41,55,0.18)] sm:p-6"
          >
            <div className="flex flex-col gap-3 border-b border-line/70 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2
                  id="edit-lead-title"
                  className="text-xl font-semibold tracking-tight text-foreground"
                >
                  Edit Lead
                </h2>
                <p className="mt-2 text-sm leading-6 text-foreground/60">
                  Update the lead details, follow-up status, and notes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-line bg-surface-muted px-4 py-2 text-sm font-semibold text-foreground hover:text-accent"
              >
                Cancel
              </button>
            </div>

            <div className="pt-5">
              <form action={updateWaitlistLeadAction} className="grid gap-5 lg:grid-cols-2">
                <input type="hidden" name="lead_id" value={entry.id} />
                <WaitlistLeadFields defaults={entry} />

                <div className="lg:col-span-2 flex justify-end">
                  <SubmitButton
                    type="submit"
                    pendingLabel="Updating..."
                    className="rounded-2xl bg-foreground px-5 py-3 text-sm font-semibold text-white hover:bg-foreground/90"
                  >
                    Update Lead
                  </SubmitButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
