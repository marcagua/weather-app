const WeatherTerminology = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Weather Terminology</h2>
      <div className="space-y-3">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium">Watch vs. Warning</h3>
          <p className="mt-1 text-gray-700">
            <span className="font-semibold">Watch:</span> Conditions are favorable for the weather event. Be prepared.
          </p>
          <p className="mt-1 text-gray-700">
            <span className="font-semibold">Warning:</span> Weather event is occurring or imminent. Take action immediately.
          </p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium">Heat Index</h3>
          <p className="mt-1 text-gray-700">
            A measure of how hot it feels when relative humidity is factored in with the actual air temperature.
          </p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium">Dew Point</h3>
          <p className="mt-1 text-gray-700">
            The temperature at which air must be cooled to become saturated with water vapor, forming dew. Higher dew points feel more humid.
          </p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium">Barometric Pressure</h3>
          <p className="mt-1 text-gray-700">
            The weight of air in the atmosphere. Falling pressure typically indicates approaching storms, while rising pressure often means fair weather.
          </p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium">Wind Chill</h3>
          <p className="mt-1 text-gray-700">
            How cold it feels based on the rate of heat loss from exposed skin caused by the combined effects of wind and cold.
          </p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium">UV Index</h3>
          <p className="mt-1 text-gray-700">
            A scale that indicates the level of ultraviolet radiation exposure at the Earth's surface. Higher values mean greater risk of sunburn and skin damage.
          </p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium">Air Quality Index (AQI)</h3>
          <p className="mt-1 text-gray-700">
            A measure of air pollution levels. Higher AQI values indicate higher levels of air pollution and greater health concerns.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherTerminology;
