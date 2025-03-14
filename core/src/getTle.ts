import axios from "axios";
import { TLE, TLESearchResponse } from "./types";

const API_URL = "http://tle.ivanstanojevic.me/api/tle";

export async function getTle(noradId: number) {
  let res = await axios.get<TLE & { "@context": string }>(
    `${API_URL}/${noradId}`,
  );
  return res.data;
}

export async function searchSatellites(query: string) {
  let res = await axios.get<TLESearchResponse>(`${API_URL}?search=${query}`);
  return res.data;
}

// temporary functions to avoid API calling
// TLE for International Space Station
export async function getIssTle(): Promise<TLE> {
  return {
    satelliteId: 25544,
    name: "ISS (ZARYA)",
    date: "2025-03-15T04:17:35+00:00",
    line1:
      "1 25544U 98067A   25074.17888493  .00016842  00000+0  30206-3 0  9990",
    line2:
      "2 25544  51.6358  52.6470 0006442  23.0781 337.0496 15.50021799500580",
  };
}

// TLE for China Space Station
export async function getCssTle(): Promise<TLE> {
  return {
    satelliteId: 48274,
    name: "CSS (TIANHE)",
    date: "2025-03-14T16:58:09+00:00",
    line1:
      "1 48274U 21035A   25073.70705526  .00024039  00000+0  27594-3 0  9992",
    line2:
      "2 48274  41.4641 235.9815 0006472 344.7039  15.3603 15.61470209221388",
  };
}
