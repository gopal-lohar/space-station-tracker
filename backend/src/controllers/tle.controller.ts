import { Request, Response } from "express";
import { Tle } from "space-station-tracker-core";
import { tleManager } from "../services/TleManager";
import { config } from "../config/env";

export function getTle(req: Request, res: Response): void {
  const satName = req.params.ssname.toLowerCase();

  if (!satName || (satName != "iss" && satName != "css")) {
    res.status(400).json({ error: "Invalid station name" });
  } else {
    const tle =
      satName === "css"
        ? tleManager.getTLEById(config.noradIds.css)
        : tleManager.getTLEById(config.noradIds.iss);
    if (!tle) {
      res.status(404).json({ error: "TLE not found" });
      return;
    }
    res.status(200).json(tle);
  }
}
