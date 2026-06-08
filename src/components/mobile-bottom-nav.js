"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getVisibleNavItems, isStaffAreaPath } from "@/components/nav-items";

function isActivePath(pathname, href) {
  if (href === "/owner") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function getMobileNavItems(pathname) {
  const homeItem = {
    href: "/",
    label: "Home",
    icon: (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
      </svg>
    ),
  };

  if (isStaffAreaPath(pathname)) {
    return [
      homeItem,
      ...getVisibleNavItems(pathname),
    ];
  }

  const itemMap = new Map(
    getVisibleNavItems(pathname).map((item) => [item.href, item]),
  );

  return [
    homeItem,
    itemMap.get("/owner"),
    itemMap.get("/settings"),
    itemMap.get("/owner/completed"),
    itemMap.get("/reports/daily"),
  ].filter(Boolean);
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const items = getMobileNavItems(pathname);

  return (
    <nav className="print-hidden fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/96 shadow-[0_-10px_24px_rgba(31,41,55,0.08)] backdrop-blur-xl lg:hidden">
      <div className="relative mx-auto max-w-7xl">
        <div className="flex gap-2 overflow-x-auto px-2 py-2 pr-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-w-[88px] shrink-0 flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-center text-[11px] font-semibold ${
                  active
                    ? "bg-surface text-foreground"
                    : "text-foreground/62 hover:text-foreground"
                }`}
              >
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ${
                    active ? "bg-white text-accent" : "bg-surface-muted text-foreground/72"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="line-clamp-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
