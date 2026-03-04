import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import {
  listRedFlags,
  getRedFlag,
  getDashboardStats,
} from "../controllers/redFlags.controller";

export const redFlagsRouter = Router();

redFlagsRouter.get("/stats", authenticate, getDashboardStats);
redFlagsRouter.get("/", authenticate, listRedFlags);
redFlagsRouter.get("/:id", authenticate, getRedFlag);
