import { Router } from "express";
import { authRouter } from "./auth.routes";
import { donorsRouter } from "./donors.routes";
import { tendersRouter } from "./tenders.routes";
import { entitiesRouter } from "./entities.routes";
import { redFlagsRouter } from "./redFlags.routes";
import { appointmentsRouter } from "./appointments.routes";
import adminRouter from "./admin.routes";

export const router = Router();

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/donors", donorsRouter);
router.use("/tenders", tendersRouter);
router.use("/entities", entitiesRouter);
router.use("/red-flags", redFlagsRouter);
router.use("/appointments", appointmentsRouter);
