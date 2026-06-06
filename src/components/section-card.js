export function SectionCard({
  title,
  subtitle,
  actions,
  children,
  surface = "muted",
}) {
  const surfaceClassName =
    surface === "white" ? "bg-white" : "bg-surface";

  return (
    <section
      className={`rounded-[1.75rem] border border-line p-4 shadow-sm sm:p-6 ${surfaceClassName}`}
    >
      <div className="flex flex-col gap-3 border-b border-line/70 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-2 text-sm leading-6 text-foreground/60">{subtitle}</p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      <div className="pt-5">{children}</div>
    </section>
  );
}
