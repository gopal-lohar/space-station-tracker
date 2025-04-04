import { config } from "./config/env";

import express, { Request, Response } from "express";
import cors from "cors";
import { computePasses, getIssTle } from "space-station-tracker-core";
import { tleManager } from "./services/TleManager";

// Define interfaces
interface SSPosition {
  time: number;
  latitude: number;
  longitude: number;
  sunrise: Date;
  sunset: Date;
}

interface Pass {
  startingTime: string;
  endingTime: string;
  startElevation: number;
  maxElevation: number;
  endElevation: number;
  startDirection: number;
  endDirection: number;
  magnitude: number;
}

interface PassesResponse {
  time: number;
  passes: Pass[];
}

const app = express();
app.use(express.json());
app.use(cors());

const PORT = config.server.port;

app.get("/api/ss-position", (req, res) => {
  const ssPosition: SSPosition = {
    time: Date.now(),
    latitude: 0,
    longitude: 0,
    sunrise: new Date(Date.now() + 10000),
    sunset: new Date(Date.now() + 100),
  };

  res.json(ssPosition);
});

app.get("/api/passes", async (req, res) => {
  const latitude = Number(req.query.latitude);
  const longitude = Number(req.query.longitude);

  // Validate query parameters
  if (isNaN(latitude) || isNaN(longitude)) {
    res
      .status(400)
      .json({ error: "Valid latitude and longitude are required" });
    return;
  }

  // by default iss
  const { data: tle, error } = await tleManager.getTle(config.noradIds.iss);
  if (!tle || error) {
    res.status(500).json({ error: "Error fetching TLE data" });
    return;
  }

  let passes = [] as Pass[];

  if (tle) {
    passes = computePasses({
      delta: 1000 * 30,
      observerLocation: { latitude, longitude, elevation: 0 },
      startTime: new Date(new Date().toDateString()), // today at midnight
      endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
      tle,
    });
  }

  const passesData: PassesResponse = {
    time: Date.now(),
    passes,
  };

  res.json(passesData);
});

app.get("/", function (req: Request, res: Response) {
  res.send(
    "Space Station API - Use /api/ss-position or /api/passes?latitude=X&longitude=Y",
  );
});

async function main() {
  let error = await tleManager.updateTLEData();
  if (error) {
    console.error("Error updating TLE data:", error);
    return;
  }

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main();
