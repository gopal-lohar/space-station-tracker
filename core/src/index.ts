import * as satellite from "satellite.js";
import {
  calculateStateVector,
  calculateStateVectorRange,
} from "./ganit/calculateStateVector";
import { calculateVisibility } from "./ganit/calculateVisibility";
import { getCssTle, getIssTle, getTle, searchSatellites } from "./getTle";
import { formatTime } from "./helpers/utils";
import { ObserverLocation, StateVector } from "./types";

// Constants
const SECOND = 1000;
const MINUTE = SECOND * 60;

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

  const now = new Date("2025-03-30T20:10:30+05:30");
  const issStateVector = calculateStateVector(now, isstle);

  console.log("TIME NOW: ", formatTime(now));
  if (typeof issStateVector === "string") {
    console.error(
      `Something went wrong while calculating state vector. err: ${issStateVector}`
    );
  } else {
    console.log("ISS State Vector:", issStateVector);
  }

  const stateVectorRange = calculateStateVectorRange(
    isstle,
    now,
    new Date(now.getTime() + MINUTE * 5),
    30
  );

  console.log("\n\n Range: ", stateVectorRange);

  const visibilityInfo = calculateVisibility(
    issStateVector as StateVector,
    observerLocation,
    now
  );

  console.log("Current Time: ", formatTime(now));

  console.log("Visibility Info: ", visibilityInfo);

  console.log("\noperation completed");
  console.timeEnd("operation");
}

main();
