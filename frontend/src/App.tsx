import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Panels from "./components/Panels";
const queryClient = new QueryClient();
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-svh bg-black text-gray-300 overflow-auto">
        <div className="max-w-[1500px] h-full px-4 mx-auto">
          <div className="h-20 flex items-center">
            <h1 className="text-2xl font-bold opacity-75">
              Space Station Tracker
            </h1>
          </div>
          <Panels />
        </div>
      </div>
    </QueryClientProvider>
  );
}
