import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as redFlagsService from "../services/redFlags.service";

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  minRisk: z.coerce.number().int().min(0).max(100).optional(),
  ministry: z.string().optional(),
});

export async function listRedFlags(req: Request, res: Response, next: NextFunction) {
  try {
    const params = paginationSchema.parse(req.query);
    const result = await redFlagsService.list(params);
    res.json({ status: "success", data: result });
  } catch (err) { next(err); }
}

export async function getRedFlag(req: Request, res: Response, next: NextFunction) {
  try {
    const flag = await redFlagsService.getById(req.params.id as string);
    res.json({ status: "success", data: { flag } });
  } catch (err) { next(err); }
}

export async function getDashboardStats(req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await redFlagsService.stats();
    res.json({ status: "success", data: stats });
  } catch (err) { next(err); }
}
