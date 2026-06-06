import {
  PageIntroSkeleton,
  SectionCardSkeleton,
  TableSkeleton,
} from "@/components/page-skeletons";

export default function Loading() {
  return (
    <div className="space-y-6">
      <PageIntroSkeleton />
      <SectionCardSkeleton actionWidth="w-44">
        <TableSkeleton columns={4} rows={6} />
      </SectionCardSkeleton>
    </div>
  );
}
