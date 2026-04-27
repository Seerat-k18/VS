import { useEffect, useRef, useState } from 'react';
import { formatDuration } from '../utils/timeUtils';

export default function TimerDisplay({ task, operatorName, onComplete, onCancel }) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [overtime, setOvertime] = useState(false);
  const [showOvertimeAlert, setShowOvertimeAlert] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedAtRef = useRef(0);

  const estimatedSeconds = task.estimatedMinutes * 60;
  const progress = Math.min((elapsed / estimatedSeconds) * 100, 100);
  const overtimeSeconds = Math.max(0, elapsed - estimatedSeconds);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        const newElapsed = pausedAtRef.current + Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsed(newElapsed);
        if (newElapsed >= estimatedSeconds && !overtime) {
          setOvertime(true);
          setShowOvertimeAlert(true);
        }
      }, 500);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, overtime, estimatedSeconds]);

  const ringColor = overtime ? 'text-red-500' : elapsed / estimatedSeconds > 0.8 ? 'text-yellow-500' : 'text-green-500';
  const stroke = overtime ? '#ef4444' : elapsed / estimatedSeconds > 0.8 ? '#eab308' : '#22c55e';

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md mx-auto">
      <h3 className="text-lg font-bold text-gray-800">{task.name}</h3>
      <p className="text-sm text-gray-500">{task.category} · Estimated: {task.estimatedMinutes} min</p>
      <p className="text-sm text-gray-400 mt-0.5">Operator: {operatorName}</p>

      {showOvertimeAlert && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mt-4 flex items-center gap-2">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="text-red-700 font-semibold text-sm">Overtime — task has exceeded estimate</p>
            <p className="text-red-500 text-xs">A reason will be required when stopping</p>
          </div>
        </div>
      )}

      <div className="relative flex items-center justify-center my-6">
        <svg className="w-44 h-44 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="#f3f4f6" strokeWidth="10" />
          <circle cx="60" cy="60" r="52" fill="none" stroke={stroke} strokeWidth="10"
            strokeDasharray={`${2 * Math.PI * 52}`}
            strokeDashoffset={`${2 * Math.PI * 52 * (1 - Math.min(elapsed / estimatedSeconds, 1))}`}
            strokeLinecap="round" className="transition-all duration-500" />
        </svg>
        <div className="absolute text-center">
          <p className={`text-3xl font-mono font-bold ${ringColor}`}>{formatDuration(elapsed)}</p>
          {overtime && <p className="text-xs text-red-500 font-medium mt-1">+{formatDuration(overtimeSeconds)} over</p>}
        </div>
      </div>

      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-5">
        <div className={`h-full rounded-full transition-all duration-500 ${overtime ? 'bg-red-500' : elapsed / estimatedSeconds > 0.8 ? 'bg-yellow-500' : 'bg-green-500'}`}
          style={{ width: `${progress}%` }} />
      </div>

      <div className="flex gap-3">
        {!started ? (
          <button onClick={() => { startTimeRef.current = Date.now(); setRunning(true); setStarted(true); }}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors text-lg">
            ▶ Start
          </button>
        ) : running ? (
          <>
            <button onClick={() => { pausedAtRef.current = elapsed; setRunning(false); }}
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 rounded-xl">⏸ Pause</button>
            <button onClick={() => { clearInterval(intervalRef.current); setRunning(false); onComplete(elapsed, overtime, overtimeSeconds); }}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl">■ Stop</button>
          </>
        ) : (
          <>
            <button onClick={() => { startTimeRef.current = Date.now(); setRunning(true); }}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl">▶ Resume</button>
            <button onClick={() => { clearInterval(intervalRef.current); setRunning(false); onComplete(elapsed, overtime, overtimeSeconds); }}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl">■ Stop</button>
          </>
        )}
      </div>
      <button onClick={onCancel} className="mt-3 w-full text-gray-400 hover:text-gray-600 text-sm py-2">Cancel</button>
    </div>
  );
}
