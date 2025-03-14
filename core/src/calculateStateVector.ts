import * as satellite from "satellite.js";
import { StateVector } from "./types";

export function calculateStateVector(
  time: Date,
  satrec: satellite.SatRec,
): StateVector | string {
  // Get position in Earth-Centered Inertial (ECI) coordinates
  const positionAndVelocity = satellite.propagate(satrec, time);

  const positionEciOrBool = positionAndVelocity.position;
  const velocityEciOrBool = positionAndVelocity.velocity;

  // Get GMST for coordinate conversion
  const gmst = satellite.gstime(time);

  if (
    typeof positionEciOrBool === "boolean" ||
    typeof velocityEciOrBool === "boolean" ||
    !positionEciOrBool ||
    !velocityEciOrBool
  ) {
    return "Failed to calculate position and velocity";
  }

  const positionEci = positionEciOrBool as satellite.EciVec3<number>;
  const velocityEci = velocityEciOrBool as satellite.EciVec3<number>;

  // Convert to geographic coordinates
  const positionGd = satellite.eciToGeodetic(positionEci, gmst);

  // Calculate velocity magnitude
  const velocityMagnitude = Math.sqrt(
    Math.pow(positionEci.x, 2) +
      Math.pow(positionEci.y, 2) +
      Math.pow(positionEci.z, 2),
  );

  return {
    geodetic: {
      position: {
        latitude: satellite.degreesLat(positionGd.latitude),
        longitude: satellite.degreesLong(positionGd.longitude),
        altitude: positionGd.height,
      },
      velocity: velocityMagnitude,
    },
    eci: {
      position: positionEci,
      velocity: velocityEci,
    },
  };
}
