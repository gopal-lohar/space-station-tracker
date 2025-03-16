import { ObserverLocation, StateVector } from "./types";
import * as satellite from "satellite.js";

export function calculateVisibility(
  stateVector: StateVector,
  observerLocation: ObserverLocation,
  time: Date,
) {
  const lookAngles = calculateLookAngles(stateVector, observerLocation);
  console.log("LOOK ANGLES: ", lookAngles);
}

function calculateLookAngles(
  stateVector: StateVector,
  observerLocation: ObserverLocation,
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
    satelliteEcf,
  );

  return lookAngles;
}
