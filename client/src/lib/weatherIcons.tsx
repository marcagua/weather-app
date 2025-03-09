import React from 'react';
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Sun,
  SunDim,
  Moon,
  CloudMoon,
  CloudSun,
  Wind
} from 'lucide-react';

// Maps OpenWeatherMap icon codes to Lucide icons
export function getWeatherIcon(code: string, className: string = '') {
  // First two characters indicate weather condition
  // Last character indicates day (d) or night (n)
  const condition = code.slice(0, 2);
  const isDay = code.slice(-1) === 'd';

  switch (condition) {
    // Clear sky
    case '01':
      return isDay 
        ? <Sun className={className} /> 
        : <Moon className={className} />;
    
    // Few clouds
    case '02':
      return isDay 
        ? <CloudSun className={className} /> 
        : <CloudMoon className={className} />;
    
    // Scattered clouds
    case '03':
      return <Cloud className={className} />;
    
    // Broken clouds
    case '04':
      return <Cloud className={className} />;
    
    // Shower rain
    case '09':
      return <CloudDrizzle className={className} />;
    
    // Rain
    case '10':
      return isDay 
        ? <CloudRain className={className} /> 
        : <CloudRain className={className} />;
    
    // Thunderstorm
    case '11':
      return <CloudLightning className={className} />;
    
    // Snow
    case '13':
      return <CloudSnow className={className} />;
    
    // Mist, fog, etc.
    case '50':
      return <CloudFog className={className} />;
    
    // Default/unknown
    default:
      return isDay 
        ? <Sun className={className} /> 
        : <Moon className={className} />;
  }
}

// Create custom compound icons for more specific weather conditions
export function getRainIcon(className: string = '') {
  return (
    <div className="relative inline-block">
      <Cloud className={className} />
      <CloudRain className={`absolute top-1/4 left-1/4 ${className}`} style={{ transform: 'scale(0.5)' }} />
    </div>
  );
}

export function getThunderstormIcon(className: string = '') {
  return (
    <div className="relative inline-block">
      <Cloud className={className} />
      <CloudLightning className={`absolute top-1/4 left-1/4 ${className}`} style={{ transform: 'scale(0.5)' }} />
    </div>
  );
}

export function getPartlyCloudyIcon(className: string = '') {
  return (
    <div className="relative inline-block">
      <Sun className={className} />
      <Cloud className={`absolute top-1/4 left-1/4 ${className}`} style={{ transform: 'scale(0.5)' }} />
    </div>
  );
}

export function getWindyIcon(className: string = '') {
  return (
    <div className="relative inline-block">
      <Cloud className={className} />
      <Wind className={`absolute top-1/2 left-1/4 ${className}`} style={{ transform: 'scale(0.5)' }} />
    </div>
  );
}
