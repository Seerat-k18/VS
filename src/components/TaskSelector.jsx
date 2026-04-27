import { useState } from 'react';

const CATEGORY_COLORS = {
  Safety: 'bg-red-100 text-red-700',
  Operations: 'bg-blue-100 text-blue-700',
  Maintenance: 'bg-orange-100 text-orange-700',
  Admin: 'bg-purple-100 text-purple-700',
};

export default function TaskSelector({ tasks, onSelect }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [operatorName, setOperatorName] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  const categories = ['All', ...new Set(tasks.map(t => t.category))];
  const filtered = tasks.filter(t =>
    (t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase())) &&
    (selectedCategory === 'All' || t.category === selectedCategory)
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Operator Name *</label>
        <input type="text" value={operatorName} onChange={e => setOperatorName(e.target.value)}
          placeholder="Enter your name before starting a task"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search tasks..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>{cat}</button>
          ))}
        </div>
      </div>
      <div className="space-y-2 mb-6">
        {filtered.map(task => (
          <button key={task.id} onClick={() => setSelectedTask(task)}
            className={`w-full text-left bg-white rounded-xl border-2 p-4 transition-all hover:shadow-md ${
              selectedTask?.id === task.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100'
            }`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-800 text-sm">{task.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[task.category] || 'bg-gray-100 text-gray-600'}`}>
                    {task.category}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{task.description}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-gray-700">{task.estimatedMinutes}m</p>
                <p className="text-xs text-gray-400">estimated</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      <button onClick={() => selectedTask && operatorName.trim() && onSelect(selectedTask, operatorName.trim())}
        disabled={!selectedTask || !operatorName.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors">
        {!operatorName.trim() ? 'Enter your name to continue' : !selectedTask ? 'Select a task to continue' : `Start Timer — ${selectedTask.name}`}
      </button>
    </div>
  );
}
