import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, subDays } from 'date-fns';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface TemperatureTrendProps {
  coordinates: { lat: number; lon: number };
}

const TemperatureTrend = ({ coordinates }: TemperatureTrendProps) => {
  const [chartData, setChartData] = useState<any[]>([]);

  // Fetch historical data for past 7 days
  const fetchHistoricalData = async (days: number) => {
    const historicalData = [];
    const today = new Date();
    
    // Fetch data for each of the past 7 days
    for (let i = 1; i <= days; i++) {
      const date = subDays(today, i);
      const timestamp = Math.floor(date.getTime() / 1000);
      
      try {
        const url = `/api/historical?lat=${coordinates.lat}&lon=${coordinates.lon}&dt=${timestamp}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data && data.current) {
          historicalData.push({
            date: format(date, 'MMM d'),
            rawDate: date,
            temperature: data.current.temp,
            feelsLike: data.current.feels_like,
          });
        }
      } catch (error) {
        console.error(`Failed to fetch data for ${format(date, 'yyyy-MM-dd')}:`, error);
      }
    }
    
    // Sort by date (oldest to newest)
    return historicalData.sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());
  };

  // Use React Query to fetch the data
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/historical-temperature', coordinates.lat, coordinates.lon],
    queryFn: () => fetchHistoricalData(7),
    enabled: !!coordinates.lat && !!coordinates.lon,
    staleTime: 3600000, // 1 hour
  });

  // Update chart data when query data changes
  useEffect(() => {
    if (data) {
      setChartData(data);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Temperature Trends</h2>
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Temperature Trends</h2>
        <div className="bg-red-50 p-4 rounded-lg text-red-800">
          <p>Failed to load temperature trend data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Temperature Trends</h2>
      <div className="bg-gray-50 rounded-lg p-4" style={{ height: '250px' }}>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280" 
                fontSize={12}
                tickMargin={10} 
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12}
                tickFormatter={(value) => `${value}°`}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)}°F`, 'Temperature']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                name="Temperature" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="feelsLike" 
                name="Feels Like" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">No temperature data available for the past 7 days</p>
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-gray-500 text-center">
        Chart shows temperature trends over the past 7 days
      </p>
    </div>
  );
};

export default TemperatureTrend;
