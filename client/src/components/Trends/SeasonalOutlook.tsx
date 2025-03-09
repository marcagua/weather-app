import { Thermometer, Droplets, Leaf } from 'lucide-react';

const SeasonalOutlook = () => {
  // Normally this data would come from a seasonal forecast API
  // For demonstration, using static data
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  
  // Determine season outlook based on current month
  // This would be replaced with real forecast data in a production app
  let temperatureOutlook = "Near normal";
  let precipitationOutlook = "Near normal";
  let droughtOutlook = "No drought expected";
  let temperatureIcon = <Thermometer className="h-8 w-8 text-blue-500 my-2" />;
  let description = "Temperatures are expected to remain near average for this time of year. Precipitation is forecast to be near normal levels with occasional storm systems moving through the region.";
  
  // Adjust outlook based on month/season (simple demo logic)
  if (currentMonth >= 5 && currentMonth <= 8) {  // Summer: June-September
    temperatureOutlook = "Above average";
    precipitationOutlook = "Below normal";
    droughtOutlook = "Moderate drought possible";
    temperatureIcon = <Thermometer className="h-8 w-8 text-red-500 my-2" />;
    description = "Temperatures are expected to be above average for the summer months. Precipitation is forecast to be below normal, which may lead to moderate drought conditions in some areas.";
  } else if (currentMonth >= 9 && currentMonth <= 11) {  // Fall: October-December
    temperatureOutlook = "Near average";
    precipitationOutlook = "Above normal";
    temperatureIcon = <Thermometer className="h-8 w-8 text-yellow-500 my-2" />;
    description = "Temperatures are expected to be near average for the fall season. Precipitation is forecast to be above normal, with more frequent storm systems moving through the region.";
  } else if (currentMonth <= 2) {  // Winter: January-March
    temperatureOutlook = "Below average";
    precipitationOutlook = "Above normal";
    temperatureIcon = <Thermometer className="h-8 w-8 text-blue-700 my-2" />;
    description = "Temperatures are expected to be below average for the winter months. Precipitation is forecast to be above normal, with more frequent snowfall and winter storm systems.";
  } else {  // Spring: April-May
    temperatureOutlook = "Near average";
    precipitationOutlook = "Above normal";
    temperatureIcon = <Thermometer className="h-8 w-8 text-green-500 my-2" />;
    description = "Temperatures are expected to be near average for the spring season. Precipitation is forecast to be above normal, supporting healthy plant growth and possibly causing localized flooding.";
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Seasonal Outlook</h2>
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="mb-4">
          <h3 className="font-medium text-lg text-gray-800">Next 30 Days</h3>
          <p className="mt-2 text-gray-700">{description}</p>
        </div>
        
        <div>
          <h3 className="font-medium text-lg text-gray-800">3-Month Outlook</h3>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col items-center p-3 bg-white rounded border border-gray-200">
              <h4 className="font-medium">Temperature</h4>
              {temperatureIcon}
              <p className="text-sm text-center text-gray-600">{temperatureOutlook}</p>
            </div>
            
            <div className="flex flex-col items-center p-3 bg-white rounded border border-gray-200">
              <h4 className="font-medium">Precipitation</h4>
              <Droplets className="h-8 w-8 text-blue-500 my-2" />
              <p className="text-sm text-center text-gray-600">{precipitationOutlook}</p>
            </div>
            
            <div className="flex flex-col items-center p-3 bg-white rounded border border-gray-200">
              <h4 className="font-medium">Drought</h4>
              <Leaf className="h-8 w-8 text-green-500 my-2" />
              <p className="text-sm text-center text-gray-600">{droughtOutlook}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonalOutlook;
