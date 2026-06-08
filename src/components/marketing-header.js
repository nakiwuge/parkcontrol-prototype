import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { LandingNav } from "@/components/landing-nav";
import { APP_NAME } from "@/lib/constants";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[#f6f7f3]/96 shadow-[0_8px_24px_rgba(31,41,55,0.06)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <BrandLogo />
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold tracking-tight text-foreground">
              {APP_NAME}
            </p>
            <p className="hidden text-sm text-foreground/56 sm:block">
              Parking records and payment tracking
            </p>
          </div>
        </Link>

        <LandingNav />

        <div className="hidden items-center gap-3 sm:flex">
          <Link
            href="/staff"
            className="inline-flex items-center justify-center rounded-full border border-foreground bg-foreground px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#17202c]"
          >
            Staff Dashboard Demo
          </Link>
          <Link
            href="/owner"
            className="inline-flex items-center justify-center rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-foreground hover:border-accent hover:text-accent"
          >
            Admin Dashboard Demo
          </Link>
          <Link
            href="/waitlist"
            className="inline-flex items-center justify-center rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold text-foreground hover:border-accent hover:text-accent"
          >
            Join Waitlist
          </Link>
        </div>
      </div>
    </header>
  );
}
