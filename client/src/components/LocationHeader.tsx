import { useState, useEffect } from 'react';
import { MapPin, Search } from 'lucide-react';

interface LocationHeaderProps {
  location: string;
  onSearchClick: () => void;
}

export function LocationHeader({ location, onSearchClick }: LocationHeaderProps) {
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // Update time and date on component mount
    updateDateTime();
    
    // Update time every minute
    const intervalId = setInterval(updateDateTime, 60000);
    
    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);
  
  const updateDateTime = () => {
    const now = new Date();
    
    // Format date: Monday, October 16, 2023
    const dateOptions: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(now.toLocaleDateString('en-US', dateOptions));
    
    // Format time: 3:45 PM
    const timeOptions: Intl.DateTimeFormatOptions = { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    };
    setCurrentTime(now.toLocaleTimeString('en-US', timeOptions));
  };

  return (
    <header className="pt-8 pb-4 px-4 sm:px-6 md:px-8 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <MapPin className="mr-2" />
              {location || 'Loading location...'}
            </h1>
            <p className="text-lg opacity-90 mt-1">{currentDate}</p>
            <p className="text-lg opacity-90">{currentTime}</p>
          </div>
          
          <button 
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Search location"
            onClick={onSearchClick}
          >
            <Search className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default LocationHeader;
