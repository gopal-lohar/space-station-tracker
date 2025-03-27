import { getPosition } from "suncalc";

export function getSunElevationInDegrees(
  latitude: number,
  longitude: number,
  date: Date
): number {
  const sunPosition = getPosition(date, latitude, longitude);
  const sunElevation = sunPosition.altitude * (180 / Math.PI);
  return sunElevation;
}
