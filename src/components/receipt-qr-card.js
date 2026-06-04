import QRCode from "qrcode";
import { SectionCard } from "@/components/section-card";
import { APP_NAME } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";

export async function ReceiptQrCard({ session, site }) {
  const qrPayload = JSON.stringify({
    app: APP_NAME,
    receipt_number: session.receipt_number,
    plate_number: session.plate_number,
    parking_site: site.name,
    location: site.location,
    entry_time: session.entry_time,
    status: session.status,
  });

  const qrDataUrl = await QRCode.toDataURL(qrPayload, {
    width: 220,
    margin: 1,
    color: {
      dark: "#1f2937",
      light: "#ffffff",
    },
  });

  return (
    <SectionCard
      title="Receipt QR"
      subtitle="Use this QR code as a demo receipt reference for the vehicle session."
    >
      <div className="space-y-5">
        <div className="mx-auto w-full max-w-[220px] rounded-[1.5rem] border border-line bg-white p-4 shadow-sm">
          <img
            src={qrDataUrl}
            alt={`Receipt QR for ${session.receipt_number}`}
            className="h-auto w-full rounded-xl"
          />
        </div>

        <div className="overflow-hidden rounded-[1.4rem] border border-line">
          <div className="grid divide-y divide-line bg-surface">
            <div className="grid gap-2 px-4 py-4 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-start sm:gap-4 sm:px-5">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/48">
                Receipt number
              </dt>
              <dd className="break-all font-mono text-sm font-medium text-foreground/78">
                {session.receipt_number}
              </dd>
            </div>
            <div className="grid gap-2 px-4 py-4 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-start sm:gap-4 sm:px-5">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/48">
                Plate number
              </dt>
              <dd className="break-words text-sm font-medium text-foreground/78">
                {session.plate_number}
              </dd>
            </div>
            <div className="grid gap-2 px-4 py-4 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-start sm:gap-4 sm:px-5">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/48">
                Parking site
              </dt>
              <dd className="break-words text-sm font-medium text-foreground/78">
                {site.name}, {site.location}
              </dd>
            </div>
            <div className="grid gap-2 px-4 py-4 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-start sm:gap-4 sm:px-5">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/48">
                Entry time
              </dt>
              <dd className="text-sm font-medium text-foreground/78">
                {formatDateTime(session.entry_time)}
              </dd>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
