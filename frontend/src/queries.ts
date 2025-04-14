import axios from "axios";
import { Pass, Tle } from "space-station-tracker-core";

const tempURL = "http://localhost:3000";

const tleQuery = (ssName: string) => {
  return {
    queryKey: ["passes", ssName],
    queryFn: async () => {
      const { data } = await axios.get<Tle>(`${tempURL}/api/tle/${ssName}`);
      return data;
    },
  };
};

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
      const { data } = await axios.get<Pass[]>(
        `${tempURL}/api/passes/${ssName}?latitude=${latitude}&longitude=${longitude}`,
      );
      return data;
    },
  };
};

export const queries = {
  passesQuery,
  tleQuery,
};
