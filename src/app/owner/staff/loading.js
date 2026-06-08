import {
  MetricGridSkeleton,
  PageIntroSkeleton,
  SectionCardSkeleton,
  TableSkeleton,
} from "@/components/page-skeletons";

export default function Loading() {
  return (
    <div className="space-y-6">
      <PageIntroSkeleton />
      <MetricGridSkeleton count={4} />
      <SectionCardSkeleton actionWidth="w-72">
        <TableSkeleton columns={8} rows={5} search actions />
      </SectionCardSkeleton>
    </div>
  );
}
