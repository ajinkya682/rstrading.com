export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  }).format(new Date(dateStr));
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date(dateStr));
}
