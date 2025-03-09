import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Thermometer, Wind, Droplets, Gauge, Eye, Cloud
} from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface WeatherAPICurrentWeatherProps {
  location?: string;
}

interface WeatherApiResponse {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
    wind_kph: number;
    wind_dir: string;
    pressure_mb: number;
    precip_mm: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    uv: number;
    vis_km: number;
  };
}

const WeatherAPICurrentWeather: React.FC<WeatherAPICurrentWeatherProps> = ({ location = 'Tagbilaran City' }) => {
  const [data, setData] = useState<WeatherApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/weather-api?location=${encodeURIComponent(location)}`);
        setData(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching data from WeatherAPI:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch data from WeatherAPI');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location]);

  if (loading) {
    return (
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
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error fetching weather data</AlertTitle>
        <AlertDescription>
          Unable to load WeatherAPI data. {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) return null;

  const { current, location: locationData } = data;
  const weatherDescription = current.condition.text;
  const iconUrl = `https:${current.condition.icon}`;

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <div className="text-6xl sm:text-7xl font-display font-bold text-secondary">
            {Math.round(current.temp_c)}°C
          </div>
          <div className="text-lg text-gray-600 capitalize">
            {weatherDescription}
          </div>
          <div className="flex items-center justify-center sm:justify-start mt-2 text-gray-600">
            <span className="flex items-center mr-3">
              <Thermometer className="h-4 w-4 mr-1 text-red-500" />
              <span>Feels like {Math.round(current.feelslike_c)}°C</span>
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <img src={iconUrl} alt={weatherDescription} className="h-16 w-16 sm:h-20 sm:w-20 mb-2" />
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:text-base">
            <div className="flex items-center">
              <Wind className="w-5 h-5 text-gray-500 mr-1" />
              <span>{current.wind_kph} km/h</span>
            </div>
            <div className="flex items-center">
              <Droplets className="w-5 h-5 text-gray-500 mr-1" />
              <span>{current.humidity}%</span>
            </div>
            <div className="flex items-center">
              <Gauge className="w-5 h-5 text-gray-500 mr-1" />
              <span>{current.pressure_mb} mb</span>
            </div>
            <div className="flex items-center">
              <Eye className="w-5 h-5 text-gray-500 mr-1" />
              <span>{current.vis_km} km</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherAPICurrentWeather;