import { Mail, Info, FileText, Users, CloudSun } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AboutApp = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">About This App</h2>
      <div className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-100 mb-6">
        <div className="flex items-center mb-3">
          <CloudSun className="h-6 w-6 text-blue-500 mr-2" />
          <h3 className="text-lg font-medium text-blue-800">Project Team</h3>
        </div>
        <p className="text-gray-700 mb-4">
          This weather app was developed by BSCpE 3A students: <strong>Jan Marc Agua</strong>, <strong>Keith Gabriel Bansag</strong>, <strong>Anna Marie Basinang</strong>, <strong>Mary Ecelle</strong>, and <strong>Angelica Malaran</strong>. Designed to provide accurate and real-time weather updates, our app helps users stay informed about current conditions, forecasts, and weather alerts.
        </p>
        
        <p className="text-gray-700 mb-4">
          With a user-friendly interface and reliable data, this project showcases our skills in software development, API integration, and mobile app design. Our goal is to deliver a seamless weather-tracking experience for everyone.
        </p>
        
        <p className="text-gray-700 mb-4 font-medium italic">
          Thank you for supporting our project! 🌦️📱
        </p>
      </div>
      
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
          This application uses WeatherAPI.com to provide current conditions and forecast data. The app is designed to work on both mobile and desktop devices, providing a responsive and intuitive interface focused on the Philippines weather.
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
        <p className="mt-1">© {new Date().getFullYear()} BSCpE 3A Weather App. All rights reserved.</p>
      </div>
    </div>
  );
};

export default AboutApp;
