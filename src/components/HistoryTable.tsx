interface HistoryRecord {
  id: string;
  city_name: string;
  country: string;
  temperature: number;
  humidity: number;
  created_at: string;
}

interface HistoryTableProps {
  history: HistoryRecord[];
}

export function HistoryTable({ history }: HistoryTableProps) {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Recent Searches</h3>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-50 to-cyan-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  City
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Temperature
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Humidity
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Date & Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.map((record, index) => (
                <tr
                  key={record.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-800">
                      {record.city_name}
                    </span>
                    {record.country && (
                      <span className="text-gray-500 ml-2">({record.country})</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {record.temperature.toFixed(1)}°C
                  </td>
                  <td className="px-6 py-4 text-gray-700">{record.humidity}%</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {new Date(record.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
