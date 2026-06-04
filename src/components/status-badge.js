const statusClasses = {
  inside: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  needs_confirmation: "bg-amber-50 text-amber-700 ring-amber-200",
  paid: "bg-slate-100 text-slate-800 ring-slate-200",
  unpaid_exit: "bg-rose-50 text-rose-700 ring-rose-200",
  cancelled: "bg-zinc-100 text-zinc-700 ring-zinc-200",
};

const labelMap = {
  inside: "Inside",
  needs_confirmation: "Needs Staff Confirmation",
  paid: "Paid",
  unpaid_exit: "Unpaid Exit",
  cancelled: "Cancelled",
};

export function StatusBadge({ status }) {
  const normalizedStatus = status || "inside";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
        statusClasses[normalizedStatus] ?? "bg-slate-100 text-slate-700 ring-slate-200"
      }`}
    >
      {labelMap[normalizedStatus] ?? normalizedStatus}
    </span>
  );
}
