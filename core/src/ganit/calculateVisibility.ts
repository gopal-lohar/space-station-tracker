import { ObserverLocation, StateVector } from "../types";
import * as satellite from "satellite.js";
import { calculateLookAngles, normalizeAzimuth } from "./calculateLookAngles";

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
}
