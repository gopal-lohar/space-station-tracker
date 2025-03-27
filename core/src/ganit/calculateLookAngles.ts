import { ObserverLocation, StateVector } from "../types";
import * as satellite from "satellite.js";

export function calculateLookAngles(
  stateVector: StateVector,
  observerLocation: ObserverLocation
): satellite.LookAngles {
  const observerLocationGeodetic = {
    longitude: satellite.degreesToRadians(observerLocation.longitude),
    latitude: satellite.degreesToRadians(observerLocation.latitude),
    height: observerLocation.elevation / 1000,
  };
  const satellitePositionGeodetic = stateVector.geodetic.position;
  const satelliteEcf = satellite.geodeticToEcf(satellitePositionGeodetic);

  const lookAngles = satellite.ecfToLookAngles(
    observerLocationGeodetic,
    satelliteEcf
  );

  return lookAngles;
}

export function normalizeAzimuth(azimuth: number): number {
  // Normalize the azimuth to [-π, π] before converting to degrees
  while (azimuth > Math.PI) azimuth -= 2 * Math.PI;
  while (azimuth < -Math.PI) azimuth += 2 * Math.PI;
  return azimuth;
}
