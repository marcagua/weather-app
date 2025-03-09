import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { getTimeAgo, getUVIndexLevel } from '@/lib/utils';
import { WeatherIconByCondition } from '@/lib/weatherIcons';
import { CurrentWeather as CurrentWeatherType } from '@shared/schema';

interface CurrentWeatherProps {
  weatherData: CurrentWeatherType | undefined;
  isLoading: boolean;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weatherData, isLoading }) => {
  if (isLoading) {
    return (
      <section className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Current Weather</h2>
          <Skeleton className="h-5 w-32" />
        </div>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex">
              <Skeleton className="h-9 w-9 mr-4" />
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (!weatherData) {
    return null;
  }

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Current Weather</h2>
        <span className="text-sm text-textSecondary">
          {weatherData.updatedAt ? `Updated ${getTimeAgo(weatherData.updatedAt)}` : ''}
        </span>
      </div>
      
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex">
            <div className="mr-4">
              <WeatherIconByCondition 
                condition={weatherData.condition} 
                className="text-[36px] text-secondary" 
              />
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                <div>
                  <div className="text-sm text-textSecondary">Feels Like</div>
                  <div className="font-medium">{weatherData.feelsLike}°</div>
                </div>
                <div>
                  <div className="text-sm text-textSecondary">Humidity</div>
                  <div className="font-medium">{weatherData.humidity}%</div>
                </div>
                <div>
                  <div className="text-sm text-textSecondary">Wind</div>
                  <div className="font-medium">{weatherData.windSpeed} mph {weatherData.windDirection}</div>
                </div>
                <div>
                  <div className="text-sm text-textSecondary">UV Index</div>
                  <div className="font-medium">{weatherData.uvIndex} ({getUVIndexLevel(weatherData.uvIndex)})</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default CurrentWeather;
