import { useState } from 'react';
import TaskSelector from './components/TaskSelector';
import TimerDisplay from './components/TimerDisplay';
import OvertimeModal from './components/OvertimeModal';
import HistoryTable from './components/HistoryTable';
import RiskDashboard from './components/RiskDashboard';
import TaskManager from './components/TaskManager';
import { getTasks, saveTasks, getHistory, saveHistoryRecord, clearHistory } from './utils/storage';

const TABS = ['Timer', 'History', 'Risk', 'Manage Tasks'];

export default function App() {
  const [tab, setTab] = useState('Timer');
  const [tasks, setTasks] = useState(getTasks);
  const [history, setHistory] = useState(getHistory);

  const [phase, setPhase] = useState('select');
  const [activeTask, setActiveTask] = useState(null);
  const [operatorName, setOperatorName] = useState('');
  const [pendingRecord, setPendingRecord] = useState(null);

  function handleTaskSelect(task, name) {
    setActiveTask(task);
    setOperatorName(name);
    setPhase('timing');
  }

  function handleTimerComplete(elapsed, overtime, overtimeSeconds) {
    const record = {
      id: Date.now().toString(),
      taskId: activeTask.id,
      taskName: activeTask.name,
      task: activeTask,
      operatorName,
      startTime: Date.now() - elapsed * 1000,
      endTime: Date.now(),
      durationSeconds: elapsed,
      estimatedSeconds: activeTask.estimatedMinutes * 60,
      overtime,
      overtimeSeconds,
      overtimeReason: null,
      overtimeNotes: null,
    };

    if (overtime) {
      setPendingRecord(record);
      setPhase('overtime');
    } else {
      finalizeRecord(record);
    }
  }

  function handleOvertimeSubmit(reason, notes) {
    finalizeRecord({ ...pendingRecord, overtimeReason: reason, overtimeNotes: notes });
  }

  function finalizeRecord(record) {
    saveHistoryRecord(record);
    setHistory(getHistory());
    setPhase('select');
    setActiveTask(null);
    setPendingRecord(null);
  }

  function handleCancel() {
    setPhase('select');
    setActiveTask(null);
    setPendingRecord(null);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Task Timer</h1>
            <p className="text-xs text-gray-400">Accountability & Performance Tracker</p>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4">
          <nav className="flex gap-1">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}>
                {t}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {tab === 'Timer' && phase === 'select' && <TaskSelector tasks={tasks} onSelect={handleTaskSelect} />}
        {tab === 'Timer' && phase === 'timing' && activeTask && (
          <TimerDisplay task={activeTask} operatorName={operatorName} onComplete={handleTimerComplete} onCancel={handleCancel} />
        )}
        {tab === 'History' && <HistoryTable history={history} onClear={() => { clearHistory(); setHistory([]); }} />}
        {tab === 'Risk' && <RiskDashboard history={history} tasks={tasks} />}
        {tab === 'Manage Tasks' && <TaskManager tasks={tasks} onSave={(u) => { saveTasks(u); setTasks(u); }} />}
      </main>

      {phase === 'overtime' && pendingRecord && (
        <OvertimeModal
          task={activeTask}
          elapsedSeconds={pendingRecord.durationSeconds}
          overtimeSeconds={pendingRecord.overtimeSeconds}
          onSubmit={handleOvertimeSubmit}
        />
      )}
    </div>
  );
}
