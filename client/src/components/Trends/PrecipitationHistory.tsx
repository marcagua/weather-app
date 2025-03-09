import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, subDays } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface PrecipitationHistoryProps {
  coordinates: { lat: number; lon: number };
}

const PrecipitationHistory = ({ coordinates }: PrecipitationHistoryProps) => {
  const [chartData, setChartData] = useState<any[]>([]);

  // Fetch historical data for past 14 days
  const fetchPrecipitationData = async (days: number) => {
    const precipData = [];
    const today = new Date();
    
    // Fetch data for each of the past 14 days
    for (let i = 1; i <= days; i++) {
      const date = subDays(today, i);
      const timestamp = Math.floor(date.getTime() / 1000);
      
      try {
        const url = `/api/historical?lat=${coordinates.lat}&lon=${coordinates.lon}&dt=${timestamp}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data && data.hourly) {
          // Calculate total precipitation for the day (sum of hourly data)
          let totalRain = 0;
          let totalSnow = 0;
          
          data.hourly.forEach((hour: any) => {
            if (hour.rain && hour.rain['1h']) {
              totalRain += hour.rain['1h'];
            }
            if (hour.snow && hour.snow['1h']) {
              totalSnow += hour.snow['1h'];
            }
          });
          
          precipData.push({
            date: format(date, 'MMM d'),
            rawDate: date,
            rain: parseFloat(totalRain.toFixed(2)),
            snow: parseFloat(totalSnow.toFixed(2)),
          });
        }
      } catch (error) {
        console.error(`Failed to fetch precipitation data for ${format(date, 'yyyy-MM-dd')}:`, error);
      }
    }
    
    // Sort by date (oldest to newest)
    return precipData.sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());
  };

  // Use React Query to fetch the data
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/historical-precipitation', coordinates.lat, coordinates.lon],
    queryFn: () => fetchPrecipitationData(14),
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
        <h2 className="text-xl font-semibold mb-4">Precipitation History</h2>
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Precipitation History</h2>
        <div className="bg-red-50 p-4 rounded-lg text-red-800">
          <p>Failed to load precipitation data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Precipitation History</h2>
      <div className="bg-gray-50 rounded-lg p-4" style={{ height: '250px' }}>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
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
                tickFormatter={(value) => `${value} mm`}
              />
              <Tooltip 
                formatter={(value: number) => [`${value} mm`, 'Precipitation']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Bar 
                dataKey="rain" 
                name="Rain" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="snow" 
                name="Snow" 
                fill="#93c5fd" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">No precipitation data available for the selected period</p>
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-gray-500 text-center">
        Chart shows precipitation history over the past 14 days
      </p>
    </div>
  );
};

export default PrecipitationHistory;
