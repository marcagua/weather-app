import React from 'react';

interface WeatherIconProps {
  iconCode: string;
  className?: string;
}

const iconMap: Record<string, string> = {
  '01d': 'wb_sunny',          // Clear sky (day)
  '01n': 'nights_stay',       // Clear sky (night)
  '02d': 'partly_cloudy_day', // Few clouds (day)
  '02n': 'nights_stay',       // Few clouds (night)
  '03d': 'cloud',             // Scattered clouds
  '03n': 'cloud',             // Scattered clouds
  '04d': 'cloud',             // Broken clouds
  '04n': 'cloud',             // Broken clouds
  '09d': 'grain',             // Shower rain
  '09n': 'grain',             // Shower rain
  '10d': 'water_drop',        // Rain (day)
  '10n': 'water_drop',        // Rain (night)
  '11d': 'thunderstorm',      // Thunderstorm
  '11n': 'thunderstorm',      // Thunderstorm
  '13d': 'ac_unit',           // Snow
  '13n': 'ac_unit',           // Snow
  '50d': 'foggy',             // Mist
  '50n': 'foggy',             // Mist
};

const conditionMap: Record<string, string> = {
  'Clear': 'wb_sunny',
  'Clouds': 'wb_cloudy',
  'Rain': 'water_drop',
  'Drizzle': 'grain',
  'Thunderstorm': 'thunderstorm',
  'Snow': 'ac_unit',
  'Mist': 'foggy',
  'Smoke': 'foggy',
  'Haze': 'foggy',
  'Dust': 'foggy',
  'Fog': 'foggy',
  'Sand': 'foggy',
  'Ash': 'foggy',
  'Squall': 'air',
  'Tornado': 'tornado',
};

export const getIconForCondition = (condition: string): string => {
  return conditionMap[condition] || 'wb_cloudy';
};

export const WeatherIcon: React.FC<WeatherIconProps> = ({ iconCode, className = '' }) => {
  // Get the correct Material Icon name
  const iconName = iconMap[iconCode] || 'wb_cloudy';
  
  return (
    <span className={`material-icons ${className}`}>
      {iconName}
    </span>
  );
};

export const WeatherIconByCondition: React.FC<{condition: string; className?: string}> = 
  ({ condition, className = '' }) => {
  
  const iconName = getIconForCondition(condition);
  
  return (
    <span className={`material-icons ${className}`}>
      {iconName}
    </span>
  );
};

export default WeatherIcon;
