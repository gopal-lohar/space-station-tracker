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
  TLE,
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
    console.error("No Sample data found");
    return;
  }

  // TODO: these calculations suggests that
  // the illumination algorithm is not quite right, it is overshooting

  const delta = SECOND * 30;
  const record = records[0];
  const sat = record.satellites[0];
  const observerLocation = record.observerLocation;
  const startTime = new Date(record.recordDate);
  let currentTime = startTime;
  const endTime = new Date(record.dataTill);
  const passes: Visibility[] = [];

  // loop over the time with 30 second interval, if anywhere the sat is visible, get 30 seconds behind then loop second by second until it vanishes, then continue the 30 second interval
  while (currentTime < endTime) {
    const stateVector = calculateStateVector(currentTime, sat.tle);
    if (typeof stateVector !== "string") {
      const currentVisibility = calculateVisibility(
        stateVector,
        observerLocation,
        currentTime
      );
      if (currentVisibility.isVisible) {
        const pass = calculatePass(
          new Date(currentTime.getTime() - delta),
          sat.tle,
          observerLocation
        );
        if (typeof pass === "string") {
          console.error("Error calculating pass:", pass);
        } else {
          passes.push(pass.pass);
          currentTime = pass.endTime;
          continue;
        }
      }
    }
    currentTime = new Date(currentTime.getTime() + delta);
  }

  console.log("Calculated passes");
  passes.forEach((viz) => {
    console.log(
      `start: ${formatTime(new Date(viz.startingTime), "IST")}, end: ${formatTime(new Date(viz.endingTime), "IST")}`
    );
    console.log(viz);
  });

  console.log("\n\nSample Passes");

  record.satellites[0].visibility.forEach((sample) => {
    console.log(
      `start: ${formatTime(new Date(sample.startingTime), "IST")}, end: ${formatTime(new Date(sample.endingTime), "IST")}`
    );
  });

  console.log("\noperation completed");
  console.timeEnd("operation");
}

function calculatePass(
  initialTime: Date,
  tle: TLE,
  observerLocation: ObserverLocation
):
  | {
      endTime: Date;
      pass: Visibility;
    }
  | string {
  let currentTime = initialTime;

  let currentVisibility = null;

  // skip time when the sat is not visible
  while (!currentVisibility?.isVisible) {
    const stateVector = calculateStateVector(currentTime, tle);
    if (typeof stateVector === "string") {
      return stateVector;
    }
    currentVisibility = calculateVisibility(
      stateVector,
      observerLocation,
      currentTime
    );

    currentTime = new Date(currentTime.getTime() + SECOND);
  }

  // for the time when the sat is visible
  const currentPass = {
    startingTime: currentTime.toISOString(),
    endingTime: currentTime.toISOString(),
    startElevation: currentVisibility.lookAnglesInDegrees.elevation,
    endElevation: currentVisibility.lookAnglesInDegrees.elevation,
    maxElevation: currentVisibility.lookAnglesInDegrees.elevation,
    startDirection: currentVisibility.lookAnglesInDegrees.azimuth,
    endDirection: currentVisibility.lookAnglesInDegrees.azimuth,
    magnitude: 0,
  };

  while (currentVisibility.isVisible) {
    const stateVector = calculateStateVector(currentTime, tle);
    if (typeof stateVector === "string") {
      return stateVector;
    }
    currentVisibility = calculateVisibility(
      stateVector,
      observerLocation,
      currentTime
    );
    currentPass.maxElevation = Math.max(
      currentPass.maxElevation,
      currentVisibility.lookAnglesInDegrees.elevation
    );
    currentTime = new Date(currentTime.getTime() + SECOND);
  }

  currentPass.endingTime = currentTime.toISOString();
  currentPass.endElevation = currentVisibility.lookAnglesInDegrees.elevation;
  currentPass.endDirection = currentVisibility.lookAnglesInDegrees.azimuth;

  return { endTime: currentTime, pass: currentPass };
}

main();
