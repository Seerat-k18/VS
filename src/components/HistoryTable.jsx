import { formatDuration, formatDateTime } from '../utils/timeUtils';

export default function HistoryTable({ history, onClear }) {
  if (history.length === 0)
    return <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-3">📋</p><p>No history yet</p></div>;
  return (
    <div>
      <div className="flex justify-between mb-4">
        <p className="text-sm text-gray-500">{history.length} records</p>
        <button onClick={() => window.confirm('Clear all history?') && onClear()} className="text-xs text-red-400 hover:text-red-600">Clear All</button>
      </div>
      <div className="space-y-3">
        {history.map(record => (
          <div key={record.id} className={`bg-white rounded-xl border-l-4 p-4 shadow-sm ${record.overtime ? 'border-red-400' : 'border-green-400'}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-gray-800 text-sm">{record.taskName}</p>
                  {record.overtime
                    ? <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">⚠ Overtime</span>
                    : <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">✓ On Time</span>}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{record.operatorName} · {formatDateTime(record.startTime)}</p>
                {record.overtime && record.overtimeReason && (
                  <div className="mt-2 bg-red-50 rounded-lg p-2.5">
                    <p className="text-xs font-medium text-red-700">Reason: {record.overtimeReason}</p>
                    {record.overtimeNotes && <p className="text-xs text-red-500 mt-0.5">{record.overtimeNotes}</p>}
                  </div>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-gray-700">{formatDuration(record.durationSeconds)}</p>
                <p className="text-xs text-gray-400">est. {record.task?.estimatedMinutes}m</p>
                {record.overtime && <p className="text-xs text-red-500">+{formatDuration(record.overtimeSeconds)}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
