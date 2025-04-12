import { useQuery } from "@tanstack/react-query";
import { LeftPanel } from "./LeftPanel";
import PassDetails from "./PassDetails";
import PassesPanel from "./PassesPanel";
import { Pass, queries } from "../queries";
import { useCallback, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const LOCATION_KEY = "ss_detector_location";

type LocationState = {
  latitude: number;
  longitude: number;
} | null;

export default function Panels() {
  const [location, setLocation] = useLocalStorage<LocationState>(
    LOCATION_KEY,
    null,
  );
  return (
    <div className="grid gap-8 h-[calc(100%-5rem)] pb-4 grid-cols-3">
      <LeftPanel />
      {location ? (
        <Passes location={location} />
      ) : (
        <LocationPanel setLocation={setLocation} />
      )}
    </div>
  );
}

function LocationPanel({
  setLocation,
}: {
  setLocation: (value: LocationState) => void;
}) {
  const [localLocation, setLocalLocation] = useState({
    latitude: 26.22983,
    longitude: 78.17337,
  });
  const detectLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error("User denied the request for geolocation");
              break;
            case error.POSITION_UNAVAILABLE:
              console.error("Location information is unavailable");
              break;
            case error.TIMEOUT:
              console.error("The request to get user location timed out");
              break;
            default:
              console.error("An unknown error occurred");
              break;
          }
        },
      );
    } else {
      console.log("nah, we got geolocation");
    }
  }, [setLocation]);
  return (
    <div>
      <h2>Location</h2>
      <div className="flex flex-col items-center gap-2 py-4">
        <button
          className="bg-cyan-700 py-2 px-4 rounded-md cursor-pointer"
          onClick={detectLocation}
        >
          Detect Automatically
        </button>
        <div>OR</div>
        <button
          className="bg-cyan-700 py-2 px-4 rounded-md cursor-pointer"
          onClick={() => {
            setLocation({
              latitude: localLocation.latitude,
              longitude: localLocation.longitude,
            });
          }}
        >
          Enter Coordinates Manually
        </button>
        <div className="grid grid-cols-[10ch_1fr] items-center">
          <label>Latitude</label>
          <input
            className="outline-none focus-visible:border-gray-700 border-2 border-gray-900 px-4 py-2"
            value={localLocation.latitude}
            onChange={(e) =>
              setLocalLocation({
                ...localLocation,
                latitude: parseFloat(e.target.value),
              })
            }
          />
        </div>
        <div className="grid grid-cols-[10ch_1fr] items-center">
          <label>Longitude</label>
          <input
            className="outline-none focus-visible:border-gray-700 border-2 border-gray-900 px-4 py-2"
            value={localLocation.longitude}
            onChange={(e) =>
              setLocalLocation({
                ...localLocation,
                longitude:
                  parseFloat(e.target.value) || localLocation.longitude,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

function Passes({
  location,
}: {
  location: { latitude: number; longitude: number };
}) {
  const ssName = "iss";
  const passesQuery = useQuery(queries.passesQuery(location, ssName));
  return passesQuery.error ? (
    <div className="col-span-2">Error Loading Data</div>
  ) : passesQuery.isLoading ? (
    <div className="col-span-2">Loading...</div>
  ) : !passesQuery.data ? (
    <div className="col-span-2">Something Went Wrong</div>
  ) : passesQuery.data.length === 0 ? (
    <div className="col-span-2">No Passes</div>
  ) : (
    <TheTwoPanels passes={passesQuery.data} />
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
