import { Tle, VisibilitySampleRecord } from "../types";
import { expect, describe, it } from "vitest";
import { getDataFromDataDir } from "../helpers/filesystem";
import { calculateLookAngles } from "./calculateLookAngles";
import { calculateStateVector } from "./calculateStateVector";

describe("calculateLookAngles", () => {
  it("should return true if the satellite is above the horizon for every visible pass", async () => {
    let records = await getDataFromDataDir<VisibilitySampleRecord[]>(
      "sat_visibility_samples.json"
    );
    if (!records) {
      throw new Error("No data found");
    }

    records.forEach((record) => {
      record.satellites.forEach((satellite) => {
        satellite.visibility.forEach((pass) => {
          const startTime = new Date(pass.startingTime);
          const endTime = new Date(pass.endingTime);
          const time = new Date((startTime.getTime() + endTime.getTime()) / 2);

          const stateVector = calculateStateVector(time, satellite.tle);

          if (typeof stateVector === "string") {
            throw new Error("error calculating state vector");
          }

          const { lookAnglesInDegrees, isSatelliteAboveHorizon } =
            calculateLookAngles(stateVector, record.observerLocation);
          expect(isSatelliteAboveHorizon).toBe(true);
        });
      });
    });
  });
});
