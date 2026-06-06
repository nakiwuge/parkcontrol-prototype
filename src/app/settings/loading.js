import {
  FormGridSkeleton,
  PageIntroSkeleton,
  SectionCardSkeleton,
} from "@/components/page-skeletons";

export default function Loading() {
  return (
    <div className="space-y-6">
      <PageIntroSkeleton />
      <SectionCardSkeleton surface="bg-white">
        <div className="mx-auto max-w-4xl rounded-[1.5rem] border border-line bg-white p-5 shadow-sm">
          <FormGridSkeleton fields={4} buttons={1} />
        </div>
      </SectionCardSkeleton>
    </div>
  );
}
