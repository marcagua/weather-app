import { WeatherResponse } from '@shared/schema';
import { 
  Thermometer, Wind, Droplets, Gauge, Eye 
} from 'lucide-react';
import { getWeatherIcon } from '@/lib/weatherIcons';
import { kelvinToCelsius } from '@/lib/utils';

interface CurrentWeatherProps {
  currentWeather: WeatherResponse;
}

const CurrentWeather = ({ currentWeather }: CurrentWeatherProps) => {
  if (!currentWeather) return null;

  // Convert temperatures to Celsius and whole numbers
  const temperature = Math.round(kelvinToCelsius(currentWeather.main.temp));
  const highTemp = Math.round(kelvinToCelsius(currentWeather.main.temp_max));
  const lowTemp = Math.round(kelvinToCelsius(currentWeather.main.temp_min));
  
  // Get weather description from first weather item in array
  const weatherDescription = 
    currentWeather.weather && 
    currentWeather.weather.length > 0 ? 
    currentWeather.weather[0].description : '';
  
  // Get appropriate weather icon
  const weatherIconCode = 
    currentWeather.weather && 
    currentWeather.weather.length > 0 ? 
    currentWeather.weather[0].icon : '01d';
  
  // Convert visibility from meters to kilometers
  const visibilityKm = Math.round((currentWeather.visibility / 1000) * 10) / 10;
  
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <div className="text-6xl sm:text-7xl font-display font-bold text-secondary">
            {temperature}°
          </div>
          <div className="text-lg text-gray-600 capitalize">
            {weatherDescription}
          </div>
          <div className="flex items-center justify-center sm:justify-start mt-2 text-gray-600">
            <span className="flex items-center mr-3">
              <Thermometer className="h-4 w-4 mr-1 text-red-500" />
              <span>{highTemp}°</span>
            </span>
            <span className="flex items-center">
              <Thermometer className="h-4 w-4 mr-1 text-blue-500" />
              <span>{lowTemp}°</span>
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          {getWeatherIcon(weatherIconCode, 'h-16 w-16 sm:h-20 sm:w-20 mb-2 text-accent')}
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:text-base">
            <div className="flex items-center">
              <Wind className="w-5 h-5 text-gray-500 mr-1" />
              <span>{Math.round(currentWeather.wind.speed)} m/s</span>
            </div>
            <div className="flex items-center">
              <Droplets className="w-5 h-5 text-gray-500 mr-1" />
              <span>{currentWeather.main.humidity}%</span>
            </div>
            <div className="flex items-center">
              <Gauge className="w-5 h-5 text-gray-500 mr-1" />
              <span>{currentWeather.main.pressure} hPa</span>
            </div>
            <div className="flex items-center">
              <Eye className="w-5 h-5 text-gray-500 mr-1" />
              <span>{visibilityKm} km</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
