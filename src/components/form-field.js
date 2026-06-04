export function FormField({ label, hint, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-foreground/50">{hint}</span> : null}
    </label>
  );
}
