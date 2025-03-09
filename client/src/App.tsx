import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Weather from "@/pages/Weather";
import Hazards from "@/pages/Hazards";
import Trends from "@/pages/Trends";
import References from "@/pages/References";
import Header from "./components/weather/Header";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { WeatherData } from "@shared/schema";

function Router() {
  const [location, navigate] = useLocation();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string>("");
  const [currentDateTime, setCurrentDateTime] = useState<string>("");
  
  // Update current date and time every minute
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formattedDateTime = format(now, "EEEE, MMM d • h:mm a");
      setCurrentDateTime(formattedDateTime);
    };
    
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Initial fetch for San Francisco as default
  useEffect(() => {
    fetchWeatherData("San Francisco, CA");
  }, []);

  const fetchWeatherData = async (query: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/weather?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch weather data");
      }
      
      const data = await response.json();
      setWeatherData(data);
      setCurrentLocation(data.location.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeatherByCoordinates = async (latitude: number, longitude: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/weather/coordinates?lat=${latitude}&lon=${longitude}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch weather data");
      }
      
      const data = await response.json();
      setWeatherData(data);
      setCurrentLocation(data.location.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    fetchWeatherData(query);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoordinates(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          setError(`Geolocation error: ${error.message}`);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  };

  return (
    <div className="min-h-screen max-w-xl mx-auto pb-8 flex flex-col">
      <Header 
        locationName={currentLocation}
        dateTime={currentDateTime}
        temperature={weatherData?.current.temperature}
        condition={weatherData?.current.condition}
        isLoading={isLoading}
      />
      
      <nav className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex" role="tablist">
          <button 
            className={`flex-1 py-3 px-1 text-sm font-medium border-b-2 transition-colors duration-150 
              ${location === "/" ? "border-primary text-primary" : "border-transparent text-textSecondary hover:text-textPrimary"}`}
            onClick={() => navigate("/")}
            role="tab"
            aria-selected={location === "/"}
          >
            Weather
          </button>
          <button 
            className={`flex-1 py-3 px-1 text-sm font-medium border-b-2 transition-colors duration-150 
              ${location === "/hazards" ? "border-primary text-primary" : "border-transparent text-textSecondary hover:text-textPrimary"}`}
            onClick={() => navigate("/hazards")}
            role="tab"
            aria-selected={location === "/hazards"}
          >
            Hazards
          </button>
          <button 
            className={`flex-1 py-3 px-1 text-sm font-medium border-b-2 transition-colors duration-150 
              ${location === "/trends" ? "border-primary text-primary" : "border-transparent text-textSecondary hover:text-textPrimary"}`}
            onClick={() => navigate("/trends")}
            role="tab"
            aria-selected={location === "/trends"}
          >
            Trends
          </button>
          <button 
            className={`flex-1 py-3 px-1 text-sm font-medium border-b-2 transition-colors duration-150 
              ${location === "/references" ? "border-primary text-primary" : "border-transparent text-textSecondary hover:text-textPrimary"}`}
            onClick={() => navigate("/references")}
            role="tab"
            aria-selected={location === "/references"}
          >
            References
          </button>
        </div>
      </nav>
      
      <main className="flex-1 px-4 md:px-6 pt-4">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <Switch>
          <Route path="/" component={() => <Weather weatherData={weatherData} isLoading={isLoading} />} />
          <Route path="/hazards" component={() => <Hazards weatherData={weatherData} isLoading={isLoading} />} />
          <Route path="/trends" component={() => <Trends weatherData={weatherData} isLoading={isLoading} />} />
          <Route path="/references" component={References} />
          <Route component={NotFound} />
        </Switch>
      </main>

      <div className="px-4 md:px-6 mt-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="text-sm font-medium mb-3">Search Location</div>
          <div className="flex">
            <input 
              type="text" 
              className="flex-1 border border-gray-200 rounded-l-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" 
              placeholder="City, ZIP code, or address"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch((e.target as HTMLInputElement).value);
                }
              }}
            />
            <button 
              className="bg-primary text-white rounded-r-lg px-4 flex items-center justify-center"
              onClick={() => {
                const input = document.querySelector('input') as HTMLInputElement;
                handleSearch(input.value);
              }}
            >
              <span className="material-icons text-sm">search</span>
            </button>
          </div>
          <div className="mt-3 flex items-center text-sm text-primary">
            <span className="material-icons text-sm mr-1">my_location</span>
            <button onClick={handleUseCurrentLocation}>Use my current location</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
