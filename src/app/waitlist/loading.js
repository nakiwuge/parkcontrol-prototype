import {
  FormGridSkeleton,
  PageIntroSkeleton,
  SectionCardSkeleton,
} from "@/components/page-skeletons";

export default function Loading() {
  return (
    <div className="space-y-6">
      <PageIntroSkeleton compact />
      <SectionCardSkeleton surface="bg-white">
        <FormGridSkeleton fields={7} buttons={1} />
      </SectionCardSkeleton>
    </div>
  );
}
