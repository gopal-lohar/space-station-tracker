import { calculateStateVector } from "./calculateStateVector";
import { calculateVisibility } from "./calculateVisibility";
import { ObserverLocation, Tle, Visibility } from "../types";
import { SECOND } from "../helpers/utils";

export function computePasses({
  startTime,
  endTime,
  observerLocation,
  tle,
  delta,
}: {
  startTime: Date;
  endTime: Date;
  observerLocation: ObserverLocation;
  tle: Tle;
  delta: number;
}): Visibility[] {
  let currentTime = startTime;

  const passes: Visibility[] = [];

  // loop over the time with 30 second as interval, if anywhere the sat is visible, get 30 seconds behind then loop second by second until it vanishes, then continue the 30 second interval
  while (currentTime < endTime) {
    const stateVector = calculateStateVector(currentTime, tle);
    if (typeof stateVector !== "string") {
      const currentVisibility = calculateVisibility(
        stateVector,
        observerLocation,
        currentTime
      );
      if (currentVisibility.isVisible) {
        const pass = calculatePass(
          new Date(currentTime.getTime() - delta),
          tle,
          observerLocation
        );
        if (typeof pass === "string") {
          console.error("Error calculating pass:", pass);
        } else {
          passes.push(pass.pass);
          currentTime = pass.endTime;
          continue;
        }
      }
    }
    currentTime = new Date(currentTime.getTime() + delta);
  }

  return passes;
}

function calculatePass(
  initialTime: Date,
  tle: Tle,
  observerLocation: ObserverLocation
):
  | {
      endTime: Date;
      pass: Visibility;
    }
  | string {
  let currentTime = initialTime;

  let currentVisibility = null;

  // skip time when the sat is not visible
  while (!currentVisibility?.isVisible) {
    const stateVector = calculateStateVector(currentTime, tle);
    if (typeof stateVector === "string") {
      return stateVector;
    }
    currentVisibility = calculateVisibility(
      stateVector,
      observerLocation,
      currentTime
    );

    currentTime = new Date(currentTime.getTime() + SECOND);
  }

  // for the time when the sat is visible
  const currentPass = {
    startingTime: currentTime.toISOString(),
    endingTime: currentTime.toISOString(),
    startElevation: currentVisibility.lookAnglesInDegrees.elevation,
    endElevation: currentVisibility.lookAnglesInDegrees.elevation,
    maxElevation: currentVisibility.lookAnglesInDegrees.elevation,
    startDirection: currentVisibility.lookAnglesInDegrees.azimuth,
    endDirection: currentVisibility.lookAnglesInDegrees.azimuth,
    magnitude: 0,
  };

  while (currentVisibility.isVisible) {
    const stateVector = calculateStateVector(currentTime, tle);
    if (typeof stateVector === "string") {
      return stateVector;
    }
    currentVisibility = calculateVisibility(
      stateVector,
      observerLocation,
      currentTime
    );
    currentPass.maxElevation = Math.max(
      currentPass.maxElevation,
      currentVisibility.lookAnglesInDegrees.elevation
    );
    currentTime = new Date(currentTime.getTime() + SECOND);
  }

  currentPass.endingTime = currentTime.toISOString();
  currentPass.endElevation = currentVisibility.lookAnglesInDegrees.elevation;
  currentPass.endDirection = currentVisibility.lookAnglesInDegrees.azimuth;

  return { endTime: currentTime, pass: currentPass };
}
