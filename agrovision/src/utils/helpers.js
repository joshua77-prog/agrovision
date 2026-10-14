// Utility to merge class names (similar to cn from shadcn)
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Format date
export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Format confidence as percentage
export function formatConfidence(value) {
  return `${parseFloat(value).toFixed(1)}%`;
}

// Get severity color
export function getSeverityColor(severity) {
  switch (severity?.toLowerCase()) {
    case 'high':
      return 'badge-red';
    case 'medium':
      return 'badge-yellow';
    case 'low':
      return 'badge-green';
    default:
      return 'badge-gray';
  }
}

// Get status badge class
export function getStatusBadge(status) {
  switch (status?.toLowerCase()) {
    case 'healthy':
      return 'badge-green';
    case 'diseased':
      return 'badge-red';
    case 'attention required':
      return 'badge-yellow';
    default:
      return 'badge-gray';
  }
}

// Get confidence color class
export function getConfidenceColor(confidence) {
  if (confidence >= 80) return 'bg-brand-500';
  if (confidence >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}

// Get weather icon name from condition
export function getWeatherIcon(condition) {
  const c = condition?.toLowerCase() || '';
  if (c.includes('sun') || c.includes('clear')) return 'sun';
  if (c.includes('cloud') && c.includes('rain')) return 'cloud-rain';
  if (c.includes('cloud')) return 'cloud';
  if (c.includes('rain')) return 'cloud-rain';
  if (c.includes('thunder')) return 'cloud-lightning';
  if (c.includes('fog') || c.includes('mist')) return 'wind';
  return 'sun';
}

// Truncate text
export function truncate(text, maxLength = 100) {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

// Get greeting based on time
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}
