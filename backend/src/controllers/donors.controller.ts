import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as donorsService from "../services/donors.service";

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  party: z.string().optional(),
});

const createSchema = z.object({
  name: z.string().min(2),
  amount: z.coerce.bigint().positive(),
  party: z.string().min(1),
  date: z.coerce.date(),
  linkedCompany: z.string().optional(),
  entityId: z.string().uuid().optional(),
});

export async function listDonors(req: Request, res: Response, next: NextFunction) {
  try {
    const params = paginationSchema.parse(req.query);
    const result = await donorsService.list(params);
    res.json({ status: "success", data: result });
  } catch (err) { next(err); }
}

export async function getDonor(req: Request, res: Response, next: NextFunction) {
  try {
    const donor = await donorsService.getById(req.params.id as string);
    res.json({ status: "success", data: { donor } });
  } catch (err) { next(err); }
}

export async function createDonor(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createSchema.parse(req.body);
    const donor = await donorsService.create(data);
    res.status(201).json({ status: "success", data: { donor } });
  } catch (err) { next(err); }
}

export async function updateDonor(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createSchema.partial().parse(req.body);
    const donor = await donorsService.update(req.params.id as string, data);
    res.json({ status: "success", data: { donor } });
  } catch (err) { next(err); }
}

export async function deleteDonor(req: Request, res: Response, next: NextFunction) {
  try {
    await donorsService.remove(req.params.id as string);
    res.status(204).send();
  } catch (err) { next(err); }
}
