import { useQuery } from "@tanstack/react-query";
import WorldMap from "./WorldMap";
import { queries } from "../queries";

export function LeftPanel() {
  const ssPositionQuery = useQuery(queries.ssPositionQuery);

  return (
    <div className="">
      {/* <div
        className="size-2 bg-red-500 rounded-full absolute -translate-x-1/2 -translate-y-1/2"
        style={{ top: `${y}px`, left: `${x}px` }}
      ></div> */}

      <WorldMap />
      {ssPositionQuery.data && (
        <div className="flex justify-between p-2">
          <div>Latitude: {ssPositionQuery.data.latitude}</div>
          <div>Sunset: {ssPositionQuery.data.longitude}</div>
        </div>
      )}
    </div>
  );
}
