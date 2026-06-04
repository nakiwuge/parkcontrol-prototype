export function MetricCard({ label, value, accent = "dark" }) {
  const accentStyles = {
    dark: {
      card: "border-foreground/10 bg-white shadow-[0_20px_40px_rgba(31,41,55,0.08)]",
      tone: "bg-foreground",
      value: "text-foreground",
      label: "text-foreground/52",
      chip: "border-foreground/12 bg-foreground/5 text-foreground/72",
      dot: "bg-foreground",
      line: "bg-foreground/12",
    },
    accent: {
      card: "border-accent/12 bg-[#f8faf6] shadow-[0_20px_40px_rgba(107,122,82,0.1)]",
      tone: "bg-accent",
      value: "text-foreground",
      label: "text-foreground/52",
      chip: "border-accent/12 bg-accent/8 text-accent-strong",
      dot: "bg-accent",
      line: "bg-accent/14",
    },
    muted: {
      card: "border-line bg-surface shadow-[0_16px_30px_rgba(31,41,55,0.05)]",
      tone: "bg-surface-muted",
      value: "text-foreground",
      label: "text-foreground/48",
      chip: "border-line bg-white text-foreground/62",
      dot: "bg-accent/70",
      line: "bg-foreground/10",
    },
  };
  const palette = accentStyles[accent] ?? accentStyles.dark;
  const isLongValue = String(value ?? "").length > 14;

  return (
    <article
      className={`relative overflow-hidden rounded-[1.35rem] border p-3 sm:rounded-[1.6rem] sm:p-4 ${palette.card}`}
    >
      <span className={`absolute inset-x-0 top-0 h-1 ${palette.tone}`} />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className={`text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-[11px] ${palette.label}`}
          >
            {label}
          </p>
        </div>
        <span
          className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border sm:h-10 sm:w-10 ${palette.chip}`}
        >
          <span className="grid h-3.5 w-3.5 grid-cols-2 gap-0.5">
            <span className={`rounded-full ${palette.dot}`} />
            <span className={`rounded-full ${palette.dot}`} />
            <span className={`rounded-full ${palette.dot}`} />
            <span className={`rounded-full ${palette.dot}`} />
          </span>
        </span>
      </div>

      <div className="mt-6 flex items-end justify-between gap-3">
        <p
          className={`min-w-0 break-words font-semibold leading-none tracking-[-0.04em] ${palette.value} ${
            isLongValue
              ? "text-[1.15rem] sm:text-[1.45rem]"
              : "text-[1.7rem] sm:text-[2.15rem]"
          }`}
        >
          {value}
        </p>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <span className={`h-1.5 flex-1 rounded-full ${palette.line}`} />
        <span className={`h-1.5 w-10 rounded-full ${palette.tone}`} />
        <span className={`h-1.5 w-4 rounded-full ${palette.line}`} />
      </div>
    </article>
  );
}
