import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string, format: string = 'long'): string {
  const date = new Date(dateString);
  
  if (format === 'long') {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  } else if (format === 'short') {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  } else if (format === 'time') {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
  
  return date.toLocaleString();
}

export function formatTemp(temp: number): string {
  return `${Math.round(temp)}°`;
}

export function getUVIndexLevel(uvIndex: number): string {
  if (uvIndex <= 2) return 'Low';
  if (uvIndex <= 5) return 'Moderate';
  if (uvIndex <= 7) return 'High';
  if (uvIndex <= 10) return 'Very High';
  return 'Extreme';
}

export function getWeatherColorClass(condition: string): string {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('cloud')) return 'text-secondary';
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return 'text-rain';
  if (conditionLower.includes('sun') || conditionLower.includes('clear')) return 'text-secondary';
  if (conditionLower.includes('snow')) return 'text-blue-200';
  if (conditionLower.includes('thunder')) return 'text-purple-500';
  if (conditionLower.includes('fog') || conditionLower.includes('mist')) return 'text-gray-400';
  
  return 'text-secondary';
}

export function getTimeAgo(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins === 1) return '1 min ago';
  if (diffMins < 60) return `${diffMins} mins ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  
  return `${diffDays} days ago`;
}

export function getSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'severe':
      return 'text-alert border-alert bg-red-50';
    case 'warning':
      return 'text-secondary border-secondary bg-amber-50';
    default:
      return 'text-blue-500 border-blue-500 bg-blue-50';
  }
}

export function getHazardIcon(type: string): string {
  const typeLower = type.toLowerCase();
  
  if (typeLower.includes('lightning')) return 'flash_on';
  if (typeLower.includes('flood')) return 'water';
  if (typeLower.includes('fire')) return 'local_fire_department';
  if (typeLower.includes('wind')) return 'air';
  if (typeLower.includes('cold')) return 'ac_unit';
  if (typeLower.includes('heat')) return 'thermostat';
  if (typeLower.includes('uv')) return 'wb_sunny';
  
  return 'warning';
}

export function getHazardColor(type: string): string {
  const typeLower = type.toLowerCase();
  
  if (typeLower.includes('lightning')) return 'bg-amber-100 text-secondary';
  if (typeLower.includes('flood')) return 'bg-blue-100 text-rain';
  if (typeLower.includes('fire')) return 'bg-red-100 text-alert';
  if (typeLower.includes('wind')) return 'bg-gray-100 text-gray-500';
  if (typeLower.includes('cold')) return 'bg-blue-100 text-blue-500';
  if (typeLower.includes('heat')) return 'bg-orange-100 text-orange-500';
  if (typeLower.includes('uv')) return 'bg-yellow-100 text-yellow-600';
  
  return 'bg-amber-100 text-secondary';
}
