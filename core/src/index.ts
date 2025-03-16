import {
  calculateStateVector,
  calculateStateVectorRange,
} from "./calculateStateVector";
import { getCssTle, getIssTle, getTle, searchSatellites } from "./getTle";
import * as satellite from "satellite.js";
import { formatTime } from "./helpers";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

async function main() {
  console.log("operation started\n");
  console.time("operation");

  const isstle = await getIssTle();
  const csstle = await getCssTle();

  const satrec = satellite.twoline2satrec(isstle.line1, isstle.line2);

  const now = new Date();
  const issStateVector = calculateStateVector(now, satrec);

  console.log("TIME NOW: ", formatTime(now));
  if (typeof issStateVector === "string") {
    console.error(
      `Something went wrong while calculating state vector. err: ${issStateVector}`,
    );
  } else {
    console.log("ISS State Vector:", issStateVector);
  }

  const stateVectorRange = calculateStateVectorRange(
    satrec,
    now,
    new Date(now.getTime() + MINUTE * 5),
    30,
  );

  console.log("\n\n Range: ", stateVectorRange);

  console.log("\noperation completed");
  console.timeEnd("operation");
}

main();
