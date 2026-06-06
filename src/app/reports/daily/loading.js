import {
  PageIntroSkeleton,
  SectionCardSkeleton,
  SkeletonBlock,
  TableSkeleton,
} from "@/components/page-skeletons";

export default function Loading() {
  return (
    <div className="space-y-6">
      <PageIntroSkeleton />
      <SectionCardSkeleton actionWidth="w-full sm:w-80">
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[1.25rem] border border-line bg-white p-4">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between border-b border-line py-4 last:border-b-0">
                <SkeletonBlock className="h-4 w-32" />
                <SkeletonBlock className="h-4 w-24" />
              </div>
            ))}
          </div>
          <div className="rounded-[1.25rem] border border-line bg-white p-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between border-b border-line py-4 last:border-b-0">
                <SkeletonBlock className="h-4 w-36" />
                <SkeletonBlock className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </SectionCardSkeleton>
      <SectionCardSkeleton actionWidth="w-44">
        <TableSkeleton columns={7} rows={5} search />
      </SectionCardSkeleton>
    </div>
  );
}
