import { config } from "./config/env";
import { tleRoutes } from "./routes/tle.routes";

import express from "express";
import cors from "cors";
import { tleManager } from "./services/TleManager";
import { passesRoutes } from "./routes/passes.routes";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/tle", tleRoutes);
app.use("/api/passes", passesRoutes);

const PORT = config.server.port;

async function main() {
  let error = await tleManager.updateTLEData();
  if (error) {
    console.error("Error updating TLE data:", error);
    return;
  }
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main();
