import { EciVec3 } from "satellite.js";
import { StateVector } from "../types";

export function isIssIlluminated(
  stateVector: StateVector,
  date: Date
): boolean {
  // Constants
  const EARTH_RADIUS = 6371000; // Earth radius in meters

  // Get the position of the ISS in ECI coordinates
  const issPosition = stateVector.eci.position;

  // Calculate the position of the Sun in ECI coordinates
  const sunPosition = getSunPositionEci(date);

  // Vector from Earth center to ISS
  const earthToIss = {
    x: issPosition.x,
    y: issPosition.y,
    z: issPosition.z,
  };

  // Vector from Earth center to Sun
  const earthToSun = {
    x: sunPosition.x,
    y: sunPosition.y,
    z: sunPosition.z,
  };

  // Normalize the Earth-to-Sun vector
  const earthToSunMagnitude = Math.sqrt(
    earthToSun.x * earthToSun.x +
      earthToSun.y * earthToSun.y +
      earthToSun.z * earthToSun.z
  );

  const earthToSunNormalized = {
    x: earthToSun.x / earthToSunMagnitude,
    y: earthToSun.y / earthToSunMagnitude,
    z: earthToSun.z / earthToSunMagnitude,
  };

  // Calculate the dot product between the Earth-to-ISS vector and the Earth-to-Sun vector
  const dotProduct =
    earthToIss.x * earthToSunNormalized.x +
    earthToIss.y * earthToSunNormalized.y +
    earthToIss.z * earthToSunNormalized.z;

  // Project the Earth-to-ISS vector onto the Earth-to-Sun vector
  const projection = {
    x: earthToSunNormalized.x * dotProduct,
    y: earthToSunNormalized.y * dotProduct,
    z: earthToSunNormalized.z * dotProduct,
  };

  // Calculate the perpendicular distance from the ISS to the Earth-Sun line
  const perpendicularDistance = Math.sqrt(
    Math.pow(earthToIss.x - projection.x, 2) +
      Math.pow(earthToIss.y - projection.y, 2) +
      Math.pow(earthToIss.z - projection.z, 2)
  );

  // Check if the dot product is negative (ISS is on the opposite side of Earth from the Sun)
  // and if the perpendicular distance is less than Earth's radius
  const isInShadow = dotProduct < 0 && perpendicularDistance < EARTH_RADIUS;

  // The ISS is illuminated if it's not in Earth's shadow
  return !isInShadow;
}

function getSunPositionEci(date: Date): EciVec3<number> {
  // Calculate the number of days since J2000 epoch (January 1, 2000, 12:00 UTC)
  const j2000 = new Date("2000-01-01T12:00:00Z");
  const daysSinceJ2000 =
    (date.getTime() - j2000.getTime()) / (1000 * 60 * 60 * 24);

  // Calculate the mean anomaly of the Sun (in radians)
  const meanAnomalySun = (0.9856474 * daysSinceJ2000 * Math.PI) / 180;

  // Calculate the Sun's ecliptic longitude (in radians)
  const eclipticLongitudeSun =
    ((280.46 + 0.9856474 * daysSinceJ2000) * Math.PI) / 180;

  // Calculate the distance from Earth to Sun (in meters)
  const AU = 149597870700; // 1 Astronomical Unit in meters
  const distanceSun = (1.00014 - 0.01671 * Math.cos(meanAnomalySun)) * AU;

  // Calculate the Sun position in ecliptic coordinates
  const xEcliptic = distanceSun * Math.cos(eclipticLongitudeSun);
  const yEcliptic = distanceSun * Math.sin(eclipticLongitudeSun);
  const zEcliptic = 0; // Sun is always on the ecliptic plane

  // Convert to ECI (we're simplifying here by assuming the ecliptic is aligned with ECI)
  // For more precision, you'd need to account for obliquity of the ecliptic
  const obliquity = (23.439 * Math.PI) / 180; // Earth's axial tilt

  return {
    x: xEcliptic,
    y: yEcliptic * Math.cos(obliquity) - zEcliptic * Math.sin(obliquity),
    z: yEcliptic * Math.sin(obliquity) + zEcliptic * Math.cos(obliquity),
  };
}
