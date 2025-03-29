import * as satellite from "satellite.js";
import {
  calculateStateVector,
  calculateStateVectorRange,
} from "./ganit/calculateStateVector";
import { calculateVisibility } from "./ganit/calculateVisibility";
import { getCssTle, getIssTle, getTle, searchSatellites } from "./getTle";
import { formatTime } from "./helpers/utils";
import {
  ObserverLocation,
  StateVector,
  Visibility,
  VisibilitySampleRecord,
} from "./types";
import { getDataFromDataDir } from "./helpers/filesystem";

// Constants
const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const observerLocation: ObserverLocation = {
  latitude: 26.231896,
  longitude: 78.205714,
  elevation: 205,
};

async function main() {
  console.log("operation started\n");
  console.time("operation");

  // trying of emulate the go behavior for error handing (idk why)
  const { data: isstle, error: isstleError } = await getIssTle();
  const { data: csstle, error: csstleError } = await getCssTle();

  if (!isstle || !csstle || isstleError || csstleError) {
    console.error("Failed to fetch TLE data");
    console.error("Error fetching ISS TLE:", isstleError);
    console.error("Error fetching CSS TLE:", csstleError);
    return;
  }

  let records = await getDataFromDataDir<VisibilitySampleRecord[]>(
    "sat_visibility_samples.json"
  );
  if (!records) {
    throw new Error("No data found");
  }
  const record = records[0];
  const observerLocation = record.observerLocation;
  const now = new Date(record.recordDate);

  const stateVectorRange = calculateStateVectorRange(
    isstle,
    now,
    new Date(now.getTime() + DAY * 11),
    30
  );

  console.log("\n\n Range: ", stateVectorRange.stateVectors.length);

  // calculate passes
  let visible = false;
  let passes: Visibility[] = [];
  let currentPass: Visibility | null = null;

  stateVectorRange.stateVectors.forEach((vec) => {
    let visibility = calculateVisibility(
      vec.stateVector,
      observerLocation,
      vec.time
    );
    if (!visible && visibility.isVisible) {
      // when the sat starts being visible
      visible = true;
      currentPass = {
        startingTime: vec.time.toISOString(),
        endingTime: vec.time.toISOString(),
        startElevation: visibility.lookAnglesInDegrees.elevation,
        endElevation: visibility.lookAnglesInDegrees.elevation,
        maxElevation: visibility.lookAnglesInDegrees.elevation,
        startDirection: visibility.lookAnglesInDegrees.azimuth,
        endDirection: visibility.lookAnglesInDegrees.azimuth,
        magnitude: NaN,
      };
    } else if (visible && visibility.isVisible) {
      // when the sat starts being visible
      if (currentPass) {
        currentPass.maxElevation = Math.max(
          currentPass.maxElevation,
          visibility.lookAnglesInDegrees.elevation
        );
      }
    } else if (visible && !visibility.isVisible) {
      // when the sat stops being visible
      if (currentPass) {
        currentPass.endingTime = vec.time.toISOString();
        currentPass.endElevation = visibility.lookAnglesInDegrees.elevation;
        currentPass.endDirection = visibility.lookAnglesInDegrees.azimuth;
        passes.push(currentPass);
      }
      visible = false;
      currentPass = null;
    }
  });

  console.log("Calculated passes");
  passes.forEach((viz) => {
    console.log(
      `start: ${formatTime(new Date(viz.startingTime), "IST")}, end: ${formatTime(new Date(viz.endingTime), "IST")}`
    );
    console.log(viz);
  });

  console.log("\n\nPasses");

  record.satellites[0].visibility.forEach((sample) => {
    console.log(
      `start: ${formatTime(new Date(sample.startingTime), "IST")}, end: ${formatTime(new Date(sample.endingTime), "IST")}`
    );
  });

  console.log("\noperation completed");
  console.timeEnd("operation");
}

main();
