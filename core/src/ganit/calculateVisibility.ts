import { ObserverLocation, StateVector } from "../types";
import { calculateLookAngles, normalizeAzimuth } from "./calculateLookAngles";
import { getSunElevationInDegrees } from "./sunCalculation";

interface VisibilityInfo {
  isVisible: boolean;
  isIlluminated: boolean;
  sunAtSatelliteElevationInDegrees: number;
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
  time: Date,
): VisibilityInfo {
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

  const isIlluminated = sunAtSatelliteElevationInDegrees > -0.83;
  const isObserverInDarkness = sunElevationInDegrees <= -6;
  const isSatelliteAboveHorizon = lookAnglesInDegrees.elevation > 10;

  return {
    isVisible: isIlluminated && isObserverInDarkness && isSatelliteAboveHorizon,
    isIlluminated,
    sunAtSatelliteElevationInDegrees,
    isObserverInDarkness,
    sunElevationInDegrees,
    isSatelliteAboveHorizon,
    lookAnglesInDegrees,
    distanceInKm: lookAngles.rangeSat,
  };
}
