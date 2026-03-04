import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as entitiesService from "../services/entities.service";

const entityTypeEnum = z.enum(["Company", "Individual"]);

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  type: entityTypeEnum.optional(),
  minRisk: z.coerce.number().int().min(0).max(100).optional(),
  search: z.string().optional(),
});

const createSchema = z.object({
  name: z.string().min(2),
  type: entityTypeEnum,
  riskScore: z.coerce.number().int().min(0).max(100).optional(),
  party: z.string().optional(),
  ministry: z.string().optional(),
});

export async function listEntities(req: Request, res: Response, next: NextFunction) {
  try {
    const params = paginationSchema.parse(req.query);
    const result = await entitiesService.list(params);
    res.json({ status: "success", data: result });
  } catch (err) { next(err); }
}

export async function getEntity(req: Request, res: Response, next: NextFunction) {
  try {
    const entity = await entitiesService.getById(req.params.id as string);
    res.json({ status: "success", data: { entity } });
  } catch (err) { next(err); }
}

export async function createEntity(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createSchema.parse(req.body);
    const entity = await entitiesService.create(data);
    res.status(201).json({ status: "success", data: { entity } });
  } catch (err) { next(err); }
}

export async function updateEntity(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createSchema.partial().parse(req.body);
    const entity = await entitiesService.update(req.params.id as string, data);
    res.json({ status: "success", data: { entity } });
  } catch (err) { next(err); }
}


export async function deleteEntity(req: Request, res: Response, next: NextFunction) {
  try {
    await entitiesService.remove(req.params.id as string);
    res.status(204).send();
  } catch (err) { next(err); }
}
