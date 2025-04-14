import { WorldMap } from "./WorldMap";

export function LeftPanel() {
  return (
    <div>
      <WorldMap></WorldMap>

      <div className="flex justify-between p-2">
        <div>Latitude: TBD</div>
        <div>Sunset: TBD</div>
      </div>
    </div>
  );
}
