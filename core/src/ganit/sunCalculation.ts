import { getPosition } from "suncalc";
import { ObserverLocation } from "../types";

export function sunCalculation(
  observerLocation: ObserverLocation,
  time: Date
): { sunElevationInDegrees: number; isObserverInDarkness: boolean } {
  const sunPosition = getPosition(
    time,
    observerLocation.latitude,
    observerLocation.longitude
  );
  const sunElevationInDegrees = sunPosition.altitude * (180 / Math.PI);
  const isObserverInDarkness = sunElevationInDegrees <= -6;

  return {
    sunElevationInDegrees,
    isObserverInDarkness,
  };
}
