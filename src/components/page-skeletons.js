function cx(...values) {
  return values.filter(Boolean).join(" ");
}

export function SkeletonBlock({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={cx("animate-pulse rounded-2xl bg-surface-muted", className)}
    />
  );
}

export function PageIntroSkeleton({ compact = false }) {
  return (
    <section className="space-y-3">
      <SkeletonBlock className="h-4 w-28 rounded-full" />
      <SkeletonBlock className={compact ? "h-9 w-72" : "h-11 w-80"} />
      <SkeletonBlock className="h-4 w-full max-w-3xl" />
      <SkeletonBlock className="h-4 w-full max-w-2xl" />
    </section>
  );
}

export function MetricGridSkeleton({ count = 4 }) {
  return (
    <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-[1.45rem] border border-line bg-white p-4 shadow-sm sm:p-5"
        >
          <SkeletonBlock className="h-3 w-24 rounded-full" />
          <SkeletonBlock className="mt-5 h-8 w-20" />
        </div>
      ))}
    </section>
  );
}

export function TableSkeleton({
  columns = 6,
  rows = 5,
  search = false,
  actions = false,
}) {
  return (
    <div className="space-y-5">
      {search ? <SkeletonBlock className="h-11 w-full max-w-md" /> : null}

      <div className="hidden overflow-hidden rounded-[1.25rem] border border-line lg:block">
        <div
          className="grid border-b border-line bg-surface"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns }).map((_, index) => (
            <div key={index} className="px-4 py-3">
              <SkeletonBlock className="h-3 w-16 rounded-full" />
            </div>
          ))}
        </div>
        <div className="divide-y divide-line bg-white">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid"
              style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: columns }).map((_, columnIndex) => (
                <div key={columnIndex} className="px-4 py-4">
                  <SkeletonBlock
                    className={cx(
                      "h-4",
                      columnIndex === columns - 1 && actions ? "w-24" : "w-full max-w-[7rem]",
                    )}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 lg:hidden">
        {Array.from({ length: Math.min(rows, 3) }).map((_, index) => (
          <div
            key={index}
            className="rounded-[1.35rem] border border-line bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-2">
                <SkeletonBlock className="h-5 w-24" />
                <SkeletonBlock className="h-3 w-20" />
              </div>
              <SkeletonBlock className="h-6 w-16 rounded-full" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <SkeletonBlock className="h-12 w-full" />
              <SkeletonBlock className="h-12 w-full" />
            </div>
            {actions ? (
              <div className="mt-4 flex gap-2">
                <SkeletonBlock className="h-10 flex-1" />
                <SkeletonBlock className="h-10 w-24" />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SectionCardSkeleton({
  title = true,
  subtitle = true,
  actionWidth,
  children,
  surface = "bg-surface",
}) {
  return (
    <section className={cx("rounded-[1.75rem] border border-line p-4 shadow-sm sm:p-6", surface)}>
      <div className="flex flex-col gap-3 border-b border-line/70 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          {title ? <SkeletonBlock className="h-7 w-48" /> : null}
          {subtitle ? <SkeletonBlock className="h-4 w-full max-w-md" /> : null}
        </div>
        {actionWidth ? <SkeletonBlock className={`h-10 ${actionWidth}`} /> : null}
      </div>
      <div className="pt-5">{children}</div>
    </section>
  );
}

export function FormGridSkeleton({ fields = 6, buttons = 2 }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="h-12 w-full" />
        </div>
      ))}
      <div className="space-y-2 lg:col-span-2">
        <SkeletonBlock className="h-4 w-24" />
        <SkeletonBlock className="h-28 w-full" />
      </div>
      <div className="flex flex-col gap-3 lg:col-span-2 sm:flex-row">
        {Array.from({ length: buttons }).map((_, index) => (
          <SkeletonBlock key={index} className="h-11 flex-1 sm:max-w-[12rem]" />
        ))}
      </div>
    </div>
  );
}

export function VehicleHeaderSkeleton() {
  return (
    <section className="rounded-[1.9rem] border border-line bg-surface p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <SkeletonBlock className="h-4 w-28 rounded-full" />
            <SkeletonBlock className="h-6 w-24 rounded-full" />
          </div>
          <div className="space-y-2">
            <SkeletonBlock className="h-10 w-48" />
            <SkeletonBlock className="h-4 w-24" />
          </div>
        </div>
        <div className="flex gap-3">
          <SkeletonBlock className="h-10 w-32" />
          <SkeletonBlock className="h-10 w-32" />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[1.45rem] border border-line bg-white px-4 py-4 sm:px-5 sm:py-5"
          >
            <SkeletonBlock className="h-3 w-20 rounded-full" />
            <SkeletonBlock className="mt-4 h-7 w-24" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function LandingSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-line bg-[#f6f7f3]/96 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <SkeletonBlock className="h-11 w-11 rounded-2xl" />
            <div className="space-y-2">
              <SkeletonBlock className="h-5 w-28" />
              <SkeletonBlock className="hidden h-3 w-40 sm:block" />
            </div>
          </div>
          <div className="hidden gap-3 sm:flex">
            <SkeletonBlock className="h-10 w-28 rounded-full" />
            <SkeletonBlock className="h-10 w-32 rounded-full" />
          </div>
          <SkeletonBlock className="h-11 w-11 rounded-2xl sm:hidden" />
        </div>
      </header>

      <main>
        <section className="border-b border-line">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
            <div className="space-y-5">
              <SkeletonBlock className="h-4 w-40 rounded-full" />
              <SkeletonBlock className="h-10 w-full max-w-4xl sm:h-14" />
              <SkeletonBlock className="h-10 w-full max-w-3xl sm:h-14" />
              <SkeletonBlock className="h-4 w-full max-w-3xl" />
              <SkeletonBlock className="h-4 w-full max-w-2xl" />
              <div className="flex flex-col gap-3 sm:flex-row">
                <SkeletonBlock className="h-12 w-40 rounded-full" />
                <SkeletonBlock className="h-12 w-40 rounded-full" />
              </div>
            </div>
          </div>
        </section>
        <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
          <SectionCardSkeleton actionWidth="w-32">
            <div className="grid gap-4 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="rounded-[1.5rem] border border-line bg-white p-5">
                  <SkeletonBlock className="h-4 w-16 rounded-full" />
                  <SkeletonBlock className="mt-4 h-6 w-32" />
                  <SkeletonBlock className="mt-3 h-4 w-full" />
                  <SkeletonBlock className="mt-2 h-4 w-5/6" />
                </div>
              ))}
            </div>
          </SectionCardSkeleton>
          <SectionCardSkeleton>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="rounded-[1.8rem] border border-line bg-white p-6">
                  <SkeletonBlock className="h-4 w-20 rounded-full" />
                  <SkeletonBlock className="mt-4 h-8 w-40" />
                  <SkeletonBlock className="mt-3 h-4 w-full" />
                  <SkeletonBlock className="mt-2 h-4 w-5/6" />
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <SkeletonBlock className="h-20 w-full" />
                    <SkeletonBlock className="h-20 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </SectionCardSkeleton>
        </div>
      </main>
    </div>
  );
}
