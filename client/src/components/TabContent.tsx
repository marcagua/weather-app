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
        ) : !weather ? (
          <div className="p-4 text-center">
            <div className="mb-3 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-base font-medium text-gray-900">Weather Data Unavailable</h3>
            <p className="mt-2 text-sm text-gray-600">
              We're having trouble accessing weather data. This could be due to API activation delay (up to 2 hours) or connectivity issues.
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <a href="#hazards" className="text-sm px-3 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
                📰 View Philippines News →
              </a>
              <a href="#references" className="text-sm px-3 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
                📚 Check Weather Resources →
              </a>
            </div>
          </div>
        ) : (
          <>
            <CurrentWeather currentWeather={weather} />
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
            {alerts && alerts.length > 0 ? (
              <WeatherAlerts alerts={alerts} />
            ) : (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 mb-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium text-amber-800">
                      Weather alerts unavailable
                    </p>
                  </div>
                  <p className="text-xs text-amber-700 ml-7 sm:ml-2">
                    This premium feature requires OneCall API access.
                  </p>
                </div>
              </div>
            )}
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
        ) : !weather ? (
          <div className="p-4 text-center">
            <div className="mb-3 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-base font-medium text-gray-900">Historical Data Unavailable</h3>
            <p className="mt-2 text-sm text-gray-600">
              We're having trouble accessing historical weather data. This could be due to API activation delays.
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <a href="#hazards" className="text-sm px-3 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
                📰 View Philippines News →
              </a>
              <a href="#references" className="text-sm px-3 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
                🌧️ Check Weather Resources →
              </a>
            </div>
          </div>
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
