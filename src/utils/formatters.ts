/**
 * Currency and string formatting helpers for Indian Rupee (INR) and banking displays
 */

export function formatINR(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₹ 0';
  }
  return `₹ ${Math.round(amount).toLocaleString('en-IN')}`;
}

export function formatPercent(value: number): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0%';
  }
  return `${Math.round(value)}%`;
}

export function getTimeGreeting(name: string): string {
  const hour = new Date().getHours();
  let timeStr = 'Good morning';
  if (hour >= 12 && hour < 17) {
    timeStr = 'Good afternoon';
  } else if (hour >= 17) {
    timeStr = 'Good evening';
  }
  return `${timeStr}, ${name}`;
}
