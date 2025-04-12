import { Request, Response } from "express";
import { tleManager } from "../services/TleManager";
import { config } from "../config/env";
import { computePasses, Pass } from "space-station-tracker-core";

export async function getPasses(req: Request, res: Response): Promise<void> {
  const satName = req.params.ssname.toLowerCase();

  if (!satName || (satName != "iss" && satName != "css")) {
    res.status(400).json({ error: "Invalid station name" });
  } else {
    const latitude = Number(req.query.latitude);
    const longitude = Number(req.query.longitude);

    const PERIOD = 1000 * 60 * 60 * 24 * 30; // 30 days in milliseconds

    // Validate query parameters
    if (isNaN(latitude) || isNaN(longitude)) {
      res
        .status(400)
        .json({ error: "Valid latitude and longitude are required" });
      return;
    }

    const { data: tle, error } = await tleManager.getTle(
      satName === "css" ? config.noradIds.css : config.noradIds.iss,
    );
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
        endTime: new Date(Date.now() + PERIOD),
        tle,
      });
    }

    res.json(passes);
  }
}
