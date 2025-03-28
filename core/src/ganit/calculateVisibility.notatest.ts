import { TLE, VisibilitySampleRecord } from "../types";
import { calculateStateVector } from "./calculateStateVector";
import { calculateVisibility } from "./calculateVisibility";
import { expect, describe, it } from "vitest";
import fs from "fs";
import { getDataFromDataDir } from "../helpers/filesystem";

describe("#calculateVisibility", () => {
  it("should return visible if iss is visible in sample data", async () => {
    let records = await getDataFromDataDir<VisibilitySampleRecord[]>(
      "sat_visibility_samples.json",
    );
    if (!records) {
      throw new Error("No data found");
    }
    let record = records[0];
    let viz = record.ISS.visibility[0];
    let time = new Date(viz.startingTime);
    const issStateVector = calculateStateVector(time, record.ISS.tle);
    if (typeof issStateVector !== "object") {
      throw new Error("Invalid state vector");
    }
    const visibility = calculateVisibility(
      issStateVector,
      record.observerLocation,
      time,
    );
    expect(visibility.isObserverInDarkness).toBe(true);
    expect(visibility.isSatelliteAboveHorizon).toBe(true);
    expect(visibility.isIlluminated).toBe(true);
    expect(visibility.isVisible).toBe(true);
  });
});
