import { Pass } from "../queries";

export default function PassDetails({
  pass,
  next,
}: {
  pass: Pass;
  next: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">{next ? "Next" : ""} Pass Details</h2>
      <div className="grid gap-4">
        <div className="flex items-center justify-between gap-4">
          <span>Start Time</span>
          <span>{new Date(pass.startingTime).toLocaleTimeString()}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>End Time</span>
          <span>{new Date(pass.endingTime).toLocaleTimeString()}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Start Elevation</span>
          <span>{pass.startElevation}&deg;</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>End Elevation</span>
          <span>{pass.endElevation}&deg;</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Start Direction</span>
          <span>{pass.startDirection}&deg;</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>End Direction</span>
          <span>{pass.endDirection}&deg;</span>
        </div>
      </div>
    </div>
  );
}
