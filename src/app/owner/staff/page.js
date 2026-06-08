import { FlashMessage } from "@/components/flash-message";
import { StaffOverviewContent } from "@/components/staff-overview-content";
import { getDashboardSnapshot } from "@/lib/data";

export default async function AdminStaffViewPage({ searchParams }) {
  const filters = await searchParams;
  const dashboard = await getDashboardSnapshot();

  return (
    <div className="space-y-6">
      <FlashMessage message={filters?.message} error={filters?.error} />
      <StaffOverviewContent
        dashboard={dashboard}
        plateQuery={filters?.plate}
        searchAction="/owner/staff"
        headingLabel="Staff View"
      />
    </div>
  );
}
