export function FlashMessage({ message, error }) {
  if (!message && !error) {
    return null;
  }

  const isError = Boolean(error);

  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm ${
        isError
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-700"
      }`}
    >
      {error || message}
    </div>
  );
}
