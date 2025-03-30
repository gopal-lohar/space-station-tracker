import WorldMap from "./components/WorldMap";

export default function App() {
  const observerLocation = {
    latitude: 22.460701,
    longitude: 69.059056,
    elevation: 205,
  };

  const x = ((observerLocation.longitude + 180) / 360) * 1900;
  const y = ((90 - observerLocation.latitude) / 180) * 950;
  return (
    <div className="h-svh bg-black text-gray-100">
      <div className="max-w-[1500px] h-full px-4 mx-auto">
        <div className="h-20 flex items-center">
          <h1 className="text-2xl font-bold opacity-75">
            Space Station Tracker
          </h1>
        </div>
        <div className="grid h-[calc(100%-5rem)] pb-4 grid-cols-3">
          <div className="p-4 rounded-md h-full">
            <div className="absolute inset-0 border-2 border-red-500 h-max">
              <div
                className="size-2 bg-red-500 rounded-full absolute -translate-x-1/2 -translate-y-1/2"
                style={{ top: `${y}px`, left: `${x}px` }}
              ></div>
              <WorldMap />
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
