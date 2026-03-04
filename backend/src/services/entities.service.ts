import { prisma } from "../db/prisma";
import { AppError } from "../middleware/errorHandler";

type EntityType = "Company" | "Individual";

export async function list(params: {
  page: number;
  limit: number;
  type?: EntityType;
  minRisk?: number;
  search?: string;
}) {
  const { page, limit, type, minRisk, search } = params;
  const skip = (page - 1) * limit;
  const where = {
    ...(type && { type }),
    ...(minRisk !== undefined && { riskScore: { gte: minRisk } }),
    ...(search && { name: { contains: search } }),
  };

  const [entities, total] = await Promise.all([
    prisma.entity.findMany({ where, skip, take: limit, orderBy: { riskScore: "desc" } }),
    prisma.entity.count({ where }),
  ]);

  return { entities, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getById(id: string) {
  const entity = await prisma.entity.findUnique({
    where: { id },
    include: {
      donorLinks: true,
      tenderLinks: true,
      redFlagsAsA: { include: { entityB: true } },
      redFlagsAsB: { include: { entityA: true } },
    },
  });
  if (!entity) throw new AppError(404, "Entity not found");
  return entity;
}

export async function create(data: {
  name: string;
  type: string;
  riskScore?: number;
  party?: string;
  ministry?: string;
}) {
  return prisma.entity.create({ data });
}

export async function update(id: string, data: Partial<{ name: string; type: string; riskScore: number; party: string; ministry: string }>) {
  await getById(id);
  return prisma.entity.update({ where: { id }, data });
}

export async function remove(id: string) {
  await getById(id);
  return prisma.entity.delete({ where: { id } });
}
