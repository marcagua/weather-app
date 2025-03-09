import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import NodeCache from "node-cache";
import Parser from "rss-parser";
import { 
  weatherResponseSchema, 
  forecastResponseSchema, 
  alertsResponseSchema,
  historicalWeatherSchema
} from "@shared/schema";
import { z } from "zod";

// Cache for weather data with TTL of 30 minutes
const weatherCache = new NodeCache({ stdTTL: 1800 });

// WeatherAPI.com configuration
const WEATHER_API_KEY = "5c340d5092ac482287f13436250903";
const WEATHER_API_BASE = "https://api.weatherapi.com/v1";

export async function registerRoutes(app: Express): Promise<Server> {
  const router = express.Router();

  // Get current weather by city name
  router.get("/weather", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      const lat = req.query.lat as string;
      const lon = req.query.lon as string;

      if (!query && (!lat || !lon)) {
        return res.status(400).json({ 
          message: "City name (q) or coordinates (lat, lon) are required" 
        });
      }

      let cacheKey = query ? `weather_${query}` : `weather_${lat}_${lon}`;
      let cachedData = weatherCache.get(cacheKey);

      if (cachedData) {
        return res.json(cachedData);
      }

      // Build location parameter for WeatherAPI
      let location = query || `${lat},${lon}`;

      // Call WeatherAPI
      const response = await axios.get(`${WEATHER_API_BASE}/current.json`, { 
        params: {
          key: WEATHER_API_KEY,
          q: location,
          aqi: "no"
        }
      });
      
      // Transform WeatherAPI response to match the expected format
      const transformedData = {
        coord: {
          lon: response.data.location.lon,
          lat: response.data.location.lat,
        },
        weather: [{
          id: response.data.current.condition.code,
          main: response.data.current.condition.text,
          description: response.data.current.condition.text,
          icon: response.data.current.condition.icon,
        }],
        base: "stations",
        main: {
          temp: response.data.current.temp_f,
          feels_like: response.data.current.feelslike_f,
          temp_min: response.data.current.temp_f - 5, // Approximation
          temp_max: response.data.current.temp_f + 5, // Approximation
          pressure: response.data.current.pressure_mb,
          humidity: response.data.current.humidity,
        },
        visibility: response.data.current.vis_miles * 1609, // Converting miles to meters
        wind: {
          speed: response.data.current.wind_mph,
          deg: response.data.current.wind_degree,
          gust: response.data.current.gust_mph,
        },
        clouds: {
          all: response.data.current.cloud,
        },
        dt: Math.floor(new Date(response.data.current.last_updated).getTime() / 1000),
        sys: {
          country: response.data.location.country,
          sunrise: Math.floor(new Date(response.data.location.localtime).setHours(6, 0, 0, 0) / 1000), // Approximation
          sunset: Math.floor(new Date(response.data.location.localtime).setHours(18, 0, 0, 0) / 1000), // Approximation
        },
        timezone: response.data.location.localtime_epoch - Math.floor(Date.now() / 1000),
        id: 0,
        name: response.data.location.name,
        cod: 200,
      };
      
      // Cache the result
      weatherCache.set(cacheKey, transformedData);
      
      res.json(transformedData);
    } catch (error) {
      console.error("Weather API error:", error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.error?.message || error.message;
        res.status(status).json({ message });
      } else {
        res.status(500).json({ message: "Failed to fetch weather data" });
      }
    }
  });

  // Get forecast
  router.get("/forecast", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      const lat = req.query.lat as string;
      const lon = req.query.lon as string;
      const days = req.query.days as string || "5"; // Default to 5 days

      if (!query && (!lat || !lon)) {
        return res.status(400).json({ 
          message: "City name (q) or coordinates (lat, lon) are required" 
        });
      }

      let cacheKey = query ? `forecast_${query}_${days}` : `forecast_${lat}_${lon}_${days}`;
      let cachedData = weatherCache.get(cacheKey);

      if (cachedData) {
        return res.json(cachedData);
      }

      // Build location parameter for WeatherAPI
      let location = query || `${lat},${lon}`;

      // Call WeatherAPI
      const response = await axios.get(`${WEATHER_API_BASE}/forecast.json`, { 
        params: {
          key: WEATHER_API_KEY,
          q: location,
          days: days,
          aqi: "no",
          alerts: "yes"
        }
      });
      
      // Transform WeatherAPI response to match the expected forecast format
      const transformedData = {
        cod: "200",
        message: 0,
        cnt: response.data.forecast.forecastday.reduce(
          (count: number, day: any) => count + day.hour.length, 0
        ),
        list: response.data.forecast.forecastday.flatMap((day: any) => 
          day.hour.map((hour: any) => ({
            dt: Math.floor(new Date(hour.time).getTime() / 1000),
            main: {
              temp: hour.temp_f,
              feels_like: hour.feelslike_f,
              temp_min: hour.temp_f - 2, // Approximation
              temp_max: hour.temp_f + 2, // Approximation
              pressure: hour.pressure_mb,
              humidity: hour.humidity,
              sea_level: hour.pressure_mb,
              grnd_level: hour.pressure_mb,
            },
            weather: [{
              id: hour.condition.code,
              main: hour.condition.text,
              description: hour.condition.text,
              icon: hour.condition.icon,
            }],
            clouds: {
              all: hour.cloud
            },
            wind: {
              speed: hour.wind_mph,
              deg: hour.wind_degree,
              gust: hour.gust_mph,
            },
            visibility: hour.vis_miles * 1609, // Convert miles to meters
            pop: hour.chance_of_rain / 100, // Convert percentage to decimal
            rain: hour.precip_mm > 0 ? { "3h": hour.precip_mm * 0.0393701 } : undefined, // Convert mm to inches
            sys: {
              pod: new Date(hour.time).getHours() >= 6 && new Date(hour.time).getHours() < 18 ? 'd' : 'n'
            },
            dt_txt: hour.time
          }))
        ),
        city: {
          id: 0,
          name: response.data.location.name,
          coord: {
            lat: response.data.location.lat,
            lon: response.data.location.lon
          },
          country: response.data.location.country,
          population: 0,
          timezone: response.data.location.tz_id,
          sunrise: Math.floor(new Date(response.data.forecast.forecastday[0].astro.sunrise).getTime() / 1000),
          sunset: Math.floor(new Date(response.data.forecast.forecastday[0].astro.sunset).getTime() / 1000)
        }
      };
      
      // Cache the result
      weatherCache.set(cacheKey, transformedData);
      
      res.json(transformedData);
    } catch (error) {
      console.error("Forecast API error:", error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.error?.message || error.message;
        res.status(status).json({ message });
      } else {
        res.status(500).json({ message: "Failed to fetch forecast data" });
      }
    }
  });

  // Get weather alerts and one-call API (includes alerts)
  router.get("/onecall", async (req: Request, res: Response) => {
    try {
      const lat = req.query.lat as string;
      const lon = req.query.lon as string;
      const query = req.query.q as string;

      if (!query && (!lat || !lon)) {
        return res.status(400).json({ 
          message: "City name (q) or coordinates (lat, lon) are required" 
        });
      }

      let location = query || `${lat},${lon}`;
      let cacheKey = `onecall_${location}`;
      let cachedData = weatherCache.get(cacheKey);

      if (cachedData) {
        return res.json(cachedData);
      }

      // Call WeatherAPI forecast endpoint which includes alerts
      const response = await axios.get(`${WEATHER_API_BASE}/forecast.json`, { 
        params: {
          key: WEATHER_API_KEY,
          q: location,
          days: 3,
          aqi: "yes",
          alerts: "yes"
        }
      });
      
      // Transform to match expected onecall format
      const current = response.data.current;
      const location_data = response.data.location;
      const forecast = response.data.forecast;
      
      // Format alerts to match the expected schema
      const alerts = response.data.alerts?.alert?.map((alert: any) => ({
        sender_name: alert.headline || "WeatherAPI.com",
        event: alert.event || alert.desc || "Weather Alert",
        start: Math.floor(new Date(alert.effective).getTime() / 1000),
        end: Math.floor(new Date(alert.expires).getTime() / 1000),
        description: alert.desc,
        tags: [alert.category]
      })) || [];

      // Create a transformed response that matches the expected format
      const transformedData = {
        lat: location_data.lat,
        lon: location_data.lon,
        timezone: location_data.tz_id,
        timezone_offset: location_data.localtime_epoch - Math.floor(Date.now() / 1000),
        current: {
          dt: Math.floor(new Date(current.last_updated).getTime() / 1000),
          sunrise: Math.floor(new Date(forecast.forecastday[0].astro.sunrise).getTime() / 1000),
          sunset: Math.floor(new Date(forecast.forecastday[0].astro.sunset).getTime() / 1000),
          temp: current.temp_f,
          feels_like: current.feelslike_f,
          pressure: current.pressure_mb,
          humidity: current.humidity,
          dew_point: current.dewpoint_f,
          uvi: current.uv,
          clouds: current.cloud,
          visibility: current.vis_miles * 1609, // Convert miles to meters
          wind_speed: current.wind_mph,
          wind_deg: current.wind_degree,
          wind_gust: current.gust_mph,
          weather: [{
            id: current.condition.code,
            main: current.condition.text,
            description: current.condition.text,
            icon: current.condition.icon
          }]
        },
        hourly: forecast.forecastday.flatMap((day: any) => 
          day.hour.map((hour: any) => ({
            dt: Math.floor(new Date(hour.time).getTime() / 1000),
            temp: hour.temp_f,
            feels_like: hour.feelslike_f,
            pressure: hour.pressure_mb,
            humidity: hour.humidity,
            dew_point: hour.dewpoint_f,
            uvi: hour.uv,
            clouds: hour.cloud,
            visibility: hour.vis_miles * 1609,
            wind_speed: hour.wind_mph,
            wind_deg: hour.wind_degree,
            wind_gust: hour.gust_mph,
            weather: [{
              id: hour.condition.code,
              main: hour.condition.text,
              description: hour.condition.text,
              icon: hour.condition.icon
            }],
            pop: hour.chance_of_rain / 100
          }))
        ),
        daily: forecast.forecastday.map((day: any) => ({
          dt: Math.floor(new Date(day.date).getTime() / 1000),
          sunrise: Math.floor(new Date(day.astro.sunrise).getTime() / 1000),
          sunset: Math.floor(new Date(day.astro.sunset).getTime() / 1000),
          moonrise: Math.floor(new Date(day.astro.moonrise).getTime() / 1000),
          moonset: Math.floor(new Date(day.astro.moonset).getTime() / 1000),
          moon_phase: day.astro.moon_phase,
          temp: {
            day: day.day.avgtemp_f,
            min: day.day.mintemp_f,
            max: day.day.maxtemp_f,
            night: day.hour[22]?.temp_f || day.day.avgtemp_f,
            eve: day.hour[18]?.temp_f || day.day.avgtemp_f,
            morn: day.hour[8]?.temp_f || day.day.avgtemp_f
          },
          feels_like: {
            day: day.hour[12]?.feelslike_f || day.day.avgtemp_f,
            night: day.hour[22]?.feelslike_f || day.day.avgtemp_f,
            eve: day.hour[18]?.feelslike_f || day.day.avgtemp_f,
            morn: day.hour[8]?.feelslike_f || day.day.avgtemp_f
          },
          pressure: day.hour[12]?.pressure_mb || 1013,
          humidity: day.day.avghumidity,
          dew_point: day.hour[12]?.dewpoint_f || null,
          wind_speed: day.day.maxwind_mph,
          wind_deg: day.hour[12]?.wind_degree || 0,
          wind_gust: day.day.maxwind_mph * 1.5, // Approximation
          weather: [{
            id: day.day.condition.code,
            main: day.day.condition.text,
            description: day.day.condition.text,
            icon: day.day.condition.icon
          }],
          clouds: day.hour[12]?.cloud || 0,
          pop: day.day.daily_chance_of_rain / 100,
          rain: day.day.totalprecip_in || 0,
          uvi: day.day.uv
        })),
        alerts: {
          alerts: alerts
        }
      };
      
      // Cache the transformed data
      weatherCache.set(cacheKey, transformedData);
      
      res.json(transformedData);
    } catch (error) {
      console.error("Onecall API error:", error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.error?.message || error.message;
        res.status(status).json({ message });
      } else {
        res.status(500).json({ message: "Failed to fetch weather alerts data" });
      }
    }
  });

  // Get historical data for trends (using WeatherAPI history)
  router.get("/historical", async (req: Request, res: Response) => {
    try {
      const lat = req.query.lat as string;
      const lon = req.query.lon as string;
      const query = req.query.q as string;
      const dt = req.query.dt as string; // Unix timestamp or date string
      
      if ((!lat || !lon) && !query || !dt) {
        return res.status(400).json({ 
          message: "Coordinates (lat, lon) or query (q) and date (dt) are required" 
        });
      }

      const location = query || `${lat},${lon}`;
      let cacheKey = `historical_${location}_${dt}`;
      let cachedData = weatherCache.get(cacheKey);

      if (cachedData) {
        return res.json(cachedData);
      }

      // Convert unix timestamp to date string YYYY-MM-DD if needed
      let dateString;
      if (/^\d+$/.test(dt)) {
        // If dt is a unix timestamp
        const date = new Date(parseInt(dt) * 1000);
        dateString = date.toISOString().split('T')[0];
      } else {
        // If dt is already a date string
        dateString = dt;
      }

      const response = await axios.get(`${WEATHER_API_BASE}/history.json`, { 
        params: {
          key: WEATHER_API_KEY,
          q: location,
          dt: dateString
        }
      });
      
      // Transform to match expected historical data format
      const transformedData = {
        lat: response.data.location.lat,
        lon: response.data.location.lon,
        timezone: response.data.location.tz_id,
        timezone_offset: response.data.location.localtime_epoch - Math.floor(Date.now() / 1000),
        data: response.data.forecast.forecastday[0].hour.map((hour: any) => ({
          dt: Math.floor(new Date(hour.time).getTime() / 1000),
          temp: hour.temp_f,
          feels_like: hour.feelslike_f,
          pressure: hour.pressure_mb,
          humidity: hour.humidity,
          dew_point: hour.dewpoint_f,
          clouds: hour.cloud,
          visibility: hour.vis_miles * 1609, // Convert miles to meters
          wind_speed: hour.wind_mph,
          wind_deg: hour.wind_degree,
          weather: [{
            id: hour.condition.code,
            main: hour.condition.text,
            description: hour.condition.text,
            icon: hour.condition.icon
          }]
        }))
      };
      
      // Cache the result
      weatherCache.set(cacheKey, transformedData);
      
      res.json(transformedData);
    } catch (error) {
      console.error("Historical API error:", error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.error?.message || error.message;
        res.status(status).json({ message });
      } else {
        res.status(500).json({ message: "Failed to fetch historical data" });
      }
    }
  });

  // Get geocoding data using WeatherAPI search
  router.get("/geocode", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;

      if (!query) {
        return res.status(400).json({ message: "Query parameter (q) is required" });
      }

      let cacheKey = `geocode_${query}`;
      let cachedData = weatherCache.get(cacheKey);

      if (cachedData) {
        return res.json(cachedData);
      }

      const response = await axios.get(`${WEATHER_API_BASE}/search.json`, { 
        params: {
          key: WEATHER_API_KEY,
          q: query
        }
      });
      
      // Transform to match expected geocoding format
      const transformedData = response.data.map((location: any) => ({
        name: location.name,
        local_names: {
          en: location.name
        },
        lat: location.lat,
        lon: location.lon,
        country: location.country,
        state: location.region
      }));
      
      // Cache the result
      weatherCache.set(cacheKey, transformedData);
      
      res.json(transformedData);
    } catch (error) {
      console.error("Geocode API error:", error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.error?.message || error.message;
        res.status(status).json({ message });
      } else {
        res.status(500).json({ message: "Failed to fetch geocoding data" });
      }
    }
  });

  // Get reverse geocoding data using WeatherAPI
  router.get("/reverse-geocode", async (req: Request, res: Response) => {
    try {
      const lat = req.query.lat as string;
      const lon = req.query.lon as string;

      if (!lat || !lon) {
        return res.status(400).json({ message: "Coordinates (lat, lon) are required" });
      }

      let cacheKey = `reverse_geocode_${lat}_${lon}`;
      let cachedData = weatherCache.get(cacheKey);

      if (cachedData) {
        return res.json(cachedData);
      }

      // Use the regular weather endpoint to get location info
      const response = await axios.get(`${WEATHER_API_BASE}/current.json`, { 
        params: {
          key: WEATHER_API_KEY,
          q: `${lat},${lon}`
        }
      });
      
      // Transform to match expected reverse geocoding format
      const transformedData = [{
        name: response.data.location.name,
        local_names: {
          en: response.data.location.name
        },
        lat: response.data.location.lat,
        lon: response.data.location.lon,
        country: response.data.location.country,
        state: response.data.location.region
      }];
      
      // Cache the result
      weatherCache.set(cacheKey, transformedData);
      
      res.json(transformedData);
    } catch (error) {
      console.error("Reverse geocode API error:", error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.error?.message || error.message;
        res.status(status).json({ message });
      } else {
        res.status(500).json({ message: "Failed to fetch reverse geocoding data" });
      }
    }
  });

  // Save user's recent locations
  router.post("/locations", async (req: Request, res: Response) => {
    try {
      const { name, lat, lon, country } = req.body;
      
      if (!name || !lat || !lon) {
        return res.status(400).json({ message: "Name, latitude and longitude are required" });
      }
      
      const location = await storage.addLocation({ name, lat, lon, country });
      res.status(201).json(location);
    } catch (error) {
      res.status(500).json({ message: "Failed to save location" });
    }
  });

  // Get user's recent locations
  router.get("/locations", async (_req: Request, res: Response) => {
    try {
      const locations = await storage.getRecentLocations();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch locations" });
    }
  });

  // Get weather data from WeatherAPI for trends tab
  router.get("/weather-api", async (req: Request, res: Response) => {
    try {
      const location = req.query.location || 'Tagbilaran City';
      const cacheKey = `weatherapi_${location}`;
      let cachedData = weatherCache.get(cacheKey);

      if (cachedData) {
        return res.json(cachedData);
      }

      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=5c340d5092ac482287f13436250903&q=${encodeURIComponent(String(location))}&aqi=no`
      );
      
      // Cache the result for 30 minutes
      weatherCache.set(cacheKey, response.data, 1800);
      
      res.json(response.data);
    } catch (error: any) {
      console.error("Failed to fetch WeatherAPI data:", error);
      res.status(error.response?.status || 500).json({
        message: error.message || 'Failed to fetch data from WeatherAPI'
      });
    }
  });

  // Get Philippines news from RSS feeds for hazards and trends
  router.get("/philippines-news", async (_req: Request, res: Response) => {
    try {
      const parser = new Parser();
      const newsFeeds = {
        'GMA News': 'https://data.gmanetwork.com/gno/rss/news/nation/feed.xml',
        'Manila Bulletin': 'https://mb.com.ph/feed/',
        'Philippine Star': 'https://www.philstar.com/rss/nation',
        'ABS-CBN': 'https://news.abs-cbn.com/rss/news'
      };
      
      const cacheKey = 'philippines_news';
      let cachedData = weatherCache.get(cacheKey);
      
      if (cachedData) {
        return res.json(cachedData);
      }
      
      // Object to store results
      const newsItems: Record<string, any[]> = {};
      
      // Fetch from each feed
      for (const [source, url] of Object.entries(newsFeeds)) {
        try {
          const feed = await parser.parseURL(url);
          
          // Filter to only include news about typhoons, floods, earthquakes, etc.
          const weatherRelatedNews = feed.items.filter(item => {
            const title = (item.title || '').toLowerCase();
            const content = (item.content || item.contentSnippet || '').toLowerCase();
            
            const keywords = [
              'typhoon', 'bagyo', 'storm', 'cyclone', 'weather', 'rain', 'flood', 'baha',
              'earthquake', 'lindol', 'tsunami', 'volcanic', 'eruption', 'landslide', 
              'disaster', 'pagasa', 'phivolcs', 'climate', 'evacuate', 'evacuees', 'emergency',
              'rescue', 'temperature', 'heat', 'drought', 'rain', 'thunderstorm', 'tropical depression',
              'low pressure area', 'lpa'
            ];
            
            return keywords.some(keyword => 
              title.includes(keyword) || content.includes(keyword)
            );
          });
          
          // Take only the 5 most recent items
          newsItems[source] = weatherRelatedNews.slice(0, 5).map(item => ({
            title: item.title,
            link: item.link,
            date: item.pubDate || item.isoDate,
            content: item.contentSnippet || item.content,
            source
          }));
        } catch (error) {
          console.error(`Failed to fetch news from ${source}:`, error);
          newsItems[source] = [];
        }
      }
      
      // Cache the results for 30 minutes
      weatherCache.set(cacheKey, newsItems, 1800);
      
      res.json(newsItems);
    } catch (error) {
      console.error('Failed to fetch Philippines news:', error);
      res.status(500).json({ message: 'Failed to fetch news' });
    }
  });

  // Get reference information for weather data sources in the Philippines
  router.get("/references", (_req: Request, res: Response) => {
    const references = {
      weatherDataSources: [
        {
          name: "WeatherAPI.com",
          description: "Primary data source: Comprehensive weather service with real-time and forecast weather data for global locations.",
          website: "https://www.weatherapi.com/"
        },
        {
          name: "PAGASA",
          description: "Philippine Atmospheric, Geophysical and Astronomical Services Administration - the national meteorological agency of the Philippines.",
          website: "https://bagong.pagasa.dost.gov.ph/"
        },
        {
          name: "NOAH",
          description: "Nationwide Operational Assessment of Hazards - provides real-time flood and landslide warnings for the Philippines.",
          website: "http://noah.up.edu.ph/"
        },
        {
          name: "PHIVOLCS",
          description: "Philippine Institute of Volcanology and Seismology - monitors volcanic activity and earthquakes in the Philippines.",
          website: "https://www.phivolcs.dost.gov.ph/"
        },
        {
          name: "Philippines GIS Data",
          description: "Geographic Information System data for the Philippines.",
          website: "https://psa.gov.ph/gis"
        }
      ],
      emergencyContacts: [
        {
          name: "National Emergency Hotline",
          number: "911"
        },
        {
          name: "Philippine Red Cross",
          number: "143" 
        },
        {
          name: "NDRRMC Emergency Operations Center",
          number: "+63 (2) 8911-1406, +63 (2) 8912-2665"
        },
        {
          name: "PAGASA Weather Hotline",
          number: "+63 (2) 8927-1335"
        },
        {
          name: "PHIVOLCS Hotline",
          number: "+63 (2) 8929-9254"
        }
      ],
      disclaimer: "This application provides weather information for educational and informational purposes only. While we strive for accuracy, we make no guarantees regarding the completeness, reliability, or timeliness of the weather data. During severe weather events, always follow the official directives issued by local authorities such as PAGASA, NDRRMC, and local disaster risk reduction offices. Do not make critical decisions based solely on this application."
    };

    res.json(references);
  });

  // Register all routes under /api prefix
  app.use("/api", router);
  
  // Create HTTP server
  const httpServer = createServer(app);
  
  return httpServer;
}
