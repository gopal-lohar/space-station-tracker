import { ObserverLocation, StateVector } from "../types";
import { calculateLookAngles, normalizeAzimuth } from "./calculateLookAngles";
import { getSunElevationInDegrees } from "./sunCalculation";

export function calculateVisibility(
  stateVector: StateVector,
  observerLocation: ObserverLocation,
  time: Date,
) {
  const lookAngles = calculateLookAngles(stateVector, observerLocation);
  const lookAnglesInDegrees = {
    azimuth: normalizeAzimuth(lookAngles.azimuth) * (180 / Math.PI),
    elevation: lookAngles.elevation * (180 / Math.PI),
  };
  const sunElevationInDegrees = getSunElevationInDegrees(
    observerLocation.latitude,
    observerLocation.longitude,
    time,
  );
  const sunAtSatelliteElevationInDegrees = getSunElevationInDegrees(
    stateVector.geodetic.position.latitude,
    stateVector.geodetic.position.longitude,
    time,
  );
}
