import { Telescope } from "lucide-react";
import { Pass } from "../queries";

export default function PassesPanel({
  passes,
  selectedPass,
  setSelectedPass,
}: {
  passes: Pass[];
  selectedPass: number;
  setSelectedPass: React.Dispatch<React.SetStateAction<number>>;
}) {
  let lastPassDate: string | null = null;
  return (
    <div className="space-y-2">
      {passes.map((pass, passIndex) => {
        const showDate =
          lastPassDate !== new Date(pass.startingTime).toLocaleDateString();
        lastPassDate = new Date(pass.startingTime).toLocaleDateString();
        return (
          <>
            {showDate && (
              <div className="mt-4 flex items-center gap-2">
                <Telescope />
                <span>{new Date(pass.startingTime).toLocaleDateString()}</span>
              </div>
            )}
            <div
              className={`flex justify-between items-center p-4 border cursor-pointer ${passIndex === selectedPass ? "border-gray-700" : "border-gray-900"}`}
              onClick={() => setSelectedPass(passIndex)}
            >
              <div className="text-lg font-bold">ISS</div>
              <div className="flex flex-col">
                <span>{new Date(pass.startingTime).toLocaleTimeString()}</span>
                <span>{new Date(pass.endingTime).toLocaleTimeString()}</span>
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
}
