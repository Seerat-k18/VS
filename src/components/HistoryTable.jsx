import { useState } from 'react';
import { formatDuration, formatDateTime } from '../utils/timeUtils';

export default function HistoryTable({ history, onClear }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const filtered = history.filter(r => {
    const d = new Date(r.startTime);
    if (from && d < new Date(from)) return false;
    if (to && d > new Date(to + 'T23:59:59')) return false;
    return true;
  });

  function exportCSV() {
    const headers = ['Operator','Task','Category','Duration (s)','Estimated (s)','Overtime','Overtime Seconds','Reason','Notes','Start Time','End Time'];
    const rows = filtered.map(r => [
      r.operatorName,
      r.taskName,
      r.task?.category ?? '',
      r.durationSeconds,
      r.estimatedSeconds,
      r.overtime ? 'Yes' : 'No',
      r.overtimeSeconds,
      r.overtimeReason ?? '',
      r.overtimeNotes ?? '',
      formatDateTime(r.startTime),
      formatDateTime(r.endTime),
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'task-timer-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  if (history.length === 0)
    return <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-3">📋</p><p>No history yet</p></div>;

  return (
    <div>
      {/* Date filters + export */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs text-gray-500 mb-1">From</label>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">To</label>
          <input type="date" value={to} onChange={e => setTo(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button onClick={() => { setFrom(''); setTo(''); }}
          className="text-xs text-gray-400 hover:text-gray-600 py-2">Clear filters</button>
        <button onClick={exportCSV}
          className="ml-auto bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded-lg">
          Export CSV
        </button>
      </div>

      <div className="flex justify-between mb-4">
        <p className="text-sm text-gray-500">{filtered.length} of {history.length} records</p>
        <button onClick={() => window.confirm('Clear all history?') && onClear()} className="text-xs text-red-400 hover:text-red-600">Clear All</button>
      </div>

      <div className="space-y-3">
        {filtered.map(record => (
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
