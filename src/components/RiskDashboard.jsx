import { useState } from 'react';
import { formatDuration, getRiskLevel, getAverageOvertime } from '../utils/timeUtils';

const RISK_CONFIG = {
  high:   { label: 'High Risk',   color: 'bg-red-500',    text: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200' },
  medium: { label: 'Medium Risk', color: 'bg-yellow-400', text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  low:    { label: 'Low Risk',    color: 'bg-blue-400',   text: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200' },
  none:   { label: 'On Track',    color: 'bg-green-500',  text: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200' },
};

const CATEGORY_COLORS = {
  Safety:      { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200' },
  Operations:  { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200' },
  Maintenance: { bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-200' },
  Admin:       { bg: 'bg-purple-50',  text: 'text-purple-700',  border: 'border-purple-200' },
};

const TABS = ['Overview', 'By Task', 'By Category', 'By Operator'];

export default function RiskDashboard({ history, tasks }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  if (history.length === 0)
    return <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-3">📊</p><p>Complete tasks to see risk analysis</p></div>;

  const filtered = history.filter(r => {
    const d = new Date(r.startTime);
    if (from && d < new Date(from)) return false;
    if (to && d > new Date(to + 'T23:59:59')) return false;
    return true;
  });

  const overtimeCount = filtered.filter(r => r.overtime).length;
  const overtimeRate = filtered.length ? Math.round((overtimeCount / filtered.length) * 100) : 0;
  const avgDuration = filtered.length ? Math.round(filtered.reduce((s, r) => s + r.durationSeconds, 0) / filtered.length) : 0;

  // Per-task risk
  const taskStats = tasks.map(task => {
    const records = filtered.filter(r => r.taskName === task.name);
    if (!records.length) return null;
    return {
      task, records,
      risk: getRiskLevel(records),
      avgOvertime: getAverageOvertime(records),
      overtimeRatio: Math.round((records.filter(r => r.overtime).length / records.length) * 100),
    };
  }).filter(Boolean).sort((a, b) => ({ high:0, medium:1, low:2, none:3 }[a.risk] - { high:0, medium:1, low:2, none:3 }[b.risk]));

  // Per-category
  const categories = [...new Set(filtered.map(r => r.task?.category).filter(Boolean))];
  const categoryStats = categories.map(cat => {
    const records = filtered.filter(r => r.task?.category === cat);
    const overtimeRatio = Math.round((records.filter(r => r.overtime).length / records.length) * 100);
    return { cat, records, overtimeRatio, risk: getRiskLevel(records), avgOvertime: getAverageOvertime(records) };
  }).sort((a, b) => b.overtimeRatio - a.overtimeRatio);

  // Per-operator
  const opMap = {};
  filtered.forEach(r => {
    opMap[r.operatorName] ??= { name: r.operatorName, total: 0, overtime: 0 };
    opMap[r.operatorName].total++;
    if (r.overtime) opMap[r.operatorName].overtime++;
  });
  const operators = Object.values(opMap).sort((a, b) => b.overtime - a.overtime);

  return (
    <div className="space-y-4">

      {/* Date filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap gap-3 items-end">
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
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
              activeTab === t ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>{t}</button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'Overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
              <p className="text-2xl font-bold text-gray-800">{filtered.length}</p>
              <p className="text-xs text-gray-500 mt-1">Total Tasks</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
              <p className="text-2xl font-bold text-green-700">{filtered.length - overtimeCount}</p>
              <p className="text-xs text-green-600 mt-1">On Time</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center border border-red-100">
              <p className="text-2xl font-bold text-red-600">{overtimeCount}</p>
              <p className="text-xs text-red-500 mt-1">Overtime ({overtimeRate}%)</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
              <p className="text-2xl font-bold text-gray-800">{formatDuration(avgDuration)}</p>
              <p className="text-xs text-gray-500 mt-1">Avg Task Duration</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
              <p className="text-2xl font-bold text-gray-800">{categories.length}</p>
              <p className="text-xs text-gray-500 mt-1">Categories Active</p>
            </div>
          </div>
        </div>
      )}

      {/* By Task */}
      {activeTab === 'By Task' && (
        <div className="space-y-2">
          {taskStats.length === 0 && <p className="text-center text-gray-400 py-8">No data for selected period</p>}
          {taskStats.map(({ task, records, risk, avgOvertime, overtimeRat
