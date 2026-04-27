import { formatDuration, getRiskLevel, getAverageOvertime } from '../utils/timeUtils';

const RISK_CONFIG = {
  high:   { label: 'High Risk',   color: 'bg-red-500',    text: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200' },
  medium: { label: 'Medium Risk', color: 'bg-yellow-400', text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  low:    { label: 'Low Risk',    color: 'bg-blue-400',   text: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200' },
  none:   { label: 'On Track',    color: 'bg-green-500',  text: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200' },
};

export default function RiskDashboard({ history, tasks }) {
  if (history.length === 0)
    return <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-3">📊</p><p>Complete tasks to see risk analysis</p></div>;

  const overtimeCount = history.filter(r => r.overtime).length;
  const overtimeRate = Math.round((overtimeCount / history.length) * 100);

  const taskStats = tasks.map(task => {
    const records = history.filter(r => r.taskId === task.id);
    if (!records.length) return null;
    return { task, records, risk: getRiskLevel(records), avgOvertime: getAverageOvertime(records),
      overtimeRatio: Math.round((records.filter(r => r.overtime).length / records.length) * 100) };
  }).filter(Boolean).sort((a, b) => ({ high:0, medium:1, low:2, none:3 }[a.risk] - { high:0, medium:1, low:2, none:3 }[b.risk]));

  const opMap = {};
  history.forEach(r => {
    opMap[r.operatorName] ??= { name: r.operatorName, total: 0, overtime: 0 };
    opMap[r.operatorName].total++;
    if (r.overtime) opMap[r.operatorName].overtime++;
  });
  const operators = Object.values(opMap).sort((a, b) => b.overtime - a.overtime);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
          <p className="text-2xl font-bold text-gray-800">{history.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total Tasks</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
          <p className="text-2xl font-bold text-green-700">{history.length - overtimeCount}</p>
          <p className="text-xs text-green-600 mt-1">On Time</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 text-center border border-red-100">
          <p className="text-2xl font-bold text-red-600">{overtimeCount}</p>
          <p className="text-xs text-red-500 mt-1">Overtime ({overtimeRate}%)</p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Task Risk Analysis</h3>
        <div className="space-y-2">
          {taskStats.map(({ task, records, risk, avgOvertime, overtimeRatio }) => {
            const cfg = RISK_CONFIG[risk];
            return (
              <div key={task.id} className={`${cfg.bg} border ${cfg.border} rounded-xl p-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${cfg.color}`}></span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{task.name}</p>
                    <p className="text-xs text-gray-500">{records.length} runs · {overtimeRatio}% overtime</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold ${cfg.text}`}>{cfg.label}</span>
                  {avgOvertime > 0 && <p className="text-xs text-gray-400 mt-0.5">avg +{formatDuration(avgOvertime)} over</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Operator Performance</h3>
        <div className="space-y-2">
          {operators.map(op => {
            const ratio = Math.round((op.overtime / op.total) * 100);
            return (
              <div key={op.name} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{op.name}</p>
                  <p className="text-xs text-gray-400">{op.total} tasks completed</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${ratio >= 60 ? 'bg-red-500' : ratio >= 30 ? 'bg-yellow-400' : 'bg-green-500'}`}
                      style={{ width: `${ratio}%` }} />
                  </div>
                  <span className={`text-xs font-bold w-10 text-right ${ratio >= 60 ? 'text-red-600' : ratio >= 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {ratio}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
