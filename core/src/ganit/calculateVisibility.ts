import { ObserverLocation, StateVector } from "../types";
import { calculateLookAngles, normalizeAzimuth } from "./calculateLookAngles";
import { isIssIlluminated } from "./isIlluminated";
import { getSunElevationInDegrees } from "./sunCalculation";

interface VisibilityInfo {
  isVisible: boolean;
  isIlluminated: boolean;
  isObserverInDarkness: boolean;
  sunElevationInDegrees: number;
  isSatelliteAboveHorizon: boolean;
  lookAnglesInDegrees: {
    azimuth: number;
    elevation: number;
  };
  distanceInKm: number;
}

export function calculateVisibility(
  stateVector: StateVector,
  observerLocation: ObserverLocation,
  time: Date
): VisibilityInfo {
  const lookAngles = calculateLookAngles(stateVector, observerLocation);
  const lookAnglesInDegrees = {
    azimuth: normalizeAzimuth(lookAngles.azimuth) * (180 / Math.PI),
    elevation: lookAngles.elevation * (180 / Math.PI),
  };
  const sunElevationInDegrees = getSunElevationInDegrees(
    observerLocation.latitude,
    observerLocation.longitude,
    time
  );

  const isIlluminated = isIssIlluminated(stateVector, time);
  const isObserverInDarkness = sunElevationInDegrees <= -6;
  const isSatelliteAboveHorizon = lookAnglesInDegrees.elevation > 0;

  return {
    isVisible: isIlluminated && isObserverInDarkness && isSatelliteAboveHorizon,
    isIlluminated,
    isObserverInDarkness,
    sunElevationInDegrees,
    isSatelliteAboveHorizon,
    lookAnglesInDegrees,
    distanceInKm: lookAngles.rangeSat,
  };
}
