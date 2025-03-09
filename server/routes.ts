import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import type { WeatherData, Location, CurrentWeather, HourlyForecast, DailyForecast, WeatherAlert, Hazard } from "../shared/schema";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || "";
const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to get weather data by location name
  app.get("/api/weather", async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({ message: "Location query parameter is required" });
      }
      
      // Fetch coordinates first
      const geoResponse = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
        params: {
          q,
          limit: 1,
          appid: OPENWEATHER_API_KEY
        }
      });
      
      if (!geoResponse.data || geoResponse.data.length === 0) {
        return res.status(404).json({ message: "Location not found" });
      }
      
      const { lat, lon, name, state, country } = geoResponse.data[0];
      const locationName = state ? `${name}, ${state}` : `${name}, ${country}`;
      
      // Fetch current weather, hourly forecast and daily forecast
      const weatherResponse = await axios.get(`${OPENWEATHER_BASE_URL}/onecall`, {
        params: {
          lat,
          lon,
          exclude: 'minutely',
          units: 'imperial',
          appid: OPENWEATHER_API_KEY
        }
      });
      
      const data = weatherResponse.data;
      
      // Format response according to our schema
      const location: Location = {
        name: locationName,
        lat,
        lon
      };
      
      const current: CurrentWeather = {
        temperature: Math.round(data.current.temp),
        feelsLike: Math.round(data.current.feels_like),
        humidity: data.current.humidity,
        windSpeed: Math.round(data.current.wind_speed),
        windDirection: getWindDirection(data.current.wind_deg),
        condition: data.current.weather[0].main,
        icon: data.current.weather[0].icon,
        uvIndex: data.current.uvi,
        updatedAt: new Date(data.current.dt * 1000).toISOString()
      };
      
      // Process hourly forecast (next 24 hours)
      const hourly: HourlyForecast[] = data.hourly.slice(0, 24).map((hour: any) => ({
        time: new Date(hour.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        temperature: Math.round(hour.temp),
        condition: hour.weather[0].main,
        icon: hour.weather[0].icon
      }));
      
      // Process daily forecast
      const daily: DailyForecast[] = data.daily.slice(0, 7).map((day: any, index: number) => {
        const date = new Date(day.dt * 1000);
        return {
          date: date.toISOString(),
          day: index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' }),
          tempMin: Math.round(day.temp.min),
          tempMax: Math.round(day.temp.max),
          condition: day.weather[0].main,
          icon: day.weather[0].icon
        };
      });
      
      // Process alerts if any
      const alerts: WeatherAlert[] = data.alerts?.map((alert: any, index: number) => ({
        id: `alert-${index}`,
        type: alert.event,
        severity: getSeverity(alert.event),
        title: alert.event,
        description: alert.description,
        issuedAt: new Date(alert.start * 1000).toISOString(),
        expiresAt: new Date(alert.end * 1000).toISOString()
      })) || [];
      
      // Generate potential hazards based on conditions
      const hazards: Hazard[] = generatePotentialHazards(data);
      
      const weatherData: WeatherData = {
        location,
        current,
        hourly,
        daily,
        alerts,
        hazards
      };
      
      res.json(weatherData);
    } catch (error) {
      console.error("Weather API error:", error);
      res.status(500).json({ message: "Error fetching weather data" });
    }
  });

  // API endpoint to get weather data by lat/lon coordinates
  app.get("/api/weather/coordinates", async (req, res) => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ message: "Latitude and longitude parameters are required" });
      }
      
      // Fetch location name using reverse geocoding
      const geoResponse = await axios.get(`http://api.openweathermap.org/geo/1.0/reverse`, {
        params: {
          lat,
          lon,
          limit: 1,
          appid: OPENWEATHER_API_KEY
        }
      });
      
      if (!geoResponse.data || geoResponse.data.length === 0) {
        return res.status(404).json({ message: "Location not found" });
      }
      
      const { name, state, country } = geoResponse.data[0];
      const locationName = state ? `${name}, ${state}` : `${name}, ${country}`;
      
      // Fetch weather data
      const weatherResponse = await axios.get(`${OPENWEATHER_BASE_URL}/onecall`, {
        params: {
          lat,
          lon,
          exclude: 'minutely',
          units: 'imperial',
          appid: OPENWEATHER_API_KEY
        }
      });
      
      const data = weatherResponse.data;
      
      // Format the response (reusing the same formatting logic)
      const location: Location = {
        name: locationName,
        lat: parseFloat(lat as string),
        lon: parseFloat(lon as string)
      };
      
      const current: CurrentWeather = {
        temperature: Math.round(data.current.temp),
        feelsLike: Math.round(data.current.feels_like),
        humidity: data.current.humidity,
        windSpeed: Math.round(data.current.wind_speed),
        windDirection: getWindDirection(data.current.wind_deg),
        condition: data.current.weather[0].main,
        icon: data.current.weather[0].icon,
        uvIndex: data.current.uvi,
        updatedAt: new Date(data.current.dt * 1000).toISOString()
      };
      
      // Process hourly forecast (next 24 hours)
      const hourly: HourlyForecast[] = data.hourly.slice(0, 24).map((hour: any) => ({
        time: new Date(hour.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        temperature: Math.round(hour.temp),
        condition: hour.weather[0].main,
        icon: hour.weather[0].icon
      }));
      
      // Process daily forecast
      const daily: DailyForecast[] = data.daily.slice(0, 7).map((day: any, index: number) => {
        const date = new Date(day.dt * 1000);
        return {
          date: date.toISOString(),
          day: index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' }),
          tempMin: Math.round(day.temp.min),
          tempMax: Math.round(day.temp.max),
          condition: day.weather[0].main,
          icon: day.weather[0].icon
        };
      });
      
      // Process alerts if any
      const alerts: WeatherAlert[] = data.alerts?.map((alert: any, index: number) => ({
        id: `alert-${index}`,
        type: alert.event,
        severity: getSeverity(alert.event),
        title: alert.event,
        description: alert.description,
        issuedAt: new Date(alert.start * 1000).toISOString(),
        expiresAt: new Date(alert.end * 1000).toISOString()
      })) || [];
      
      // Generate potential hazards based on conditions
      const hazards: Hazard[] = generatePotentialHazards(data);
      
      const weatherData: WeatherData = {
        location,
        current,
        hourly,
        daily,
        alerts,
        hazards
      };
      
      res.json(weatherData);
    } catch (error) {
      console.error("Weather API error:", error);
      res.status(500).json({ message: "Error fetching weather data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

// Helper function to convert wind degrees to direction
function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

// Helper function to determine alert severity
function getSeverity(eventType: string): string {
  const severeEvents = ['Hurricane', 'Tornado', 'Tsunami', 'Extreme'];
  const moderateEvents = ['Storm', 'Wind', 'Flood', 'Rain', 'Snow', 'Advisory', 'Watch'];
  
  if (severeEvents.some(term => eventType.includes(term))) {
    return 'severe';
  } else if (moderateEvents.some(term => eventType.includes(term))) {
    return 'warning';
  }
  return 'info';
}

// Helper function to generate potential hazards
function generatePotentialHazards(data: any): Hazard[] {
  const hazards: Hazard[] = [];
  
  // Check high UV index
  if (data.current.uvi >= 6) {
    hazards.push({
      type: 'UV Risk',
      level: data.current.uvi >= 8 ? 'High' : 'Moderate',
      description: `UV Index of ${Math.round(data.current.uvi)} - Protection recommended`,
      icon: 'wb_sunny'
    });
  }
  
  // Check for lightning risk
  if (data.hourly.slice(0, 12).some((h: any) => 
    h.weather[0].main === 'Thunderstorm' || 
    h.weather[0].id >= 200 && h.weather[0].id < 300)) {
    hazards.push({
      type: 'Lightning Risk',
      level: 'Moderate',
      description: 'Thunderstorms possible in the next 12 hours',
      icon: 'flash_on'
    });
  }
  
  // Check for flood risk
  if (data.hourly.slice(0, 24).filter((h: any) => 
    h.weather[0].main === 'Rain' && h.rain && h.rain['1h'] >= 10).length >= 3) {
    hazards.push({
      type: 'Flood Risk',
      level: 'Moderate',
      description: 'Heavy rain may cause localized flooding',
      icon: 'water'
    });
  }
  
  // Check for fire danger (high temp, low humidity, high wind)
  if (data.current.temp > 85 && data.current.humidity < 30 && data.current.wind_speed > 15) {
    hazards.push({
      type: 'Fire Danger',
      level: 'High',
      description: 'Hot, dry, and windy conditions increase fire risk',
      icon: 'local_fire_department'
    });
  }
  
  // Check for extreme cold
  if (data.current.temp < 32) {
    hazards.push({
      type: 'Extreme Cold',
      level: data.current.temp < 0 ? 'Severe' : 'Moderate',
      description: 'Below freezing temperatures - Frostbite risk',
      icon: 'ac_unit'
    });
  }
  
  return hazards;
}
