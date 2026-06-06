import {
  SectionCardSkeleton,
  SkeletonBlock,
} from "@/components/page-skeletons";

export default function Loading() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-[1.75rem] border border-line bg-white p-6 shadow-sm lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <SkeletonBlock className="h-4 w-28 rounded-full" />
          <SkeletonBlock className="h-10 w-44" />
        </div>
        <SkeletonBlock className="h-10 w-32" />
      </section>
      <SectionCardSkeleton>
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4 rounded-[1.5rem] border border-line bg-surface p-5">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="h-4 w-28" />
              </div>
            ))}
          </div>
          <div className="rounded-[1.5rem] border border-line bg-white p-5">
            <div className="space-y-4">
              <SkeletonBlock className="h-4 w-32" />
              <SkeletonBlock className="h-12 w-full" />
              <SkeletonBlock className="h-28 w-full" />
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <SkeletonBlock className="h-11 flex-1" />
              <SkeletonBlock className="h-11 flex-1" />
              <SkeletonBlock className="h-11 flex-1" />
            </div>
          </div>
        </div>
      </SectionCardSkeleton>
    </div>
  );
}
