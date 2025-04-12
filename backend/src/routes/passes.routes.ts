import { Router } from "express";
import { getPasses } from "../controllers/passes.controller";

const passesRoutes = Router();

passesRoutes.get("/:ssname", getPasses);

export { passesRoutes };
