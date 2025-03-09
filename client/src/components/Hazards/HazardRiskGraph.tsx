import React from 'react';
import { 
  Bar, 
  BarChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

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
        <div className="h-72 sm:h-80" style={{ minWidth: "300px" }}>
          <ResponsiveContainer width="100%" height="100%" minHeight={250}>
            <BarChart
              data={hazardRiskData}
              margin={{
                top: 5,
                right: 5,
                left: 5,
                bottom: 5,
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
              <Legend />
              <Bar 
                dataKey="risk" 
                name="Risk Level" 
                fill="#8884d8" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>
            <span className="font-medium">Data source:</span> Philippine Atmospheric, Geophysical and Astronomical Services Administration (PAGASA) and Philippine Institute of Volcanology and Seismology (PHIVOLCS)
          </p>
          <p className="mt-2">
            <span className="text-red-500 font-medium">Important:</span> Risk levels above 60% require immediate attention and preparedness.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HazardRiskGraph;