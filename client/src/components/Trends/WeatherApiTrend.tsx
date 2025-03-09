import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Cloud, Droplets, Wind } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

interface WeatherApiTrendProps {
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
  };
}

const WeatherApiTrend: React.FC<WeatherApiTrendProps> = ({ location = 'Tagbilaran City' }) => {
  const [data, setData] = useState<WeatherApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=5c340d5092ac482287f13436250903&q=${encodeURIComponent(location)}&aqi=no`);
        setData(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching data from WeatherAPI:', err);
        setError(err.message || 'Failed to fetch data from WeatherAPI');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location]);

  if (loading) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-32 w-full sm:w-1/2 rounded-lg" />
            <Skeleton className="h-32 w-full sm:w-1/2 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
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
  const formattedDate = new Date(locationData.localtime).toLocaleDateString('en-PH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Thermometer className="h-5 w-5 text-blue-500 mr-2" />
          Current Weather from WeatherAPI
        </CardTitle>
        <p className="text-sm text-gray-500">{formattedDate}</p>
        <p className="text-sm font-medium mt-1">{locationData.name}, {locationData.country}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg flex items-center">
            <div className="mr-4">
              <img 
                src={`https:${current.condition.icon}`} 
                alt={current.condition.text}
                className="w-16 h-16"
              />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {current.temp_c}°C
              </div>
              <div className="text-gray-600">
                {current.condition.text}
              </div>
              <div className="text-sm text-gray-500">
                Feels like {current.feelslike_c}°C
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <Wind className="h-4 w-4 text-gray-600 mr-2" />
                <div>
                  <div className="text-sm text-gray-600">Wind</div>
                  <div className="text-gray-900">{current.wind_kph} km/h {current.wind_dir}</div>
                </div>
              </div>
              <div className="flex items-center">
                <Droplets className="h-4 w-4 text-gray-600 mr-2" />
                <div>
                  <div className="text-sm text-gray-600">Humidity</div>
                  <div className="text-gray-900">{current.humidity}%</div>
                </div>
              </div>
              <div className="flex items-center">
                <Thermometer className="h-4 w-4 text-gray-600 mr-2" />
                <div>
                  <div className="text-sm text-gray-600">Pressure</div>
                  <div className="text-gray-900">{current.pressure_mb} mb</div>
                </div>
              </div>
              <div className="flex items-center">
                <Cloud className="h-4 w-4 text-gray-600 mr-2" />
                <div>
                  <div className="text-sm text-gray-600">Cloud Cover</div>
                  <div className="text-gray-900">{current.cloud}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p>
            <span className="font-medium">Data source:</span> WeatherAPI.com - Current weather data for {locationData.name}
          </p>
          <p className="mt-2">
            <span className="text-blue-500 font-medium">Note:</span> UV Index is currently {current.uv} ({current.uv < 3 ? 'Low' : current.uv < 6 ? 'Moderate' : current.uv < 8 ? 'High' : current.uv < 11 ? 'Very High' : 'Extreme'})
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherApiTrend;