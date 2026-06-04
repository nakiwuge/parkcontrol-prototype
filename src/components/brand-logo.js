export function BrandLogo({ inverted = false }) {
  const shellClasses = inverted
    ? "border-white/10 bg-white/8 text-white"
    : "border-line bg-surface-muted text-foreground shadow-sm";
  const markClasses = inverted
    ? "bg-white/12 text-white"
    : "bg-white text-foreground";
  const accentClasses = inverted ? "bg-accent/90" : "bg-accent";

  return (
    <span
      className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border ${shellClasses}`}
      aria-hidden="true"
    >
      <span className={`relative inline-flex h-8 w-8 items-center justify-center rounded-xl ${markClasses}`}>
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 18V6h5a3 3 0 0 1 0 6H7" />
          <path d="M15 6h2" />
          <path d="M15 10h2" />
          <path d="M15 14h2" />
          <path d="M15 18h2" />
        </svg>
        <span className={`absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full ${accentClasses}`} />
      </span>
    </span>
  );
}
