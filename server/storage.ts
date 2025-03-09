import { locations, type Location, type InsertLocation } from "@shared/schema";

// Modify the interface with CRUD methods needed for weather app
export interface IStorage {
  getUser(id: number): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  
  // Weather app specific methods
  addLocation(location: InsertLocation): Promise<Location>;
  getRecentLocations(limit?: number): Promise<Location[]>;
  getLocationByCoordinates(lat: string, lon: string): Promise<Location | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, any>;
  private locationStorage: Map<number, Location>;
  userCurrentId: number;
  locationCurrentId: number;

  constructor() {
    this.users = new Map();
    this.locationStorage = new Map();
    this.userCurrentId = 1;
    this.locationCurrentId = 1;
  }

  async getUser(id: number): Promise<any | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = this.userCurrentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Weather app specific methods
  async addLocation(insertLocation: InsertLocation): Promise<Location> {
    // Check if location already exists
    const existingLocation = await this.getLocationByCoordinates(
      insertLocation.lat, 
      insertLocation.lon
    );
    
    if (existingLocation) {
      // Update lastUpdated timestamp
      const updatedLocation = {
        ...existingLocation,
        lastUpdated: new Date()
      };
      this.locationStorage.set(existingLocation.id, updatedLocation);
      return updatedLocation;
    }

    // Create new location
    const id = this.locationCurrentId++;
    const newLocation: Location = {
      ...insertLocation,
      id,
      lastUpdated: new Date()
    };
    
    this.locationStorage.set(id, newLocation);
    return newLocation;
  }

  async getRecentLocations(limit: number = 5): Promise<Location[]> {
    // Sort by lastUpdated (most recent first) and limit the results
    return Array.from(this.locationStorage.values())
      .sort((a, b) => {
        const dateA = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
        const dateB = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, limit);
  }

  async getLocationByCoordinates(lat: string, lon: string): Promise<Location | undefined> {
    const approxMatch = Array.from(this.locationStorage.values()).find(
      (location) => {
        // Very simple approximate matching - in a real app, we'd use a radius check
        return location.lat === lat && location.lon === lon;
      }
    );
    
    return approxMatch;
  }
}

// Export a singleton instance
export const storage = new MemStorage();
