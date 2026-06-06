"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAME } from "@/lib/constants";
import { BrandLogo } from "@/components/brand-logo";
import { DashboardNav } from "@/components/dashboard-nav";

export function AppShell({ children }) {
  const pathname = usePathname();

  if (pathname === "/") {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="print-hidden hidden border-r border-white/10 bg-foreground lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:self-start">
        <div className="flex items-center gap-3 px-6 py-7">
          <BrandLogo inverted />
          <div className="min-w-0">
            <Link
              href="/"
              className="block truncate text-lg font-semibold tracking-tight text-white"
            >
              {APP_NAME}
            </Link>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
          <DashboardNav />
        </div>

        <div className="mt-auto border-t border-white/10 px-6 py-6">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/46">
              Live Prototype
            </p>
            <p className="mt-3 text-sm leading-6 text-white/72">
              Staff, owner, reporting, and pricing flows are all available from this shell.
            </p>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="print-hidden sticky top-0 z-40 border-b border-line bg-white/96 shadow-[0_8px_24px_rgba(31,41,55,0.06)] backdrop-blur-xl lg:hidden">
          <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <Link
                  href="/"
                  className="flex items-center gap-3 text-lg font-semibold tracking-tight text-foreground sm:text-xl"
                >
                  <BrandLogo />
                  {APP_NAME}
                </Link>
              </div>
              <DashboardNav />
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
