import {
  PageIntroSkeleton,
  SectionCardSkeleton,
  TableSkeleton,
} from "@/components/page-skeletons";

export default function Loading() {
  return (
    <div className="space-y-6">
      <PageIntroSkeleton />
      <SectionCardSkeleton actionWidth="w-full sm:w-72">
        <TableSkeleton columns={8} rows={5} search actions />
      </SectionCardSkeleton>
    </div>
  );
}
