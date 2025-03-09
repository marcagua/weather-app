import { useState, useEffect } from 'react';
import { X, Search, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from "@/hooks/use-toast";

interface LocationSearchProps {
  isVisible: boolean;
  onClose: () => void;
  onLocationSelect: (location: any) => void;
}

interface GeocodingResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export function LocationSearch({ isVisible, onClose, onLocationSelect }: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentLocations, setRecentLocations] = useState<GeocodingResult[]>([]);
  const { toast } = useToast();

  // Fetch recent locations
  useEffect(() => {
    if (isVisible) {
      fetchRecentLocations();
    }
  }, [isVisible]);

  const fetchRecentLocations = async () => {
    try {
      const res = await apiRequest('GET', '/api/locations', undefined);
      const data = await res.json();
      setRecentLocations(data);
    } catch (error) {
      console.error('Failed to fetch recent locations:', error);
    }
  };

  // Fetch location results based on search query
  const { data: searchResults, isLoading } = useQuery({
    queryKey: [`/api/geocode?q=${encodeURIComponent(searchQuery)}`],
    enabled: searchQuery.length > 2,
  });

  // Get current location
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Get location name from coordinates
            const res = await apiRequest(
              'GET', 
              `/api/reverse-geocode?lat=${latitude}&lon=${longitude}`, 
              undefined
            );
            const data = await res.json();
            
            if (data && data.length > 0) {
              const location = {
                name: data[0].name,
                lat: latitude,
                lon: longitude,
                country: data[0].country
              };
              
              onLocationSelect(location);
              saveLocation(location);
            } else {
              toast({ 
                title: "Location Error", 
                description: "Couldn't determine your location name.",
                variant: "destructive" 
              });
            }
          } catch (error) {
            toast({ 
              title: "Location Error", 
              description: "Failed to get your current location.",
              variant: "destructive" 
            });
          }
        },
        (error) => {
          let message = "Location access denied.";
          if (error.code === error.TIMEOUT) {
            message = "Location request timed out.";
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            message = "Location information unavailable.";
          }
          
          toast({ 
            title: "Location Error", 
            description: message,
            variant: "destructive" 
          });
        }
      );
    } else {
      toast({ 
        title: "Location Not Supported", 
        description: "Geolocation is not supported by your browser.",
        variant: "destructive" 
      });
    }
  };

  const handleLocationSelect = (location: GeocodingResult) => {
    onLocationSelect(location);
    saveLocation(location);
    onClose();
  };

  const saveLocation = async (location: GeocodingResult) => {
    try {
      await apiRequest('POST', '/api/locations', {
        name: location.name,
        lat: location.lat.toString(),
        lon: location.lon.toString(),
        country: location.country
      });
    } catch (error) {
      console.error('Failed to save location:', error);
    }
  };

  // If not visible, don't render
  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 px-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Search Location</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4">
          <div className="relative mb-4">
            <Input
              type="text"
              placeholder="City or ZIP code"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pr-10"
            />
            <span className="absolute right-3 top-3 text-gray-400">
              <Search className="h-5 w-5" />
            </span>
          </div>
          
          <Button 
            variant="secondary"
            className="flex items-center justify-center w-full py-3 mb-4"
            onClick={handleGetCurrentLocation}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Use my current location
          </Button>
          
          {/* Search Results */}
          {searchQuery.length > 2 && (
            <div className="mt-2 mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Search Results</h3>
              
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {searchResults.map((location: GeocodingResult, index: number) => (
                    <Button
                      key={`${location.name}-${index}`}
                      variant="outline"
                      className="flex items-center w-full p-3 text-left justify-start font-normal h-auto"
                      onClick={() => handleLocationSelect(location)}
                    >
                      <MapPin className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                      <span>
                        {location.name}
                        {location.state && `, ${location.state}`}
                        {location.country && ` (${location.country})`}
                      </span>
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No locations found</p>
              )}
            </div>
          )}
          
          {/* Recent Locations */}
          {recentLocations.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Locations</h3>
              <div className="space-y-2">
                {recentLocations.map((location, index) => (
                  <Button
                    key={`recent-${index}`}
                    variant="outline"
                    className="flex items-center w-full p-3 text-left justify-start font-normal h-auto"
                    onClick={() => handleLocationSelect(location)}
                  >
                    <MapPin className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                    <span>
                      {location.name}
                      {location.country && ` (${location.country})`}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LocationSearch;
