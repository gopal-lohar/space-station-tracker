import { useCallback, useEffect, useState } from "react";
import { WorldMap } from "./WorldMap";
import { Tle } from "space-station-tracker-core";
import * as satellite from "satellite.js";

interface Position {
  latitude: number;
  longitude: number;
}

export function LeftPanel({ tle }: { tle: Tle }) {
  const [currentPosition, setCurrentPosition] = useState<Position>({
    latitude: 0,
    longitude: 0,
  });
  const [orbitPath, setOrbitPath] = useState<Position[]>([]);

  const calculatePosition = useCallback(
    (date: Date): Position => {
      if (!tle) return { latitude: 0, longitude: 0 };

      const satrec = satellite.twoline2satrec(tle.line1, tle.line2);
      const positionAndVelocity = satellite.propagate(satrec, date);
      const positionGd = satellite.eciToGeodetic(
        positionAndVelocity.position as satellite.EciVec3<number>,
        satellite.gstime(date),
      );

      return {
        latitude: satellite.degreesLat(positionGd.latitude),
        longitude: satellite.degreesLong(positionGd.longitude),
      };
    },
    [tle],
  );

  useEffect(() => {
    if (!tle) return;

    const points: Position[] = [];
    const now = new Date();

    // Calculate positions for next 90 minutes (full orbit)
    for (let i = 0; i <= 180; i += 5) {
      const date = new Date(now.getTime() + i * 60 * 500);
      points.push(calculatePosition(date));
    }

    setOrbitPath(points);
  }, [tle, calculatePosition]);

  // Update current position
  useEffect(() => {
    if (!tle) return;

    const interval = setInterval(() => {
      setCurrentPosition(calculatePosition(new Date()));
    }, 1000);

    return () => clearInterval(interval);
  }, [tle, calculatePosition]);

  const projectToSVG = (lat: number, lon: number): [number, number] => {
    const svgWidth = 5760; // SVG dimensions
    const svgHeight = 2880; // SVG dimensions

    const x = (lon + 180) * (svgWidth / 360);
    const y = (90 - lat) * (svgHeight / 180);

    return [x, y];
  };

  return (
    <div>
      <WorldMap>
        {/* Orbit path */}
        <path
          d={orbitPath
            .map((p, i) => {
              const [x, y] = projectToSVG(p.latitude, p.longitude);
              return `${i === 0 ? "M" : "L"} ${x} ${y}`;
            })
            .join(" ")}
          stroke="#00ff00"
          fill="none"
          strokeWidth="40"
        />
        {/* Current position */}
        {currentPosition && (
          <circle
            cx={
              projectToSVG(
                currentPosition.latitude,
                currentPosition.longitude,
              )[0]
            }
            cy={
              projectToSVG(
                currentPosition.latitude,
                currentPosition.longitude,
              )[1]
            }
            r="50"
            fill="#ff0000"
          />
        )}
      </WorldMap>

      {/* <div className="flex justify-between p-2">
        <div>Latitude: TBD</div>
        <div>Sunset: TBD</div>
      </div> */}
    </div>
  );
}
