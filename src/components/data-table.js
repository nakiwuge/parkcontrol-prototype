export function DataTable({ columns, rowCount, emptyMessage, children }) {
  return (
    <div className="overflow-hidden rounded-[1.25rem] border border-line">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-line">
          <thead className="bg-surface-muted">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-foreground/50 sm:px-4"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-white">
            {rowCount ? (
              children
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-8 text-center text-sm text-foreground/55 sm:px-4"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
