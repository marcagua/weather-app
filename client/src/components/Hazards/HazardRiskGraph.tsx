
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface HazardRiskGraphProps {
  location?: string;
}

// Get current date in Philippines format
const currentDate = new Date().toLocaleDateString('en-PH', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

// Sample risk data for Philippines hazards
// In a real app, this would come from a real-time API
const hazardRiskData = [
  {
    name: 'Typhoon',
    risk: 65,
    fill: '#ff4d4f'
  },
  {
    name: 'Flood',
    risk: 48,
    fill: '#1890ff'
  },
  {
    name: 'Earthquake',
    risk: 25,
    fill: '#faad14'
  },
  {
    name: 'Volcanic',
    risk: 30,
    fill: '#722ed1'
  }
];

const HazardRiskGraph: React.FC<HazardRiskGraphProps> = ({ location = 'Philippines' }) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg sm:text-xl flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          Current Hazard Risk Levels
        </CardTitle>
        <p className="text-sm text-gray-500">{currentDate}</p>
        <p className="text-sm font-medium mt-1">{location}</p>
      </CardHeader>
      <CardContent>
        <div className="w-full" style={{ height: '350px', minHeight: '350px', width: '100%', display: 'block' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={hazardRiskData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10,
              }}
              barSize={40}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
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
              <Bar dataKey="risk" name="Risk Level" fill="#8884d8" background={{ fill: '#eee' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>
            <span className="font-medium">Risk level interpretation:</span>
          </p>
          <ul className="list-disc ml-5 mt-1 space-y-1">
            <li>0-25%: Low risk - Be aware</li>
            <li>26-50%: Moderate risk - Stay prepared</li>
            <li>51-75%: High risk - Take precautions</li>
            <li>76-100%: Extreme risk - Follow evacuation orders</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default HazardRiskGraph;
