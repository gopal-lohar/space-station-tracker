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
  query: string
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
      name: "ISS",
      date: "2025-03-28T03:20:02+00:00",
      line1:
        "1 25544U 98067A   25087.13891722  .00026637  00000+0  46979-3 0  9996",
      line2:
        "2 25544  51.6369 348.4472 0003631  58.3052 301.8291 15.50197518502597",
    },
  };
}

// TLE for China Space Station
export async function getCssTle(): Promise<ApiResponse<TLE>> {
  return {
    error: null,
    data: {
      satelliteId: 48274,
      name: "CSS",
      date: "2025-03-28T04:48:35+00:00",
      line1:
        "1 48274U 21035A   25087.20040521  .00043694  00000+0  47870-3 0  9996",
      line2:
        "2 48274  41.4654 153.7518 0005093 114.3253 245.8119 15.62452694223491",
    },
  };
}
