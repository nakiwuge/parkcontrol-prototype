import {
  FormGridSkeleton,
  PageIntroSkeleton,
  SectionCardSkeleton,
} from "@/components/page-skeletons";

export default function Loading() {
  return (
    <div className="space-y-6">
      <PageIntroSkeleton />
      <SectionCardSkeleton actionWidth="w-40">
        <FormGridSkeleton fields={5} buttons={2} />
      </SectionCardSkeleton>
    </div>
  );
}
