const SUPABASE_URL = 'https://beokckyubdgkcfbmhzhu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_x4HHUz3kllRXofuFfde1jw_Elul9Saa';

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

async function supabaseFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

export function getTasks() {
  try { return JSON.parse(localStorage.getItem(TASKS_KEY)) ?? DEFAULT_TASKS; }
  catch { return DEFAULT_TASKS; }
}

export function saveTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export async function getHistory() {
  try {
    const data = await supabaseFetch('task_records?order=created_at.desc');
    return data.map(r => ({
      id: r.id,
      taskId: r.task_id,
      taskName: r.task_name,
      task: { estimatedMinutes: r.estimated_seconds / 60 },
      operatorName: r.operator_name,
      startTime: new Date(r.start_time).getTime(),
      endTime: new Date(r.end_time).getTime(),
      durationSeconds: r.duration_seconds,
      estimatedSeconds: r.estimated_seconds,
      overtime: r.overtime,
      overtimeSeconds: r.overtime_seconds,
      overtimeReason: r.overtime_reason,
      overtimeNotes: r.overtime_notes,
    }));
  } catch { return []; }
}

export async function saveHistoryRecord(r) {
  await supabaseFetch('task_records', {
    method: 'POST',
    body: JSON.stringify({
      task_id: r.taskId,
      task_name: r.taskName,
      task_category: r.task?.category,
      operator_name: r.operatorName,
      duration_seconds: r.durationSeconds,
      estimated_seconds: r.estimatedSeconds,
      overtime: r.overtime,
      overtime_seconds: r.overtimeSeconds,
      overtime_reason: r.overtimeReason,
      overtime_notes: r.overtimeNotes,
      start_time: new Date(r.startTime).toISOString(),
      end_time: new Date(r.endTime).toISOString(),
    }),
  });
}

export async function clearHistory() {
  await supabaseFetch('task_records?id=neq.00000000-0000-0000-0000-000000000000', {
    method: 'DELETE',
  });
}
