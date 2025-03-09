import { ForecastResponse } from '@shared/schema';
import { format, addDays, isSameDay } from 'date-fns';
import { getWeatherIcon } from '@/lib/weatherIcons';

interface DailyForecastProps {
  forecast: ForecastResponse;
}

const DailyForecast = ({ forecast }: DailyForecastProps) => {
  if (!forecast || !forecast.list || forecast.list.length === 0) return null;

  // Group forecast data by day
  const dailyData = groupForecastByDay(forecast.list);
  
  // Get next 7 days (or less if not available)
  const days = Object.keys(dailyData).slice(0, 7);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">7-Day Forecast</h2>
      <div className="space-y-3">
        {days.map((day, index) => {
          const dayData = dailyData[day];
          
          // Find max and min temps for the day
          const maxTemp = Math.round(Math.max(...dayData.map(item => item.main.temp_max)));
          const minTemp = Math.round(Math.min(...dayData.map(item => item.main.temp_min)));
          
          // Get the most common weather condition for the day
          const weatherConditions = dayData.map(item => 
            item.weather && item.weather.length > 0 ? item.weather[0].icon : '01d'
          );
          const mostCommonIcon = getMostCommonItem(weatherConditions);
          
          // Format the day name
          const dayDate = new Date(dayData[0].dt * 1000);
          const dayName = index === 0 ? 'Today' : format(dayDate, 'EEE');
          
          return (
            <div key={day} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="w-24 font-medium">{dayName}</div>
              <div className="flex-1 flex items-center justify-center">
                {getWeatherIcon(mostCommonIcon, 'text-2xl')}
              </div>
              <div className="w-24 text-right">
                <span className="font-medium">{maxTemp}°</span>
                <span className="text-gray-500 ml-2">{minTemp}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Helper function to group forecast data by day
function groupForecastByDay(forecastList: ForecastResponse['list']) {
  const groupedData: Record<string, ForecastResponse['list']> = {};
  
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000);
    const day = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    if (!groupedData[day]) {
      groupedData[day] = [];
    }
    
    groupedData[day].push(item);
  });
  
  return groupedData;
}

// Helper function to get the most common item in an array
function getMostCommonItem(array: string[]): string {
  const counts: Record<string, number> = {};
  let maxCount = 0;
  let maxItem = array[0];
  
  for (const item of array) {
    counts[item] = (counts[item] || 0) + 1;
    if (counts[item] > maxCount) {
      maxCount = counts[item];
      maxItem = item;
    }
  }
  
  return maxItem;
}

export default DailyForecast;
