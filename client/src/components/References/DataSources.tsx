import { ExternalLink } from 'lucide-react';

const DataSources = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Data Sources</h2>
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium">Primary Weather Data</h3>
          <p className="mt-1 text-gray-700">OpenWeatherMap API</p>
          <div className="mt-2 flex">
            <a 
              href="https://openweathermap.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm flex items-center"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Visit website
            </a>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium">Radar Imagery</h3>
          <p className="mt-1 text-gray-700">OpenWeatherMap Maps</p>
          <div className="mt-2 flex">
            <a 
              href="https://openweathermap.org/api/weathermaps" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm flex items-center"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Visit website
            </a>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium">Historical Data</h3>
          <p className="mt-1 text-gray-700">OpenWeatherMap Historical API</p>
          <div className="mt-2 flex">
            <a 
              href="https://openweathermap.org/api/one-call-api" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm flex items-center"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Visit website
            </a>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium">Climate Outlooks</h3>
          <p className="mt-1 text-gray-700">National Oceanic and Atmospheric Administration (NOAA)</p>
          <div className="mt-2 flex">
            <a 
              href="https://www.cpc.ncep.noaa.gov/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm flex items-center"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Visit website
            </a>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium">Additional Weather Information</h3>
          <p className="mt-1 text-gray-700">National Weather Service (NWS)</p>
          <div className="mt-2 flex">
            <a 
              href="https://www.weather.gov/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm flex items-center"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Visit website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSources;
