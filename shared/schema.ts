import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Original user table (keeping it for compatibility with existing code)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// New schemas for weather application
export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  lat: text("lat").notNull(),
  lon: text("lon").notNull(),
  country: text("country").notNull().default(''),
  lastUpdated: timestamp("last_updated"),
});

export const insertLocationSchema = createInsertSchema(locations).omit({
  id: true,
  lastUpdated: true,
});

export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Location = typeof locations.$inferSelect;

// Weather data types (used for API responses and local storage)
export const weatherResponseSchema = z.object({
  coord: z.object({
    lon: z.number(),
    lat: z.number(),
  }),
  weather: z.array(
    z.object({
      id: z.number(),
      main: z.string(),
      description: z.string(),
      icon: z.string(),
    })
  ),
  base: z.string(),
  main: z.object({
    temp: z.number(),
    feels_like: z.number(),
    temp_min: z.number(),
    temp_max: z.number(),
    pressure: z.number(),
    humidity: z.number(),
  }),
  visibility: z.number(),
  wind: z.object({
    speed: z.number(),
    deg: z.number(),
    gust: z.number().optional(),
  }),
  clouds: z.object({
    all: z.number(),
  }),
  rain: z.object({
    "1h": z.number().optional(),
    "3h": z.number().optional(),
  }).optional(),
  snow: z.object({
    "1h": z.number().optional(),
    "3h": z.number().optional(),
  }).optional(),
  dt: z.number(),
  sys: z.object({
    type: z.number().optional(),
    id: z.number().optional(),
    country: z.string(),
    sunrise: z.number(),
    sunset: z.number(),
  }),
  timezone: z.number(),
  id: z.number(),
  name: z.string(),
  cod: z.number().or(z.string()),
});

export const forecastResponseSchema = z.object({
  cod: z.string().or(z.number()),
  message: z.number(),
  cnt: z.number(),
  list: z.array(
    z.object({
      dt: z.number(),
      main: z.object({
        temp: z.number(),
        feels_like: z.number(),
        temp_min: z.number(),
        temp_max: z.number(),
        pressure: z.number(),
        sea_level: z.number().optional(),
        grnd_level: z.number().optional(),
        humidity: z.number(),
        temp_kf: z.number().optional(),
      }),
      weather: z.array(
        z.object({
          id: z.number(),
          main: z.string(),
          description: z.string(),
          icon: z.string(),
        })
      ),
      clouds: z.object({
        all: z.number(),
      }),
      wind: z.object({
        speed: z.number(),
        deg: z.number(),
        gust: z.number().optional(),
      }),
      visibility: z.number(),
      pop: z.number(), // probability of precipitation
      rain: z.object({
        "3h": z.number(),
      }).optional(),
      snow: z.object({
        "3h": z.number(),
      }).optional(),
      sys: z.object({
        pod: z.string(), // part of day (n/d)
      }).optional(),
      dt_txt: z.string(),
    })
  ),
  city: z.object({
    id: z.number(),
    name: z.string(),
    coord: z.object({
      lat: z.number(),
      lon: z.number(),
    }),
    country: z.string(),
    population: z.number().optional(),
    timezone: z.number(),
    sunrise: z.number(),
    sunset: z.number(),
  }),
});

export const alertsResponseSchema = z.object({
  alerts: z.array(
    z.object({
      sender_name: z.string(),
      event: z.string(),
      start: z.number(),
      end: z.number(),
      description: z.string(),
      tags: z.array(z.string()).optional(),
    })
  ).optional(),
});

export type WeatherResponse = z.infer<typeof weatherResponseSchema>;
export type ForecastResponse = z.infer<typeof forecastResponseSchema>;
export type AlertsResponse = z.infer<typeof alertsResponseSchema>;

// Historical data for trends
export const historicalWeatherSchema = z.object({
  daily: z.array(
    z.object({
      dt: z.number(),
      temp: z.object({
        day: z.number(),
        min: z.number(),
        max: z.number(),
      }),
      pressure: z.number(),
      humidity: z.number(),
      weather: z.array(
        z.object({
          id: z.number(),
          main: z.string(),
          description: z.string(),
          icon: z.string(),
        })
      ),
      precipitation: z.number().optional(),
    })
  ),
});

export type HistoricalWeather = z.infer<typeof historicalWeatherSchema>;
