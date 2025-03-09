import { format } from 'date-fns';
import { AlertTriangle, Wind } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface WeatherAlert {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
  tags?: string[];
}

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
}

const WeatherAlerts = ({ alerts }: WeatherAlertsProps) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Weather Alerts</h2>
        <Alert className="bg-green-50 border-green-600 text-green-800">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
            <div>
              <AlertTitle className="text-green-800 font-semibold">No Active Weather Alerts</AlertTitle>
              <AlertDescription className="text-green-700 mt-1">
                There are currently no weather alerts or warnings for this location.
              </AlertDescription>
            </div>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Weather Alerts</h2>
      
      <div className="space-y-4">
        {alerts.map((alert, index) => {
          // Format time
          const startTime = format(new Date(alert.start * 1000), 'h:mm a');
          const endTime = format(new Date(alert.end * 1000), 'h:mm a');
          const endDate = format(new Date(alert.end * 1000), 'MMMM d');
          
          // Determine alert styling based on severity or type
          const isWarning = 
            alert.event.toLowerCase().includes('warning') || 
            alert.event.toLowerCase().includes('severe') ||
            alert.event.toLowerCase().includes('extreme');
          
          const alertClasses = isWarning
            ? "p-4 bg-warning/10 border-l-4 border-warning rounded-r-lg"
            : "p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg";
          
          const IconComponent = alert.event.toLowerCase().includes('wind') 
            ? Wind 
            : AlertTriangle;
          
          const iconClasses = isWarning
            ? "text-warning text-xl mt-0.5 mr-3"
            : "text-yellow-500 text-xl mt-0.5 mr-3";
          
          return (
            <div key={index} className={alertClasses}>
              <div className="flex items-start">
                <IconComponent className={`h-5 w-5 ${iconClasses}`} />
                <div>
                  <h3 className={isWarning ? "font-bold text-warning" : "font-bold text-yellow-700"}>
                    {alert.event}
                  </h3>
                  <p className="text-gray-700 mt-1">{alert.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Issued by {alert.sender_name} - Effective until {endDate} at {endTime}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherAlerts;
