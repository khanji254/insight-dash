import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as tendersService from "../services/tenders.service";

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  ministry: z.string().optional(),
});

const createSchema = z.object({
  companyName: z.string().min(2),
  amount: z.coerce.bigint().positive(),
  ministry: z.string().min(1),
  awardDate: z.coerce.date(),
  reference: z.string().min(1),
  entityId: z.string().uuid().optional(),
});

export async function listTenders(req: Request, res: Response, next: NextFunction) {
  try {
    const params = paginationSchema.parse(req.query);
    const result = await tendersService.list(params);
    res.json({ status: "success", data: result });
  } catch (err) { next(err); }
}

export async function getTender(req: Request, res: Response, next: NextFunction) {
  try {
    const tender = await tendersService.getById(req.params.id as string);
    res.json({ status: "success", data: { tender } });
  } catch (err) { next(err); }
}

export async function createTender(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createSchema.parse(req.body);
    const tender = await tendersService.create(data);
    res.status(201).json({ status: "success", data: { tender } });
  } catch (err) { next(err); }
}

export async function updateTender(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createSchema.partial().parse(req.body);
    const tender = await tendersService.update(req.params.id as string, data);
    res.json({ status: "success", data: { tender } });
  } catch (err) { next(err); }
}

export async function deleteTender(req: Request, res: Response, next: NextFunction) {
  try {
    await tendersService.remove(req.params.id as string);
    res.status(204).send();
  } catch (err) { next(err); }
}
