// Fetching data from api

export interface TLE {
  satelliteId: number;
  name: string;
  date: string; // ISO 8601 format
  line1: string;
  line2: string;
}

export interface TLESearchResponse {
  totalItems: number;
  member: TLE[];
  parameters: {
    search: string;
    sort: string;
    "sort-dir": string;
    page: number;
    "page-size": number;
  };
  view: {
    first: string;
    previous: string;
    last: string;
  };
}
