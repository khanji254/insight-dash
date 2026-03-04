import { Router } from "express";
import { authenticate, authorize } from "../middleware/authenticate";
import {
  listDonors,
  getDonor,
  createDonor,
  updateDonor,
  deleteDonor,
} from "../controllers/donors.controller";

export const donorsRouter = Router();

donorsRouter.get("/", authenticate, listDonors);
donorsRouter.get("/:id", authenticate, getDonor);
donorsRouter.post("/", authenticate, authorize("ADMIN", "ANALYST"), createDonor);
donorsRouter.patch("/:id", authenticate, authorize("ADMIN", "ANALYST"), updateDonor);
donorsRouter.delete("/:id", authenticate, authorize("ADMIN"), deleteDonor);
