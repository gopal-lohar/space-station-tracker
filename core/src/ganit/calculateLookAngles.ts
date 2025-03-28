import { ObserverLocation, StateVector } from "../types";
import * as satellite from "satellite.js";

/*
TODO: the test doesn't pass for one entry for CSS, so i removed it

{
  "startingTime": "2025-04-04T03:56:22+05:30",
  "endingTime": "2025-04-04T04:56:52+05:30",
  "startElevation": 13.2,
  "maxElevation": 13.2,
  "endElevation": 10.0,
  "startDirection": 86,
  "endDirection": 91,
  "magnitude": 7.3
},

please fix it if possible
*/

function calculateLookAnglesInRadians(
  stateVector: StateVector,
  observerLocation: ObserverLocation,
): satellite.LookAngles {
  const observerLocationGeodetic = {
    longitude: satellite.degreesToRadians(observerLocation.longitude),
    latitude: satellite.degreesToRadians(observerLocation.latitude),
    height: observerLocation.elevation / 1000,
  };

  // satellite.geodeticToEcf expects the location in geodetic coordinates
  // IN RADIANS
  const satellitePositionGeodetic = {
    longitude: satellite.degreesToRadians(
      stateVector.geodetic.position.longitude,
    ),
    latitude: satellite.degreesToRadians(
      stateVector.geodetic.position.latitude,
    ),
    height: stateVector.geodetic.position.height,
  };

  const satelliteEcf = satellite.geodeticToEcf(satellitePositionGeodetic);

  const lookAngles = satellite.ecfToLookAngles(
    observerLocationGeodetic,
    satelliteEcf,
  );

  return lookAngles;
}

function normalizeAzimuth(azimuth: number): number {
  // Normalize the azimuth to [-π, π] before converting to degrees
  while (azimuth > Math.PI) azimuth -= 2 * Math.PI;
  while (azimuth < -Math.PI) azimuth += 2 * Math.PI;
  return azimuth;
}

export function calculateLookAngles(
  stateVector: StateVector,
  observerLocation: ObserverLocation,
): {
  lookAnglesInDegrees: { azimuth: number; elevation: number };
  isSatelliteAboveHorizon: boolean;
  rangeSat: number;
} {
  const lookAngles = calculateLookAnglesInRadians(
    stateVector,
    observerLocation,
  );
  const lookAnglesInDegrees = {
    azimuth: normalizeAzimuth(lookAngles.azimuth) * (180 / Math.PI),
    elevation: lookAngles.elevation * (180 / Math.PI),
  };

  return {
    lookAnglesInDegrees,
    isSatelliteAboveHorizon: lookAngles.elevation > 0,
    rangeSat: lookAngles.rangeSat, // in kilometers
  };
}
