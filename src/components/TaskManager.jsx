import { useState } from 'react';

const CATEGORIES = ['Safety', 'Operations', 'Maintenance', 'Admin'];

export default function TaskManager({ tasks, onSave }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'Operations', estimatedMinutes: 15, description: '' });
  const [showForm, setShowForm] = useState(false);

  function openNew() {
    setEditing(null);
    setForm({ name: '', category: 'Operations', estimatedMinutes: 15, description: '' });
    setShowForm(true);
  }

  function openEdit(task) {
    setEditing(task.id);
    setForm({ name: task.name, category: task.category, estimatedMinutes: task.estimatedMinutes, description: task.description });
    setShowForm(true);
  }

  function handleSave() {
    if (!form.name.trim()) return;
    const updated = editing
      ? tasks.map(t => t.id === editing ? { ...t, ...form, estimatedMinutes: Number(form.estimatedMinutes) } : t)
      : [...tasks, { id: Date.now().toString(), ...form, estimatedMinutes: Number(form.estimatedMinutes) }];
    onSave(updated);
    setShowForm(false);
  }

  function handleDelete(id) {
    if (window.confirm('Delete this task?')) onSave(tasks.filter(t => t.id !== id));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{tasks.length} tasks configured</p>
        <button onClick={openNew}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
          + Add Task
        </button>
      </div>

      {showForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <h3 className="text-sm font-bold text-blue-800 mb-3">{editing ? 'Edit Task' : 'New Task'}</h3>
          <div className="space-y-3">
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Task name *"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Description"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <div className="flex gap-3">
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <div className="flex items-center gap-2">
                <input type="number" min="1" max="480" value={form.estimatedMinutes}
                  onChange={e => setForm(f => ({ ...f, estimatedMinutes: e.target.value }))}
                  className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <span className="text-sm text-gray-500">min</span>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={handleSave}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition-colors">
                Save
              </button>
              <button onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold py-2 rounded-lg transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {tasks.map(task => (
          <div key={task.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">{task.name}</p>
              <p className="text-xs text-gray-400">{task.category} · {task.estimatedMinutes} min</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(task)} className="text-xs text-blue-500 hover:text-blue-700 font-medium">Edit</button>
              <button onClick={() => handleDelete(task.id)} className="text-xs text-red-400 hover:text-red-600 font-medium">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
