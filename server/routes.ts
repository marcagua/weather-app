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

// Get API key from environment variables
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || "";
if (!OPENWEATHER_API_KEY) {
  console.warn("OpenWeather API key is missing. Weather data may not be available.");
}

// Base URL for OpenWeather API
const OPENWEATHER_API_BASE = "https://api.openweathermap.org/data/2.5";

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

      // Build query parameters
      let params: Record<string, string> = {
        appid: OPENWEATHER_API_KEY,
        units: "imperial" // US units (Fahrenheit)
      };

      if (query) {
        params.q = query;
      } else {
        params.lat = lat;
        params.lon = lon;
      }

      const response = await axios.get(`${OPENWEATHER_API_BASE}/weather`, { params });
      const validatedData = weatherResponseSchema.parse(response.data);
      
      // Cache the result
      weatherCache.set(cacheKey, validatedData);
      
      res.json(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(500).json({ message: "Invalid API response format", details: error.errors });
      } else if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || error.message;
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

      if (!query && (!lat || !lon)) {
        return res.status(400).json({ 
          message: "City name (q) or coordinates (lat, lon) are required" 
        });
      }

      let cacheKey = query ? `forecast_${query}` : `forecast_${lat}_${lon}`;
      let cachedData = weatherCache.get(cacheKey);

      if (cachedData) {
        return res.json(cachedData);
      }

      // Build query parameters
      let params: Record<string, string> = {
        appid: OPENWEATHER_API_KEY,
        units: "imperial", // US units (Fahrenheit)
        cnt: "40" // Get 5 days forecast with 3-hour step
      };

      if (query) {
        params.q = query;
      } else {
        params.lat = lat;
        params.lon = lon;
      }

      const response = await axios.get(`${OPENWEATHER_API_BASE}/forecast`, { params });
      const validatedData = forecastResponseSchema.parse(response.data);
      
      // Cache the result
      weatherCache.set(cacheKey, validatedData);
      
      res.json(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(500).json({ message: "Invalid API response format", details: error.errors });
      } else if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || error.message;
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

      if (!lat || !lon) {
        return res.status(400).json({ 
          message: "Coordinates (lat, lon) are required" 
        });
      }

      let cacheKey = `onecall_${lat}_${lon}`;
      let cachedData = weatherCache.get(cacheKey);

      if (cachedData) {
        return res.json(cachedData);
      }

      const params = {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
        units: "imperial",
        exclude: "minutely"
      };

      const response = await axios.get(`${OPENWEATHER_API_BASE}/onecall`, { params });
      
      // We only validate the alerts part as that's what we're interested in
      const alertsData = alertsResponseSchema.parse({
        alerts: response.data.alerts || []
      });
      
      // Cache and return the full response
      weatherCache.set(cacheKey, response.data);
      
      res.json(response.data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(500).json({ message: "Invalid API response format", details: error.errors });
      } else if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || error.message;
        res.status(status).json({ message });
      } else {
        res.status(500).json({ message: "Failed to fetch alerts data" });
      }
    }
  });

  // Get historical data for trends (using onecall/historical)
  router.get("/historical", async (req: Request, res: Response) => {
    try {
      const lat = req.query.lat as string;
      const lon = req.query.lon as string;
      const dt = req.query.dt as string; // Unix timestamp

      if (!lat || !lon || !dt) {
        return res.status(400).json({ 
          message: "Coordinates (lat, lon) and date (dt) are required" 
        });
      }

      let cacheKey = `historical_${lat}_${lon}_${dt}`;
      let cachedData = weatherCache.get(cacheKey);

      if (cachedData) {
        return res.json(cachedData);
      }

      const params = {
        lat,
        lon,
        dt,
        appid: OPENWEATHER_API_KEY,
        units: "imperial"
      };

      const response = await axios.get(`${OPENWEATHER_API_BASE}/onecall/timemachine`, { params });
      
      // Cache the result
      weatherCache.set(cacheKey, response.data);
      
      res.json(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || error.message;
        res.status(status).json({ message });
      } else {
        res.status(500).json({ message: "Failed to fetch historical data" });
      }
    }
  });

  // Get geocoding data
  router.get("/geocode", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      const limit = req.query.limit || "5";

      if (!query) {
        return res.status(400).json({ message: "Query parameter (q) is required" });
      }

      let cacheKey = `geocode_${query}`;
      let cachedData = weatherCache.get(cacheKey);

      if (cachedData) {
        return res.json(cachedData);
      }

      const params = {
        q: query,
        limit,
        appid: OPENWEATHER_API_KEY
      };

      const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, { params });
      
      // Cache the result
      weatherCache.set(cacheKey, response.data);
      
      res.json(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || error.message;
        res.status(status).json({ message });
      } else {
        res.status(500).json({ message: "Failed to fetch geocoding data" });
      }
    }
  });

  // Get reverse geocoding data
  router.get("/reverse-geocode", async (req: Request, res: Response) => {
    try {
      const lat = req.query.lat as string;
      const lon = req.query.lon as string;
      const limit = req.query.limit || "1";

      if (!lat || !lon) {
        return res.status(400).json({ message: "Coordinates (lat, lon) are required" });
      }

      let cacheKey = `reverse_geocode_${lat}_${lon}`;
      let cachedData = weatherCache.get(cacheKey);

      if (cachedData) {
        return res.json(cachedData);
      }

      const params = {
        lat,
        lon,
        limit,
        appid: OPENWEATHER_API_KEY
      };

      const response = await axios.get(`http://api.openweathermap.org/geo/1.0/reverse`, { params });
      
      // Cache the result
      weatherCache.set(cacheKey, response.data);
      
      res.json(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || error.message;
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
          description: "Comprehensive weather service with real-time and forecast weather data for global locations.",
          website: "https://www.weatherapi.com/"
        },
        {
          name: "OpenWeatherMap API",
          description: "Global weather data service providing current, forecast, and historical weather information.",
          website: "https://openweathermap.org/"
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
