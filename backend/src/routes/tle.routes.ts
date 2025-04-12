import { Router } from "express";
import { getTle } from "../controllers/tle.controller";

const tleRoutes = Router();

tleRoutes.get("/:ssname", getTle);

export { tleRoutes };
