import { Router } from "express";
import { authenticate, authorize } from "../middleware/authenticate";
import {
  listTenders,
  getTender,
  createTender,
  updateTender,
  deleteTender,
} from "../controllers/tenders.controller";

export const tendersRouter = Router();

tendersRouter.get("/", authenticate, listTenders);
tendersRouter.get("/:id", authenticate, getTender);
tendersRouter.post("/", authenticate, authorize("ADMIN", "ANALYST"), createTender);
tendersRouter.patch("/:id", authenticate, authorize("ADMIN", "ANALYST"), updateTender);
tendersRouter.delete("/:id", authenticate, authorize("ADMIN"), deleteTender);
