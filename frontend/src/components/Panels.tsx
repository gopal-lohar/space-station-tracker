import { useQuery } from "@tanstack/react-query";
import { LeftPanel } from "./LeftPanel";
import PassDetails from "./PassDetails";
import PassesPanel from "./PassesPanel";
import { Pass, queries } from "../queries";
import { useState } from "react";

export default function Panels() {
  const passesQuery = useQuery(queries.passesQuery);
  return (
    <div className="grid gap-8 h-[calc(100%-5rem)] pb-4 grid-cols-3">
      <LeftPanel />
      {passesQuery.error ? (
        <div className="col-span-2">Error Loading Data</div>
      ) : passesQuery.isLoading ? (
        <div className="col-span-2">Loading...</div>
      ) : !passesQuery.data ? (
        <div className="col-span-2">Something Went Wrong</div>
      ) : passesQuery.data.passes.length === 0 ? (
        <div className="col-span-2">No Passes</div>
      ) : (
        <TheTwoPanels passes={passesQuery.data.passes} />
      )}
    </div>
  );
}

function TheTwoPanels({ passes }: { passes: Pass[] }) {
  const [selectedPass, setSelectedPass] = useState<number>(0);
  return (
    <>
      <PassesPanel
        passes={passes}
        selectedPass={selectedPass}
        setSelectedPass={setSelectedPass}
      />
      <PassDetails pass={passes[selectedPass]} next={selectedPass == 0} />
    </>
  );
}
