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

    const now = new Date();
    const points: Position[] = [];

    // Calculate for 1.5 orbits to ensure continuity
    for (let i = 0; i <= 135; i += 5) {
      // 135 minutes = 1.5 orbits
      const date = new Date(now.getTime() + i * 60 * 1000);
      points.push(calculatePosition(date));
    }

    // Split path segments at antimeridian crossings
    const segments: Position[][] = [];
    let currentSegment: Position[] = [];

    points.forEach((point, index) => {
      if (index === 0) {
        currentSegment.push(point);
        return;
      }

      const prevLon = points[index - 1].longitude;
      const currLon = point.longitude;

      // Detect antimeridian crossing
      if (Math.abs(currLon - prevLon) > 180) {
        segments.push([...currentSegment]);
        currentSegment = [point];
      } else {
        currentSegment.push(point);
      }
    });

    segments.push(currentSegment);
    setOrbitPath(segments.flat());
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
    const svgWidth = 5760;
    const svgHeight = 2880;

    // Normalize longitude to [-180, 180]
    let normalizedLon = lon % 360;
    normalizedLon = normalizedLon > 180 ? normalizedLon - 360 : normalizedLon;

    const x = (normalizedLon + 180) * (svgWidth / 360);
    const y = (90 - lat) * (svgHeight / 180);

    return [x, y];
  };

  return (
    <div>
      <WorldMap>
        {/* Orbit path */}
        {orbitPath
          .reduce<Position[][]>((segments, point) => {
            if (segments.length === 0) return [[point]];
            const lastSegment = segments[segments.length - 1];
            const prevLon = lastSegment[lastSegment.length - 1].longitude;
            const currLon = point.longitude;

            if (Math.abs(currLon - prevLon) > 180) {
              segments.push([point]);
            } else {
              lastSegment.push(point);
            }
            return segments;
          }, [])
          .map((segment, i) => (
            <path
              key={i}
              d={segment
                .map((p, idx) => {
                  const [x, y] = projectToSVG(p.latitude, p.longitude);
                  return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
                })
                .join(" ")}
              stroke="#00ff00"
              fill="none"
              strokeWidth="50"
            />
          ))}
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
