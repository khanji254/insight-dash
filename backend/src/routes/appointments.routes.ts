import { Router } from "express";
import { authenticate, authorize } from "../middleware/authenticate";
import {
  listAppointments,
  getAppointment,
  createAppointment,
  deleteAppointment,
} from "../controllers/appointments.controller";

export const appointmentsRouter = Router();

appointmentsRouter.get("/", authenticate, listAppointments);
appointmentsRouter.get("/:id", authenticate, getAppointment);
appointmentsRouter.post("/", authenticate, authorize("ADMIN", "ANALYST"), createAppointment);
appointmentsRouter.delete("/:id", authenticate, authorize("ADMIN"), deleteAppointment);
