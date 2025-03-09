import { Mail, Info, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AboutApp = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">About This App</h2>
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-700 mb-3">
          This weather application provides accurate, up-to-date weather information for locations worldwide. 
          Our goal is to deliver reliable forecasts and valuable weather insights in an easy-to-use interface.
        </p>
        
        <p className="text-gray-700 mb-3">
          Data is refreshed every 30 minutes to ensure you have the latest information. 
          Historical data and trends are updated daily.
        </p>
        
        <p className="text-gray-700 mb-3">
          This application uses the OpenWeatherMap API to provide current conditions, forecasts, and historical 
          weather data. The app is designed to work on both mobile and desktop devices, providing a responsive 
          and intuitive interface.
        </p>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <Button className="flex items-center" variant="default">
            <Mail className="h-4 w-4 mr-1" />
            Contact Support
          </Button>
          
          <Button className="flex items-center" variant="outline">
            <Info className="h-4 w-4 mr-1" />
            Privacy Policy
          </Button>
          
          <Button className="flex items-center" variant="outline">
            <FileText className="h-4 w-4 mr-1" />
            Terms of Service
          </Button>
        </div>
      </div>
      
      <div className="text-center mt-6 text-xs text-gray-500">
        <p>App Version 1.0.0</p>
        <p className="mt-1">© {new Date().getFullYear()} Weather App. All rights reserved.</p>
      </div>
    </div>
  );
};

export default AboutApp;
