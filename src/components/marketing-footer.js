import { APP_NAME } from "@/lib/constants";

export function MarketingFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-foreground/58 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p className="font-medium text-foreground">{APP_NAME}</p>
        <p>Parking records and payment tracking</p>
        <p>A Rompact product</p>
      </div>
    </footer>
  );
}
