import axios from "axios";
import { ApiResponse, TLE, TLESearchResponse } from "./types";

const API_URL = "http://tle.ivanstanojevic.me/api/tle";

async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  let error = null;
  let data: T | null = null;
  try {
    const res = await axios.get<T>(url);
    data = res.data;
  } catch (err) {
    error = `Something went wrong: ${err}`;
  }

  return {
    data,
    error,
  };
}

export async function getTle(noradId: number): Promise<ApiResponse<TLE>> {
  return await fetchData(`${API_URL}/${noradId}`);
}

export async function searchSatellites(
  query: string,
): Promise<ApiResponse<TLESearchResponse>> {
  return await fetchData(`${API_URL}?search=${query}`);
}

export const satelliteIds = {
  iss: 25544,
  css: 48274,
};

// temporary functions to avoid API calling
// TLE for International Space Station
export async function getIssTle(): Promise<ApiResponse<TLE>> {
  return {
    error: null,
    data: {
      satelliteId: 25544,
      name: "ISS (ZARYA)",
      date: "2025-03-15T04:17:35+00:00",
      line1:
        "1 25544U 98067A   25074.17888493  .00016842  00000+0  30206-3 0  9990",
      line2:
        "2 25544  51.6358  52.6470 0006442  23.0781 337.0496 15.50021799500580",
    },
  };
}

// TLE for China Space Station
export async function getCssTle(): Promise<ApiResponse<TLE>> {
  return {
    error: null,
    data: {
      satelliteId: 48274,
      name: "CSS (TIANHE)",
      date: "2025-03-14T16:58:09+00:00",
      line1:
        "1 48274U 21035A   25073.70705526  .00024039  00000+0  27594-3 0  9992",
      line2:
        "2 48274  41.4641 235.9815 0006472 344.7039  15.3603 15.61470209221388",
    },
  };
}
