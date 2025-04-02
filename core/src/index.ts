import { getCssTle, getIssTle, getTle, searchSatellites } from "./getTle";
import { formatTime, SECOND } from "./helpers/utils";
import { ObserverLocation, TLE, VisibilitySampleRecord } from "./types";
import { getDataFromDataDir } from "./helpers/filesystem";
import { computePasses } from "./ganit/computePasses";

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

  const passes = computePasses({
    startTime: new Date(record.recordDate),
    endTime: new Date(record.dataTill),
    observerLocation,
    tle: sat.tle,
    delta,
  });

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

main();

export { computePasses };
