import Spinner from '../ui/Spinner';

const DataTable = ({ columns, data, isLoading, emptyMessage = 'Aucune donnée.' }) => {

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">📭</p>
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
      <table className="w-full text-sm">

        {/* ─── Header ─── */}
        <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* ─── Body ─── */}
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {data.map((row, i) => (
            <tr
              key={row.id || i}
              className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default DataTable;