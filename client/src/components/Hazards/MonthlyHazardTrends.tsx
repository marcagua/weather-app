
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { TrendingUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Skeleton } from '@/components/ui/Skeleton';
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
            <div className="h-72 sm:h-80" style={{ minWidth: "300px" }}>
              <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                <LineChart
                  data={trendsData}
                  margin={{
                    top: 5,
                    right: 5,
                    left: 5,
                    bottom: 5,
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
              <Legend />
              <Line 
                type="monotone" 
                dataKey="typhoon" 
                name="Typhoon" 
                stroke="#ff4d4f" 
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
              <Line 
                type="monotone" 
                dataKey="flood" 
                name="Flood" 
                stroke="#1890ff" 
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
              <Line 
                type="monotone" 
                dataKey="earthquake" 
                name="Earthquake" 
                stroke="#faad14" 
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
              <Line 
                type="monotone" 
                dataKey="volcanic" 
                name="Volcanic" 
                stroke="#722ed1" 
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
            
            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2">Recent Hazard Events</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentHazardEvents.map((event, index) => (
                  <div key={index} className="border rounded-md p-3 bg-gray-50">
                    <div className="flex items-start">
                      <div className={`w-2 h-2 rounded-full mt-1.5 mr-2 ${
                        event.type === 'Typhoon' ? 'bg-red-500' :
                        event.type === 'Flood' ? 'bg-blue-500' :
                        event.type === 'Earthquake' ? 'bg-yellow-500' :
                        'bg-purple-500'
                      }`} />
                      <div>
                        <h4 className="font-semibold text-sm">
                          {event.type}: {event.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">{event.date}</p>
                        <p className="text-xs mt-1">{event.description}</p>
                      </div>
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
                <span className="text-amber-600 font-medium">Note:</span> Risk levels vary based on seasonal patterns. Typhoon season typically peaks from July to October.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyHazardTrends;
