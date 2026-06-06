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
      <MetricGridSkeleton count={6} />
      <SectionCardSkeleton actionWidth="w-64">
        <TableSkeleton columns={7} rows={5} search actions />
      </SectionCardSkeleton>
      <SectionCardSkeleton actionWidth="w-56" surface="bg-white">
        <TableSkeleton columns={8} rows={5} search actions />
      </SectionCardSkeleton>
    </div>
  );
}
