import WorldMap from "./WorldMap";

export function LeftPanel() {
  return (
    <div className="">
      {/* <div
        className="size-2 bg-red-500 rounded-full absolute -translate-x-1/2 -translate-y-1/2"
        style={{ top: `${y}px`, left: `${x}px` }}
      ></div> */}

      <WorldMap />

      <div className="flex justify-between p-2">
        <div>Latitude: TBD</div>
        <div>Sunset: TBD</div>
      </div>
    </div>
  );
}
