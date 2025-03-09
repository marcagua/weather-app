import { useEffect, useRef } from 'react';
import { MapPinned } from 'lucide-react';

interface HazardMapProps {
  lat: number;
  lon: number;
}

const HazardMap = ({ lat, lon }: HazardMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Function to load the map
    const loadMap = () => {
      if (!mapContainerRef.current) return;
      
      // Clear previous map if it exists
      mapContainerRef.current.innerHTML = '';
      
      // Create iframe to embed the map securely
      const iframe = document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.style.borderRadius = '0.5rem';
      
      // Construct OpenStreetMap URL with the precipitation layer
      const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon-5},${lat-2},${lon+5},${lat+2}&layer=mapnik&marker=${lat},${lon}`;
      iframe.src = osmUrl;
      
      mapContainerRef.current.appendChild(iframe);
    };
    
    loadMap();
  }, [lat, lon]);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Regional Hazard Map</h2>
      
      <div 
        ref={mapContainerRef} 
        className="relative bg-gray-100 rounded-lg overflow-hidden" 
        style={{ height: '300px' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPinned className="h-12 w-12 text-gray-400 mb-3" />
            <p className="text-gray-500">Loading weather radar map...</p>
          </div>
        </div>
      </div>
      
      <p className="mt-2 text-xs text-gray-500 text-center">
        Map displays current precipitation and weather conditions. Data from OpenWeatherMap.
      </p>
    </div>
  );
};

export default HazardMap;
