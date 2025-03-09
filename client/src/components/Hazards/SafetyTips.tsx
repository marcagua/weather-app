import { AlertTriangle, Wind, Cloud, CloudRain, CloudSnow, Sun, Zap } from 'lucide-react';
import { CheckCircle } from 'lucide-react';

interface WeatherAlert {
  sender_name: string;
  event: string;
  description: string;
}

interface SafetyTipsProps {
  alerts: WeatherAlert[];
}

const SafetyTips = ({ alerts = [] }: SafetyTipsProps) => {
  // Determine which safety tips to show based on active alerts
  const alertTypes = alerts.map(alert => alert.event.toLowerCase());
  
  const showThunderstormTips = 
    alertTypes.some(type => 
      type.includes('thunder') || 
      type.includes('lightning') || 
      type.includes('storm')
    );
  
  const showWindTips = 
    alertTypes.some(type => 
      type.includes('wind') || 
      type.includes('tornado') || 
      type.includes('hurricane')
    );
  
  const showFloodTips = 
    alertTypes.some(type => 
      type.includes('flood') || 
      type.includes('rain')
    );
  
  const showWinterTips = 
    alertTypes.some(type => 
      type.includes('snow') || 
      type.includes('ice') || 
      type.includes('winter') || 
      type.includes('blizzard')
    );
  
  const showHeatTips = 
    alertTypes.some(type => 
      type.includes('heat') || 
      type.includes('hot')
    );
  
  // If no specific alerts, show general safety tips
  const showGeneral = !showThunderstormTips && !showWindTips && 
    !showFloodTips && !showWinterTips && !showHeatTips;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Safety Recommendations</h2>
      <div className="space-y-4">
        {showThunderstormTips && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-lg flex items-center">
              <Zap className="h-5 w-5 text-yellow-500 mr-2" />
              Thunderstorm Safety
            </h3>
            <ul className="mt-2 space-y-2 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                <span>Seek shelter indoors, away from windows</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                <span>Avoid using electrical equipment and plumbing</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                <span>If outdoors, stay away from tall objects and open areas</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                <span>Avoid metal objects, including wires, fences, and pipes</span>
              </li>
            </ul>
          </div>
        )}
        
        {showWindTips && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-lg flex items-center">
              <Wind className="h-5 w-5 text-blue-500 mr-2" />
              High Wind Safety
            </h3>
            <ul className="mt-2 space-y-2 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                <span>Secure loose outdoor items</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                <span>Stay away from downed power lines</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                <span>Use caution when driving, especially in high-profile vehicles</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                <span>Stay indoors during the height of the windstorm if possible</span>
              </li>
            </ul>
          </div>
        )}
        
        {showFloodTips && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-lg flex items-center">
              <CloudRain className="h-5 w-5 text-blue-700 mr-2" />
              Flood Safety
            </h3>
            <ul className="mt-2 space-y-2 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                <span>Never walk, swim, or drive through floodwaters</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                <span>Stay off bridges over fast-moving water</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                <span>Evacuate if told to do so by authorities</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                <span>Move to higher ground if flash flooding is possible</span>
              </li>
            </ul>
          </div>
        )}
        
        {showWinterTips && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-lg flex items-center">
              <CloudSnow className="h-5 w-5 text-blue-300 mr-2" />
              Winter Weather Safety
            </h3>
            <ul className="mt-2 space-y-2 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                <span>Stay indoors during the storm if possible</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                <span>Walk carefully on snowy, icy walkways</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                <span>Keep dry and change wet clothing frequently</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                <span>Avoid travel if possible, especially at night</span>
              </li>
            </ul>
          </div>
        )}
        
        {showHeatTips && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-lg flex items-center">
              <Sun className="h-5 w-5 text-orange-500 mr-2" />
              Extreme Heat Safety
            </h3>
            <ul className="mt-2 space-y-2 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                <span>Stay in air-conditioned buildings as much as possible</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                <span>Drink more water than usual, don't wait until you're thirsty</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                <span>Avoid direct sunlight and wear lightweight, light-colored clothing</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                <span>Check on friends, family, and neighbors, especially the elderly</span>
              </li>
            </ul>
          </div>
        )}
        
        {showGeneral && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-lg flex items-center">
              <AlertTriangle className="h-5 w-5 text-blue-500 mr-2" />
              General Weather Safety
            </h3>
            <ul className="mt-2 space-y-2 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                <span>Stay informed about current weather conditions</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                <span>Prepare an emergency kit with essentials</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                <span>Have a family communication plan in case of emergency</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                <span>Know the difference between a watch (be prepared) and warning (take action)</span>
              </li>
            </ul>
          </div>
        )}
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-lg flex items-center">
            <Cloud className="h-5 w-5 text-gray-500 mr-2" />
            Weather Preparedness
          </h3>
          <ul className="mt-2 space-y-2 text-gray-700">
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
              <span>Keep flashlights, batteries, and a weather radio handy</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
              <span>Store at least a three-day supply of non-perishable food</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
              <span>Have one gallon of water per person per day for at least three days</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
              <span>Charge phones and backup batteries before severe weather</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SafetyTips;
