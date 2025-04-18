// this file exist because appearently
// import dotenv from 'dotenv';
// dotenv.config();
// has some loading order problems (not the require one but the import one) [i should watch less youtube]

import dotenv from "dotenv";
import path from "path";

const result = dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

if (result.error) {
  console.log(".env not found so falling back to default values");
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

export const config = {
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  },
  api: {
    tleUrl: process.env.TLE_API_URL || "https://tle.ivanstanojevic.me/api/tle",
    cacheAgeInMs: 12 * HOUR,
  },
  noradIds: {
    iss: 25544,
    css: 48274,
  },
  nodeEnv: process.env.NODE_ENV || "development",
};
