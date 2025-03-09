import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { WeatherIconByCondition } from '@/lib/weatherIcons';

interface HeaderProps {
  locationName: string;
  dateTime: string;
  temperature?: number;
  condition?: string;
  isLoading: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  locationName, 
  dateTime, 
  temperature, 
  condition,
  isLoading 
}) => {
  return (
    <header className="bg-primary text-white p-4 md:p-6 rounded-b-xl shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center mb-1">
            <span className="material-icons text-sm mr-1">location_on</span>
            {isLoading ? (
              <Skeleton className="h-6 w-40 bg-white/20" />
            ) : (
              <h1 className="text-lg font-medium">{locationName || 'Location not set'}</h1>
            )}
          </div>
          <div className="text-sm text-white/90">{dateTime}</div>
        </div>
        
        <div className="text-right">
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-16 bg-white/20 mb-1 ml-auto" />
              <Skeleton className="h-4 w-24 bg-white/20 ml-auto" />
            </>
          ) : (
            <>
              <div className="text-3xl font-semibold">
                {temperature !== undefined ? `${temperature}°` : '--°'}
              </div>
              <div className="text-sm text-white/90">
                {condition || 'Unknown'}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
