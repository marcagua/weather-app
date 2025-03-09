import { TabType } from './NavigationTabs';
import CurrentWeather from './Weather/CurrentWeather';
import HourlyForecast from './Weather/HourlyForecast';
import DailyForecast from './Weather/DailyForecast';
import WeatherAlerts from './Hazards/WeatherAlerts';
import HazardMap from './Hazards/HazardMap';
import SafetyTips from './Hazards/SafetyTips';
import PhilippinesNews from './Hazards/PhilippinesNews';
import TemperatureTrend from './Trends/TemperatureTrend';
import PrecipitationHistory from './Trends/PrecipitationHistory';
import SeasonalOutlook from './Trends/SeasonalOutlook';
import PhilippinesReferences from './References/PhilippinesReferences';
import { ForecastResponse, WeatherResponse } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

interface TabContentProps {
  activeTab: TabType;
  weather?: WeatherResponse;
  forecast?: ForecastResponse;
  alerts?: any[];
  isLoading: boolean;
  coordinates: { lat: number; lon: number } | null;
}

export function TabContent({ 
  activeTab, 
  weather, 
  forecast, 
  alerts = [], 
  isLoading,
  coordinates
}: TabContentProps) {
  return (
    <main className="bg-white rounded-tl-none rounded-tr-none rounded-bl-2xl rounded-br-2xl shadow-lg max-w-4xl mx-auto overflow-hidden">
      {/* Weather Tab Content */}
      <div className={`p-4 sm:p-6 ${activeTab === 'weather' ? '' : 'hidden'}`}>
        {isLoading ? (
          <WeatherLoadingSkeleton />
        ) : (
          <>
            {weather && <CurrentWeather currentWeather={weather} />}
            {forecast && <HourlyForecast hourlyData={forecast.list.slice(0, 8)} />}
            {forecast && <DailyForecast forecast={forecast} />}
          </>
        )}
      </div>

      {/* Hazards Tab Content */}
      <div className={`p-4 sm:p-6 ${activeTab === 'hazards' ? '' : 'hidden'}`}>
        {isLoading ? (
          <HazardsLoadingSkeleton />
        ) : (
          <>
            <WeatherAlerts alerts={alerts} />
            {coordinates && <HazardMap lat={coordinates.lat} lon={coordinates.lon} />}
            <SafetyTips alerts={alerts} />
            <PhilippinesNews />
          </>
        )}
      </div>

      {/* Trends Tab Content */}
      <div className={`p-4 sm:p-6 ${activeTab === 'trends' ? '' : 'hidden'}`}>
        {isLoading ? (
          <TrendsLoadingSkeleton />
        ) : (
          <>
            {coordinates && <TemperatureTrend coordinates={coordinates} />}
            {coordinates && <PrecipitationHistory coordinates={coordinates} />}
            <SeasonalOutlook />
          </>
        )}
      </div>

      {/* References Tab Content */}
      <div className={`p-4 sm:p-6 ${activeTab === 'references' ? '' : 'hidden'}`}>
        <PhilippinesReferences />
      </div>
    </main>
  );
}

function WeatherLoadingSkeleton() {
  return (
    <>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <Skeleton className="h-16 w-32 mb-2" />
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-6 w-32" />
          </div>
          
          <div className="flex flex-col items-center">
            <Skeleton className="h-16 w-16 rounded-full mb-4" />
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-16 rounded-lg" />
          ))}
        </div>
      </div>
      
      <div>
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-3">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </>
  );
}

function HazardsLoadingSkeleton() {
  return (
    <>
      <div className="mb-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-32 w-full rounded-lg mb-4" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
      
      <div className="mb-8">
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
      
      <div>
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-48 w-full rounded-lg mb-3" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    </>
  );
}

function TrendsLoadingSkeleton() {
  return (
    <>
      <div className="mb-8">
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
      
      <div className="mb-8">
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
      
      <div>
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-32 w-full rounded-lg mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    </>
  );
}

export default TabContent;
