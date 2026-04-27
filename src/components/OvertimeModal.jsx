import { useState } from 'react';
import { formatDuration } from '../utils/timeUtils';

const REASONS = [
  'Equipment malfunction or fault',
  'Waiting for parts / supplies',
  'Additional personnel required',
  'Safety concern identified — investigation required',
  'Unexpected complexity discovered',
  'Communication / coordination delay',
  'Weather or environmental conditions',
  'Documentation errors requiring correction',
  'Other (see notes below)',
];

export default function OvertimeModal({ task, elapsedSeconds, overtimeSeconds, onSubmit }) {
  const [selectedReason, setSelectedReason] = useState('');
  const [notes, setNotes] = useState('');
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="bg-red-600 rounded-t-2xl p-5 flex items-center gap-3">
          <span className="text-3xl">⚠️</span>
          <div>
            <h2 className="text-white text-xl font-bold">Task Overtime Alert</h2>
            <p className="text-red-100 text-sm">{task.name}</p>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Total Time</p>
              <p className="text-lg font-bold text-gray-800">{formatDuration(elapsedSeconds)}</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <p className="text-xs text-red-500 mb-1">Overtime By</p>
              <p className="text-lg font-bold text-red-600">+{formatDuration(overtimeSeconds)}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            This task exceeded its estimated time of <strong>{task.estimatedMinutes} minutes</strong>.
            A reason is required to complete this record.
          </p>
          <form onSubmit={e => { e.preventDefault(); if (selectedReason) onSubmit(selectedReason, notes); }}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Reason *</label>
            <div className="space-y-2 mb-4 max-h-52 overflow-y-auto">
              {REASONS.map(reason => (
                <label key={reason} className="flex items-start gap-3 cursor-pointer">
                  <input type="radio" name="reason" value={reason}
                    checked={selectedReason === reason} onChange={() => setSelectedReason(reason)}
                    className="mt-0.5 accent-red-600" />
                  <span className={`text-sm ${selectedReason === reason ? 'text-red-700 font-medium' : 'text-gray-600'}`}>{reason}</span>
                </label>
              ))}
            </div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              placeholder="Provide any additional details..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
            <button type="submit" disabled={!selectedReason}
              className="mt-4 w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors">
              Submit & Complete Task
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
