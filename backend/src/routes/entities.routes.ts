import { Router } from "express";
import { authenticate, authorize } from "../middleware/authenticate";
import {
  listEntities,
  getEntity,
  createEntity,
  updateEntity,
  deleteEntity,
} from "../controllers/entities.controller";

export const entitiesRouter = Router();

entitiesRouter.get("/", authenticate, listEntities);
entitiesRouter.get("/:id", authenticate, getEntity);
entitiesRouter.post("/", authenticate, authorize("ADMIN", "ANALYST"), createEntity);
entitiesRouter.patch("/:id", authenticate, authorize("ADMIN", "ANALYST"), updateEntity);
entitiesRouter.delete("/:id", authenticate, authorize("ADMIN"), deleteEntity);
