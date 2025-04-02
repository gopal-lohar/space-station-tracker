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
  console.error(
    "Although .env is not required, Error loading .env file:",
    result.error,
  );
}

export const config = {
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  },
  api: {
    tleUrl: process.env.TLE_API_URL || "http://tle.ivanstanojevic.me/api/tle",
  },
  noradIds: {
    iss: 25544,
    css: 48274,
  },
  nodeEnv: process.env.NODE_ENV || "development",
};
