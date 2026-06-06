import {
  PageIntroSkeleton,
  SectionCardSkeleton,
  SkeletonBlock,
} from "@/components/page-skeletons";

export default function Loading() {
  return (
    <div className="space-y-10">
      <section className="grid gap-6 rounded-[2rem] border border-line bg-white p-8 shadow-sm lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <SkeletonBlock className="h-8 w-40 rounded-full" />
          <PageIntroSkeleton compact />
          <div className="flex flex-col gap-3 sm:flex-row">
            <SkeletonBlock className="h-11 w-40" />
            <SkeletonBlock className="h-11 w-44" />
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-line bg-surface p-6">
          <div className="grid gap-4">
            <SkeletonBlock className="h-32 w-full" />
            <SkeletonBlock className="h-32 w-full" />
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SectionCardSkeleton key={index} surface="bg-white">
            <div className="space-y-3">
              <SkeletonBlock className="h-5 w-36" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-5/6" />
            </div>
          </SectionCardSkeleton>
        ))}
      </div>
    </div>
  );
}
