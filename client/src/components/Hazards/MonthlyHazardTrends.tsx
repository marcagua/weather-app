
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';

interface MonthlyHazardTrendsProps {
  location?: string;
}

const MonthlyHazardTrends: React.FC<MonthlyHazardTrendsProps> = ({ location = 'Philippines' }) => {
  // Fetch hazard trends data from API
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/monthly-hazard-trends'],
  });

  // Extract data from the API response
  const trendsData = data?.trends || [];
  const recentHazardEvents = data?.recentEvents || [];
  const dataSources = data?.sources || [];

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg sm:text-xl flex items-center">
          <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
          Monthly Hazard Risk Trends
        </CardTitle>
        <p className="text-sm font-medium mt-1">{location || 'Philippines'}</p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-72 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">
            Failed to load hazard trends data. Please try again later.
          </div>
        ) : (
          <>
            <div style={{ width: '100%', height: '400px', minHeight: '400px', position: 'relative' }}>
              <ResponsiveContainer width="99%" height="100%" aspect={1.5}>
                <LineChart
                  data={trendsData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis 
                    domain={[0, 100]} 
                    label={{ 
                      value: 'Risk Level (%)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' }
                    }} 
                  />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Risk Level']}
                    labelStyle={{ fontWeight: 'bold' }}
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      padding: '8px'
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                  <Line
                    type="monotone"
                    dataKey="typhoon"
                    name="Typhoon"
                    stroke="#ff4d4f"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="flood"
                    name="Flood"
                    stroke="#1890ff"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="earthquake"
                    name="Earthquake"
                    stroke="#faad14"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="volcanic"
                    name="Volcanic"
                    stroke="#722ed1"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2">Recent Hazard Events</h3>
              <div className="space-y-2">
                {recentHazardEvents.map((event, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">
                          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                            event.type === 'Typhoon' ? 'bg-red-500' :
                            event.type === 'Flood' ? 'bg-blue-500' :
                            event.type === 'Earthquake' ? 'bg-amber-500' : 'bg-purple-500'
                          }`}></span>
                          {event.name}
                        </h4>
                        <p className="text-sm text-gray-600">{event.description}</p>
                      </div>
                      <span className="text-xs text-gray-500">{event.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p>
                <span className="font-medium">Data sources:</span> {dataSources.join(', ')}
              </p>
              <p className="mt-2">
                <span className="text-amber-600 font-medium">Note:</span> Risk levels for 2025 show increased intensity during typhoon season (July to October) with earlier onset of severe weather events compared to previous years.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyHazardTrends;
