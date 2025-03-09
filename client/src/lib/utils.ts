import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines and merges Tailwind CSS classes with clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date as a string (e.g., "Monday, October 16, 2023")
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Formats a time as a string (e.g., "3:45 PM")
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Converts temperature from Kelvin to Fahrenheit
 */
export function kelvinToFahrenheit(kelvin: number): number {
  return Math.round((kelvin - 273.15) * 9/5 + 32);
}

/**
 * Converts temperature from Kelvin to Celsius
 */
export function kelvinToCelsius(kelvin: number): number {
  return Math.round(kelvin - 273.15);
}

/**
 * Converts wind speed from meters per second to miles per hour
 */
export function msToMph(ms: number): number {
  return Math.round(ms * 2.237);
}

/**
 * Converts visibility from meters to miles
 */
export function metersToMiles(meters: number): number {
  return Math.round((meters / 1609.34) * 10) / 10;
}

/**
 * Gets a weather background class based on weather condition and time
 */
export function getWeatherBackground(
  weatherCode: string, 
  sunriseTimestamp: number, 
  sunsetTimestamp: number
): string {
  const currentTime = Math.floor(Date.now() / 1000);
  const isNight = currentTime > sunsetTimestamp || currentTime < sunriseTimestamp;
  const isSunset = currentTime > sunsetTimestamp - 3600 && currentTime < sunsetTimestamp;
  
  // First two characters of code indicate weather condition
  const condition = weatherCode.slice(0, 2);
  
  if (isNight) {
    return 'night-gradient';
  }
  
  if (isSunset) {
    return 'sunset-gradient';
  }
  
  // Check specific weather conditions
  switch (condition) {
    // Thunderstorm
    case '11':
      return 'storm-gradient';
    
    // Rain or drizzle
    case '09':
    case '10':
      return 'rain-gradient';
    
    // Snow
    case '13':
      return 'snow-gradient';
    
    // Mist, fog
    case '50':
      return 'fog-gradient';
    
    // Clear or partly cloudy
    case '01':
    case '02':
      return 'sunny-gradient';
    
    // Cloudy
    case '03':
    case '04':
      return 'cloudy-gradient';
    
    // Default
    default:
      return 'weather-gradient';
  }
}

/**
 * Debounce function for limiting the rate at which a function can fire
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}
