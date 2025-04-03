import axios from "axios";
import fs from "fs";
import path from "path";
import { config } from "../config/env";
import { Tle } from "space-station-tracker-core";
import { ApiResponse } from "space-station-tracker-core/dist/types";

async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  let error = null;
  let data: T | null = null;
  try {
    const res = await axios.get<T>(url);
    data = res.data;
  } catch (err) {
    error = `Something went wrong: ${err}`;
  }

  return {
    data,
    error,
  };
}

interface CachedData {
  timestamp: string;
  data: Tle[];
}

class TLEManager {
  private tleData: Map<number, Tle> = new Map();
  private lastFetchTime: Date | null = null;
  private noradIds: number[] = [];
  private readonly apiUrl: string;
  private readonly cacheFile: string;
  private readonly cacheMaxAge: number; // in milliseconds

  constructor() {
    this.apiUrl = config.api.tleUrl;
    this.noradIds = [config.noradIds.iss, config.noradIds.css];
    this.cacheMaxAge = config.api.cacheAgeInMs;

    this.cacheFile = path.resolve(process.cwd(), "tle-cache.json");
  }

  async loadFromCache(): Promise<boolean> {
    try {
      if (!fs.existsSync(this.cacheFile)) {
        console.log("Cache file does not exist");
        return false;
      }

      const fileContent = fs.readFileSync(this.cacheFile, "utf-8");
      const cachedData: CachedData = JSON.parse(fileContent);

      const cachedTimestamp = new Date(cachedData.timestamp);
      const now = new Date();
      const cacheAge = now.getTime() - cachedTimestamp.getTime();

      if (cacheAge > this.cacheMaxAge) {
        console.log("Cache is too old, not using it");
        return false;
      }

      this.lastFetchTime = cachedTimestamp;

      // Clear existing data and load from cache
      this.tleData.clear();
      for (const tle of cachedData.data) {
        this.tleData.set(tle.satelliteId, tle);
      }

      console.log(
        `Loaded ${cachedData.data.length} TLEs from cache, last updated: ${cachedTimestamp.toISOString()}`,
      );

      return true;
    } catch (error) {
      console.error("Error loading from cache:", error);
      return false;
    }
  }

  private saveToCache(): void {
    try {
      const cachedData: CachedData = {
        timestamp:
          this.lastFetchTime?.toISOString() || new Date().toISOString(),
        data: this.getAllTLEs(),
      };

      fs.writeFileSync(
        this.cacheFile,
        JSON.stringify(cachedData, null, 2),
        "utf-8",
      );
      console.log(`Saved ${cachedData.data.length} TLEs to cache`);
    } catch (error) {
      console.error("Error saving to cache:", error);
    }
  }

  async getTle(noradId: number): Promise<ApiResponse<Tle>> {
    return await fetchData(`${this.apiUrl}/${noradId}`);
  }

  async fetchTLEData(): Promise<{ data: Tle[] | null; error: string | null }> {
    const tles: Tle[] = [];
    for (const noradId of this.noradIds) {
      const { data: tle, error } = await this.getTle(noradId);
      if (error) {
        console.error(`Error fetching TLE for NORAD ID ${noradId}:`, error);
        return { data: null, error };
      }
      if (tle) {
        tles.push(tle);
      }
    }

    return { data: tles, error: null };
  }

  // Update the in-memory TLE data
  async updateTLEData(forceUpdate = false): Promise<string | null> {
    if (!forceUpdate) {
      const loadedFromCache = await this.loadFromCache();
      if (loadedFromCache) {
        return null;
      }
    }

    console.log(`Updating TLE data from API at ${new Date().toISOString()}`);
    const { data: tleData, error } = await this.fetchTLEData();

    if (!tleData || error) {
      return `Failed to update TLE data: ${error}`;
    }

    // Clear existing data and update with new data
    this.tleData.clear();
    for (const tle of tleData) {
      this.tleData.set(tle.satelliteId, tle);
    }

    this.saveToCache();
    console.log(`TLE data updated with ${tleData.length} entries`);

    return null;
  }

  getAllTLEs(): Tle[] {
    return Array.from(this.tleData.values());
  }

  getTLEById(satelliteId: number): Tle | undefined {
    return this.tleData.get(satelliteId);
  }

  getLastFetchTime(): Date | null {
    return this.lastFetchTime;
  }

  hasData(): boolean {
    return this.tleData.size > 0;
  }
}

export const tleManager = new TLEManager();
