import { calculateStateVector } from "./calculateStateVector";
import { getCssTle, getIssTle, getTle, searchSatellites } from "./getTle";
import * as satellite from "satellite.js";

async function main() {
  console.log("operation started");
  console.time("operation");

  const isstle = await getIssTle();
  const csstle = await getCssTle();

  const satrec = satellite.twoline2satrec(isstle.line1, isstle.line2);
  const now = new Date();

  const issStateVector = calculateStateVector(now, satrec);

  console.log("current iss state vector", issStateVector);

  console.timeEnd("operation");
  console.log("operation completed");
}

main();
