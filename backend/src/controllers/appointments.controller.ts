import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as appointmentsService from "../services/appointments.service";

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  ministry: z.string().optional(),
});

const createSchema = z.object({
  name: z.string().min(2),
  role: z.string().min(1),
  gazetteRef: z.string().min(1),
  date: z.coerce.date(),
  ministry: z.string().min(1),
});

export async function listAppointments(req: Request, res: Response, next: NextFunction) {
  try {
    const params = paginationSchema.parse(req.query);
    const result = await appointmentsService.list(params);
    res.json({ status: "success", data: result });
  } catch (err) { next(err); }
}

export async function getAppointment(req: Request, res: Response, next: NextFunction) {
  try {
    const appt = await appointmentsService.getById(req.params.id as string);
    res.json({ status: "success", data: { appointment: appt } });
  } catch (err) { next(err); }
}

export async function createAppointment(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createSchema.parse(req.body);
    const appt = await appointmentsService.create(data);
    res.status(201).json({ status: "success", data: { appointment: appt } });
  } catch (err) { next(err); }
}

export async function deleteAppointment(req: Request, res: Response, next: NextFunction) {
  try {
    await appointmentsService.remove(req.params.id as string);
    res.status(204).send();
  } catch (err) { next(err); }
}
