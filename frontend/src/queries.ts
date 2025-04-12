import axios from "axios";
import { Pass } from "space-station-tracker-core";

const tempURL = "http://localhost:3000";

const passesQuery = (
  {
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  },
  ssName: string,
) => {
  return {
    queryKey: ["passes", ssName, latitude, longitude],
    queryFn: async () => {
      console.log(
        `${tempURL}/api/passes/${ssName}?latitude=${latitude}&longitude=${longitude}`,
      );
      const { data } = await axios.get<Pass[]>(
        `${tempURL}/api/passes/${ssName}?latitude=${latitude}&longitude=${longitude}`,
      );
      return data;
    },
  };
};

export const queries = {
  passesQuery,
};
