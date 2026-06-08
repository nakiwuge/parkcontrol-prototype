"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getVisibleNavItems } from "@/components/nav-items";

function isActivePath(pathname, href) {
  if (href === "/owner") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function isParentActive(pathname, item) {
  if (item.href && isActivePath(pathname, item.href)) {
    return true;
  }

  if (item.children?.length) {
    return item.children.some((child) => isActivePath(pathname, child.href));
  }

  return false;
}

export function DashboardNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});
  const rootRef = useRef(null);
  const visibleNavItems = getVisibleNavItems(pathname);

  useEffect(() => {
    setExpandedGroups((current) => ({
      ...current,
      ...Object.fromEntries(
        visibleNavItems
          .filter((item) => item.children?.length)
          .map((item) => [item.label, current[item.label] ?? isParentActive(pathname, item)]),
      ),
    }));
  }, [pathname, visibleNavItems]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function toggleGroup(label) {
    setExpandedGroups((current) => ({
      ...current,
      [label]: !current[label],
    }));
  }

  return (
    <>
      <div ref={rootRef} className="relative lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-label="Toggle navigation"
          className="inline-flex items-center gap-2 rounded-2xl border border-line bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm hover:border-accent/40 hover:text-accent"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h16" />
          </svg>
          {open ? "Close" : "Menu"}
        </button>

        <nav
          className={`${
            open ? "mt-3 flex" : "hidden"
          } absolute right-0 top-full z-50 max-h-[calc(100vh-7rem)] min-w-64 flex-col gap-2 overflow-y-auto rounded-[1.5rem] border border-line bg-white p-3 shadow-[0_18px_45px_rgba(31,41,55,0.12)]`}
        >
          {visibleNavItems.map((item) => {
            const active = isParentActive(pathname, item);

            return (
              <div key={item.label} className="space-y-2">
                {item.href ? (
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${
                      active
                        ? "bg-foreground text-white shadow-sm"
                        : "text-foreground/72 hover:bg-surface-muted hover:text-foreground"
                    }`}
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-current/12 bg-current/5">
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleGroup(item.label)}
                    aria-expanded={Boolean(expandedGroups[item.label])}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${
                      active
                        ? "bg-foreground text-white shadow-sm"
                        : "text-foreground/72"
                    }`}
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-current/12 bg-current/5">
                      {item.icon}
                    </span>
                    <span className="flex-1 text-left">{item.label}</span>
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className={`h-4 w-4 transition-transform ${
                        expandedGroups[item.label] ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                )}

                {item.children?.length && expandedGroups[item.label] ? (
                  <div className="ml-5 flex flex-col gap-1 border-l border-line/70 pl-4">
                    {item.children.map((child) => {
                      const childActive = isActivePath(pathname, child.href);

                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className={`rounded-xl px-3 py-2 text-sm font-medium ${
                            childActive
                              ? "bg-surface-muted text-foreground"
                              : "text-foreground/64 hover:bg-surface-muted hover:text-foreground"
                          }`}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
      </div>

      <nav className="hidden lg:flex lg:flex-col lg:gap-2">
        {visibleNavItems.map((item) => {
          const active = isParentActive(pathname, item);

          return (
            <div key={item.label} className="space-y-2">
              {item.href ? (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-white text-foreground shadow-sm"
                      : "text-white/74 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <span
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${
                      active
                        ? "bg-surface-muted text-foreground"
                        : "bg-white/10 text-white/78"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
                ) : (
                <button
                  type="button"
                  onClick={() => toggleGroup(item.label)}
                  aria-expanded={Boolean(expandedGroups[item.label])}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${
                    active ? "bg-white text-foreground shadow-sm" : "text-white/74"
                  }`}
                >
                  <span
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${
                      active
                        ? "bg-surface-muted text-foreground"
                        : "bg-white/10 text-white/78"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1 text-left">{item.label}</span>
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className={`h-4 w-4 transition-transform ${
                      expandedGroups[item.label] ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              )}

              {item.children?.length && expandedGroups[item.label] ? (
                <div className="ml-7 flex flex-col gap-1 border-l border-white/12 pl-4">
                  {item.children.map((child) => {
                    const childActive = isActivePath(pathname, child.href);

                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                          childActive
                            ? "bg-white text-foreground shadow-sm"
                            : "text-white/62 hover:bg-white/8 hover:text-white"
                        }`}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
    </>
  );
}
