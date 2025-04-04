import axios from "axios";

const tempURL = "http://localhost:3000";

const ssPositionQuery = {
  queryKey: ["ssPosition"],
  queryFn: async () => {
    const { data } = await axios.get<{
      time: string;
      latitude: number;
      longitude: number;
    }>(`${tempURL}/api/ss-position`);
    return data;
  },
};

export interface Pass {
  startingTime: string;
  endingTime: string;
  startElevation: number;
  maxElevation: number;
  endElevation: number;
  startDirection: number;
  endDirection: number;
  magnitude: number;
}

const passesQuery = ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) => {
  return {
    queryKey: ["passes", latitude, longitude],
    queryFn: async () => {
      const { data } = await axios.get<{ time: string; passes: Pass[] }>(
        `${tempURL}/api/passes?latitude=${latitude}&longitude=${longitude}`,
      );
      return data;
    },
  };
};

export const queries = {
  ssPositionQuery,
  passesQuery,
};
