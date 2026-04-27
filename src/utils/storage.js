const HISTORY_KEY = 'task_timer_history';
const TASKS_KEY = 'task_timer_tasks';
const DEFAULT_TASKS = [
  { id: '1', name: 'Pre-flight Inspection',      category: 'Safety',      estimatedMinutes: 30, description: 'Full aircraft pre-flight walkthrough' },
  { id: '2', name: 'Fuel Loading',               category: 'Operations',  estimatedMinutes: 20, description: 'Load and verify fuel quantity' },
  { id: '3', name: 'Safety Briefing',            category: 'Safety',      estimatedMinutes: 15, description: 'Crew safety briefing and sign-off' },
  { id: '4', name: 'Maintenance Inspection',     category: 'Maintenance', estimatedMinutes: 60, description: 'Scheduled maintenance check' },
  { id: '5', name: 'Documentation Review',       category: 'Admin',       estimatedMinutes: 45, description: 'Review and sign technical logs' },
  { id: '6', name: 'Equipment Check',            category: 'Safety',      estimatedMinutes: 25, description: 'Verify all equipment operational' },
  { id: '7', name: 'Ground Crew Coordination',   category: 'Operations',  estimatedMinutes: 10, description: 'Brief ground crew for turnaround' },
  { id: '8', name: 'Cargo Loading',              category: 'Operations',  estimatedMinutes: 40, description: 'Supervise cargo loading and weight check' },
  { id: '9', name: 'Navigation Log Preparation', category: 'Admin',       estimatedMinutes: 20, description: 'Prepare flight plan and nav log' },
  { id: '10', name: 'Post-flight Report',        category: 'Admin',       estimatedMinutes: 15, description: 'Complete post-flight paperwork' },
];
export function getTasks() {
  try { return JSON.parse(localStorage.getItem(TASKS_KEY)) ?? DEFAULT_TASKS; }
  catch { return DEFAULT_TASKS; }
}
export function saveTasks(tasks)      { localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)); }
export function getHistory()          { try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) ?? []; } catch { return []; } }
export function saveHistoryRecord(r)  { const h = getHistory(); h.unshift(r); localStorage.setItem(HISTORY_KEY, JSON.stringify(h)); }
export function clearHistory()        { localStorage.removeItem(HISTORY_KEY); }
