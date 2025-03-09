import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface Coordinates {
  lat: number;
  lon: number;
}

interface Location {
  name: string;
  country?: string;
  lat: number;
  lon: number;
}

export function useWeather() {
  const [location, setLocation] = useState<Location | null>(null);
  const [recentLocations, setRecentLocations] = useState<Location[]>([]);

  // Fetch current weather
  const weather = useQuery({
    queryKey: location ? [`/api/weather?lat=${location.lat}&lon=${location.lon}`] : [],
    enabled: !!location,
  });

  // Fetch forecast
  const forecast = useQuery({
    queryKey: location ? [`/api/forecast?lat=${location.lat}&lon=${location.lon}`] : [],
    enabled: !!location,
  });

  // Fetch onecall data (includes alerts)
  const oneCall = useQuery({
    queryKey: location ? [`/api/onecall?lat=${location.lat}&lon=${location.lon}`] : [],
    enabled: !!location,
  });

  // Get user location
  useEffect(() => {
    fetchRecentLocations();

    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchLocationName(latitude, longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          // If failed, use the first recent location or default to New York
          if (recentLocations.length > 0) {
            setLocation(recentLocations[0]);
          } else {
            setLocation({
              name: 'Tagbilaran City',
              lat: 9.6500,
              lon: 123.8500,
              country: 'PH'
            });
          }
        }
      );
    } else {
      console.error('Geolocation not supported');
      // Use default location
      setLocation({
        name: 'Tagbilaran City',
        lat: 9.6500,
        lon: 123.8500,
        country: 'PH'
      });
    }
  }, []);

  // Fetch recent locations from API
  const fetchRecentLocations = async () => {
    try {
      const response = await apiRequest('GET', '/api/locations', undefined);
      const data = await response.json();
      setRecentLocations(data);
    } catch (error) {
      console.error('Failed to fetch recent locations:', error);
    }
  };

  // Fetch location name from coordinates
  const fetchLocationName = async (lat: number, lon: number) => {
    try {
      const response = await apiRequest(
        'GET', 
        `/api/reverse-geocode?lat=${lat}&lon=${lon}`, 
        undefined
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const newLocation = {
          name: data[0].name,
          lat,
          lon,
          country: data[0].country
        };
        
        setLocation(newLocation);
        
        // Save to recent locations
        await apiRequest('POST', '/api/locations', {
          name: data[0].name,
          lat: lat.toString(),
          lon: lon.toString(),
          country: data[0].country
        });
      }
    } catch (error) {
      console.error('Failed to get location name:', error);
    }
  };

  // Search for location
  const searchLocation = async (query: string) => {
    try {
      const response = await apiRequest(
        'GET', 
        `/api/geocode?q=${encodeURIComponent(query)}`, 
        undefined
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Location search failed:', error);
      return [];
    }
  };

  // Update current location
  const updateLocation = async (newLocation: Location) => {
    setLocation(newLocation);
    
    // Save to recent locations
    try {
      await apiRequest('POST', '/api/locations', {
        name: newLocation.name,
        lat: newLocation.lat.toString(),
        lon: newLocation.lon.toString(),
        country: newLocation.country
      });
      
      // Refresh recent locations
      await fetchRecentLocations();
    } catch (error) {
      console.error('Failed to save location:', error);
    }
  };

  return {
    location,
    weather: {
      data: weather.data,
      isLoading: weather.isLoading,
      error: weather.error
    },
    forecast: {
      data: forecast.data,
      isLoading: forecast.isLoading,
      error: forecast.error
    },
    alerts: {
      data: oneCall.data?.alerts || [],
      isLoading: oneCall.isLoading,
      error: oneCall.error
    },
    recentLocations,
    searchLocation,
    updateLocation,
    fetchRecentLocations
  };
}

export default useWeather;
