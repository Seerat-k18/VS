export function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`;
  return `${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`;
}
export function formatDateTime(ts) { return new Date(ts).toLocaleString(); }
export function getRiskLevel(records) {
  const ratio = records.filter(r => r.overtime).length / records.length;
  if (ratio >= 0.6) return 'high';
  if (ratio >= 0.3) return 'medium';
  if (ratio > 0)    return 'low';
  return 'none';
}
export function getAverageOvertime(records) {
  const over = records.filter(r => r.overtime && r.overtimeSeconds > 0);
  if (!over.length) return 0;
  return Math.round(over.reduce((s, r) => s + r.overtimeSeconds, 0) / over.length);
}
