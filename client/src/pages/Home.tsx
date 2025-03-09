import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import LocationHeader from '@/components/LocationHeader';
import NavigationTabs, { TabType } from '@/components/NavigationTabs';
import TabContent from '@/components/TabContent';
import LocationSearch from '@/components/LocationSearch';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface Coordinates {
  lat: number;
  lon: number;
}

interface LocationData {
  name: string;
  lat: number;
  lon: number;
  country?: string;
}

const DEFAULT_LOCATION = {
  name: 'New York',
  lat: 40.7128,
  lon: -74.0060,
  country: 'US'
};

const Home = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('weather');
  const [searchVisible, setSearchVisible] = useState(false);
  const [location, setLocation] = useState<LocationData>(DEFAULT_LOCATION);
  const [backgroundClass, setBackgroundClass] = useState('weather-gradient');
  const [locationLoaded, setLocationLoaded] = useState(false);


  // Fetch current weather
  const { 
    data: weather, 
    isLoading: isWeatherLoading,
    error: weatherError 
  } = useQuery({
    queryKey: [`/api/weather?lat=${location.lat}&lon=${location.lon}`],
    enabled: !!location.lat && !!location.lon,
    staleTime: 1800000, // 30 minutes
    retry: 1, // Only retry once to avoid overwhelming API when key is not valid
  });

  // Fetch forecast
  const { 
    data: forecast, 
    isLoading: isForecastLoading,
    error: forecastError
  } = useQuery({
    queryKey: [`/api/forecast?lat=${location.lat}&lon=${location.lon}`],
    enabled: !!location.lat && !!location.lon,
    staleTime: 1800000, // 30 minutes
    retry: 1,
  });

  // Fetch alerts
  const { 
    data: oneCallData, 
    isLoading: isAlertsLoading,
    error: alertsError
  } = useQuery({
    queryKey: [`/api/onecall?lat=${location.lat}&lon=${location.lon}`],
    enabled: !!location.lat && !!location.lon,
    staleTime: 1800000, // 30 minutes
    retry: 1,
  });

  const isLoading = isWeatherLoading || isForecastLoading || isAlertsLoading;

  // Show toast when API errors occur
  useEffect(() => {
    if (weatherError || forecastError || alertsError) {
      // Only show once when any error occurs
      toast({
        title: "Weather API Issue",
        description: "We're experiencing issues with the weather data service. This might be due to API key activation delay (typically 2 hours) or service disruption.",
        variant: "destructive",
        duration: 5000
      });
    }
  }, [weatherError, forecastError, alertsError, toast]);

  // Update background based on time of day and weather conditions
  useEffect(() => {
    if (weather && weather.sys && weather.weather) {
      const currentTime = Math.floor(Date.now() / 1000);
      const isNight = currentTime > weather.sys.sunset || currentTime < weather.sys.sunrise;
      const weatherMain = weather.weather[0]?.main?.toLowerCase() || '';

      if (isNight) {
        setBackgroundClass('night-gradient');
      } else if (weatherMain.includes('rain') || weatherMain.includes('drizzle') || weatherMain.includes('thunderstorm')) {
        setBackgroundClass('rain-gradient');
      } else if (weatherMain.includes('snow')) {
        setBackgroundClass('snow-gradient');
      } else if (currentTime > weather.sys.sunset - 3600 && currentTime < weather.sys.sunset) {
        // Sunset is within the next hour
        setBackgroundClass('sunset-gradient');
      } else {
        setBackgroundClass('weather-gradient');
      }
    }
  }, [weather]);

  // Try to detect user's location on first load
  useEffect(() => {
    if (!locationLoaded) {
      getUserLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;

            // Get location name
            const response = await apiRequest(
              'GET', 
              `/api/reverse-geocode?lat=${latitude}&lon=${longitude}`, 
              undefined
            );
            const data = await response.json();

            if (data && data.length > 0) {
              setLocation({
                name: data[0].name,
                lat: latitude,
                lon: longitude,
                country: data[0].country
              });
              setLocationLoaded(true);
              // Save to recent locations
              await apiRequest('POST', '/api/locations', {
                name: data[0].name,
                lat: latitude.toString(),
                lon: longitude.toString(),
                country: data[0].country
              });
            } else {
              console.error('Failed to get location name');
              setLocationLoaded(true); // Set to true even if failed to get location name
            }
          } catch (error) {
            console.error('Failed to get location details:', error);
            toast({
              title: "Location Error",
              description: "Could not determine your location. Using default location.",
              variant: "destructive"
            });
            setLocationLoaded(true); // Set to true even if failed
          }
        },
        (error) => {
          console.warn('Geolocation error:', error);
          setLocationLoaded(true); // Set to true even if geolocation fails
          // Using default location if geolocation fails
        }
      );
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleLocationSelect = (selectedLocation: LocationData) => {
    setLocation(selectedLocation);
    setSearchVisible(false);
  };

  return (
    <div className={`min-h-screen font-sans text-gray-800 ${backgroundClass} transition-all duration-300`}>
      {/* Location Header */}
      <LocationHeader 
        location={location.name} 
        onSearchClick={() => setSearchVisible(true)} 
      />

      {/* Navigation Tabs */}
      <NavigationTabs 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />

      {/* Tab Content */}
      <TabContent 
        activeTab={activeTab}
        weather={weather as any}
        forecast={forecast as any}
        alerts={(oneCallData as any)?.alerts || []}
        isLoading={isLoading}
        coordinates={location}
      />

      {/* Location Search Modal */}
      <LocationSearch 
        isVisible={searchVisible}
        onClose={() => setSearchVisible(false)}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
};

export default Home;