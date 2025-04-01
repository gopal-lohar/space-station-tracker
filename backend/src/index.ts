import express, { Request, Response } from "express";
import cors from "cors";

// Define interfaces
interface SSPosition {
  time: number;
  latitude: number;
  longitude: number;
  sunrise: Date;
  sunset: Date;
}

interface Pass {
  startingTime: string;
  endingTime: string;
  startElevation: number;
  maxElevation: number;
  endElevation: number;
  startDirection: number;
  endDirection: number;
  magnitude: number;
}

interface PassesResponse {
  time: number;
  passes: Pass[];
}

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

app.get("/api/ss-position", (req, res) => {
  const ssPosition: SSPosition = {
    time: Date.now(),
    latitude: 0,
    longitude: 0,
    sunrise: new Date(Date.now() + 10000),
    sunset: new Date(Date.now() + 100),
  };

  res.json(ssPosition);
});

app.get("/api/passes", (req, res) => {
  const latitude = Number(req.query.latitude);
  const longitude = Number(req.query.longitude);

  // Validate query parameters
  if (isNaN(latitude) || isNaN(longitude)) {
    res
      .status(400)
      .json({ error: "Valid latitude and longitude are required" });
    return;
  }

  const passesData: PassesResponse = {
    time: Date.now(),
    passes: [
      {
        startingTime: "2025-03-30T20:10:51+05:30",
        endingTime: "2025-03-30T20:12:42+05:30",
        startElevation: 10.0,
        maxElevation: 27.1,
        endElevation: 27.1,
        startDirection: 333,
        endDirection: 353,
        magnitude: -2.2,
      },
      {
        startingTime: "2025-03-31T19:22:37+05:30",
        endingTime: "2025-03-31T19:26:25+05:30",
        startElevation: 10.0,
        maxElevation: 21.6,
        endElevation: 18.2,
        startDirection: 350,
        endDirection: 72,
        magnitude: -2.8,
      },
      {
        startingTime: "2025-03-31T19:22:37+05:30",
        endingTime: "2025-03-31T19:26:25+05:30",
        startElevation: 10.0,
        maxElevation: 21.6,
        endElevation: 18.2,
        startDirection: 350,
        endDirection: 72,
        magnitude: -2.8,
      },
      {
        startingTime: "2025-04-01T20:10:03+05:30",
        endingTime: "2025-04-01T20:13:07+05:30",
        startElevation: 10.0,
        maxElevation: 41.3,
        endElevation: 41.3,
        startDirection: 303,
        endDirection: 236,
        magnitude: -3.2,
      },
      {
        startingTime: "2025-04-02T19:21:08+05:30",
        endingTime: "2025-04-02T19:26:59+05:30",
        startElevation: 10.0,
        maxElevation: 83.0,
        endElevation: 16.2,
        startDirection: 320,
        endDirection: 136,
        magnitude: -4.7,
      },
      {
        startingTime: "2025-04-03T20:11:04+05:30",
        endingTime: "2025-04-03T20:12:53+05:30",
        startElevation: 10.0,
        maxElevation: 10.8,
        endElevation: 10.0,
        startDirection: 252,
        endDirection: 220,
        magnitude: -0.8,
      },
      {
        startingTime: "2025-04-04T19:20:33+05:30",
        endingTime: "2025-04-04T19:25:53+05:30",
        startElevation: 10.0,
        maxElevation: 22.4,
        endElevation: 10.0,
        startDirection: 287,
        endDirection: 180,
        magnitude: -1.8,
      },
    ],
  };

  res.json(passesData);
});

// Root route
app.get("/", function (req: Request, res: Response) {
  res.send(
    "Space Station API - Use /api/ss-position or /api/passes?latitude=X&longitude=Y",
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
