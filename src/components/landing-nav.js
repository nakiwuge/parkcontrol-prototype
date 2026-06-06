"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function LandingNav() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

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

  return (
    <div ref={rootRef} className="relative sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label="Open navigation menu"
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-white text-foreground shadow-sm hover:border-accent hover:text-accent"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </svg>
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-52 rounded-[1.4rem] border border-line bg-white p-3 shadow-[0_18px_45px_rgba(31,41,55,0.12)]">
          <div className="flex flex-col gap-2">
            <Link
              href="/staff"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center rounded-2xl bg-foreground px-4 py-3 text-sm font-semibold text-white hover:bg-[#17202c]"
            >
              Try It Out
            </Link>
            <Link
              href="/waitlist"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold text-foreground hover:border-accent hover:text-accent"
            >
              Join Waitlist
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
