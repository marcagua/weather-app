import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

// Weather-related schemas
export const locationSchema = z.object({
  name: z.string(),
  lat: z.number(),
  lon: z.number(),
});

export const currentWeatherSchema = z.object({
  temperature: z.number(),
  feelsLike: z.number(),
  humidity: z.number(),
  windSpeed: z.number(),
  windDirection: z.string(),
  condition: z.string(),
  icon: z.string(),
  uvIndex: z.number(),
  updatedAt: z.string(),
});

export const hourlyForecastSchema = z.object({
  time: z.string(),
  temperature: z.number(),
  condition: z.string(),
  icon: z.string(),
});

export const dailyForecastSchema = z.object({
  date: z.string(),
  day: z.string(),
  tempMin: z.number(),
  tempMax: z.number(), 
  condition: z.string(),
  icon: z.string(),
});

export const weatherAlertSchema = z.object({
  id: z.string(),
  type: z.string(),
  severity: z.string(),
  title: z.string(),
  description: z.string(),
  issuedAt: z.string(),
  expiresAt: z.string(),
});

export const hazardSchema = z.object({
  type: z.string(),
  level: z.string(),
  description: z.string(),
  icon: z.string(),
});

export type Location = z.infer<typeof locationSchema>;
export type CurrentWeather = z.infer<typeof currentWeatherSchema>;
export type HourlyForecast = z.infer<typeof hourlyForecastSchema>;
export type DailyForecast = z.infer<typeof dailyForecastSchema>;
export type WeatherAlert = z.infer<typeof weatherAlertSchema>;
export type Hazard = z.infer<typeof hazardSchema>;

// Comprehensive weather data
export const weatherDataSchema = z.object({
  location: locationSchema,
  current: currentWeatherSchema,
  hourly: z.array(hourlyForecastSchema),
  daily: z.array(dailyForecastSchema),
  alerts: z.array(weatherAlertSchema).optional(),
  hazards: z.array(hazardSchema).optional(),
});

export type WeatherData = z.infer<typeof weatherDataSchema>;
