import Link from "next/link";

export function PlateSearchForm({
  action,
  defaultValue = "",
  summary,
}) {
  const inputId = `plate-search-${String(action).replaceAll("/", "-")}`;

  return (
    <form action={action} className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex-1">
        <label htmlFor={inputId} className="sr-only">
          Search by number plate
        </label>
        <input
          id={inputId}
          type="search"
          name="plate"
          defaultValue={defaultValue}
          placeholder="Search by number plate"
          className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent"
        />
      </div>
      <button
        type="submit"
        className="rounded-2xl bg-foreground px-4 py-3 text-sm font-semibold text-white hover:bg-foreground/90"
      >
        Search
      </button>
      {defaultValue ? (
        <Link
          href={action}
          className="inline-flex items-center justify-center rounded-2xl border border-line bg-surface-muted px-4 py-3 text-sm font-semibold text-foreground hover:text-accent"
        >
          Clear
        </Link>
      ) : null}
      {summary ? (
        <p className="text-sm text-foreground/58 sm:ml-2">{summary}</p>
      ) : null}
    </form>
  );
}
