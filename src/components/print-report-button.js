"use client";

export function PrintReportButton({ className = "" }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`rounded-2xl bg-foreground px-4 py-2.5 text-sm font-semibold text-white hover:bg-foreground/90 ${className}`}
    >
      Print Report
    </button>
  );
}
