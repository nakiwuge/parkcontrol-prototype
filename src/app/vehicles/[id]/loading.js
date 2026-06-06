import {
  SectionCardSkeleton,
  TableSkeleton,
  VehicleHeaderSkeleton,
  SkeletonBlock,
} from "@/components/page-skeletons";

export default function Loading() {
  return (
    <div className="space-y-6">
      <VehicleHeaderSkeleton />
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCardSkeleton>
          <div className="space-y-3 rounded-[1.4rem] border border-line bg-white p-4">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="grid gap-2 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-4">
                <SkeletonBlock className="h-3 w-24" />
                <SkeletonBlock className="h-4 w-full max-w-xs" />
              </div>
            ))}
          </div>
        </SectionCardSkeleton>
        <div className="space-y-6">
          <SectionCardSkeleton>
            <div className="space-y-4">
              <SkeletonBlock className="h-24 w-full" />
              <SkeletonBlock className="h-32 w-full" />
            </div>
          </SectionCardSkeleton>
          <SectionCardSkeleton>
            <SkeletonBlock className="h-56 w-full" />
          </SectionCardSkeleton>
        </div>
      </div>
      <SectionCardSkeleton>
        <TableSkeleton columns={4} rows={4} />
      </SectionCardSkeleton>
    </div>
  );
}
