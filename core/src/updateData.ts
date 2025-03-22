// This file is for checking and updating the tle data into the /data directory
// to see how often does tle's update and for copy pasting purposes
// the data directory is NOT ignored in git - for keeping previous data for testing/comparision etc
// for testing/comparision etc

import fs from "fs/promises";
import { getTle, satelliteIds } from "./getTle";
import { formatTime } from "./helpers";
import { TLE } from "./types";

const DATA_DIR = "./data";

interface SatelliteData {
  name: string;
  satelliteId: number;
  tle: TLE[];
}

async function ensureDataDirExists(): Promise<boolean> {
  let error = false;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    error = true;
  }
  return true;
}

async function getStoredTleData(satelliteId: number): Promise<TLE[] | null> {
  const filePath = `${DATA_DIR}/norad-${satelliteId}.json`;
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

async function updateTleFile(satellite: SatelliteData[]) {
  for (const sat of satellite) {
    const filePath = `${DATA_DIR}/norad-${sat.satelliteId}.json`;
    await fs.writeFile(filePath, JSON.stringify(sat.tle));
  }
}

async function updateData(satellites: SatelliteData[]) {
  console.log("");
  console.log("Starting Update");
  console.log(`Time: ${formatTime(new Date())}`);
  for (const satellite of satellites) {
    console.log("Fetching data for ", satellite.name);
    let { data: satelliteTle, error: tleError } = await getTle(
      satellite.satelliteId
    );
    if (!satelliteTle || tleError) {
      console.error("Failed to fetch TLE data");
      console.error("Error fetching TLE:", tleError);
      continue;
    }

    satelliteTle = {
      satelliteId: satellite.satelliteId,
      name: satellite.name,
      date: satelliteTle.date,
      line1: satelliteTle.line1,
      line2: satelliteTle.line2,
    };

    if (
      satellite.tle.length === 0 ||
      satellite.tle[0].date !== satelliteTle.date
    ) {
      console.log(`New TLE data for ${satellite.name}`);
      satellite.tle.unshift(satelliteTle);
      await updateTleFile(satellites);
    } else {
      console.log(`No TLE updates for ${satellite.name}`);
    }
  }
  console.log("");
}

function formatMs(diffMs: number) {
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  diffMs %= 1000 * 60 * 60 * 24;

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  diffMs %= 1000 * 60 * 60;

  const minutes = Math.floor(diffMs / (1000 * 60));
  diffMs %= 1000 * 60;

  const seconds = Math.floor(diffMs / 1000);

  return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
}

function getUpdateStats(satellites: SatelliteData[]) {
  satellites.forEach((satellite) => {
    console.log("\n For ", satellite.name);
    let updateInterval = 0;
    let lastUpdateTime: Date | null = null;
    satellite.tle.forEach((tle) => {
      if (!lastUpdateTime) {
        lastUpdateTime = new Date(tle.date);
      } else {
        updateInterval =
          lastUpdateTime.getTime() - new Date(tle.date).getTime();
        console.log("Update Interval: ", formatMs(updateInterval));
        lastUpdateTime = new Date(tle.date);
      }
    });
  });
}

async function check(fetchInterval: number) {
  await ensureDataDirExists();

  let satellites: SatelliteData[] = [
    {
      name: "ISS",
      satelliteId: satelliteIds.iss,
      tle: ((await getStoredTleData(satelliteIds.iss)) || []) as TLE[],
    },
    {
      name: "CSS",
      satelliteId: satelliteIds.css,
      tle: ((await getStoredTleData(satelliteIds.css)) || []) as TLE[],
    },
  ];

  console.log("Stored Data: ", satellites, "\n");
  getUpdateStats(satellites);

  updateData(satellites);
  setInterval(() => {
    updateData(satellites);
  }, fetchInterval);
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const fetchInterval = 6 * HOUR;
check(fetchInterval);
