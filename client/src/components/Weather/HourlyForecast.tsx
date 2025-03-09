import { format } from 'date-fns';
import { getWeatherIcon } from '@/lib/weatherIcons';

interface HourlyForecastItemProps {
  dt: number;
  main: {
    temp: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
}

interface HourlyForecastProps {
  hourlyData: HourlyForecastItemProps[];
}

const HourlyForecastItem = ({ item, index }: { item: HourlyForecastItemProps; index: number }) => {
  // Round the temperature
  const temp = Math.round(item.main.temp);
  
  // Get the time from timestamp
  const date = new Date(item.dt * 1000);
  const timeLabel = index === 0 ? 'Now' : format(date, 'ha');
  
  // Get the weather icon
  const icon = item.weather && item.weather.length > 0 ? item.weather[0].icon : '01d';
  
  return (
    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg min-w-[70px]">
      <div className="text-sm font-medium text-gray-500">{timeLabel}</div>
      {getWeatherIcon(icon, 'text-2xl my-2 w-8 h-8')}
      <div className="font-display font-medium">{temp}°</div>
    </div>
  );
};

const HourlyForecast = ({ hourlyData }: HourlyForecastProps) => {
  if (!hourlyData || hourlyData.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Hourly Forecast</h2>
      <div className="overflow-x-auto pb-2">
        <div className="flex space-x-4 min-w-max">
          {hourlyData.map((hour, index) => (
            <HourlyForecastItem 
              key={hour.dt} 
              item={hour} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HourlyForecast;
