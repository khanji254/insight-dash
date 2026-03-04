import { prisma } from "../db/prisma";
import { AppError } from "../middleware/errorHandler";

export async function list(params: { page: number; limit: number; ministry?: string }) {
  const { page, limit, ministry } = params;
  const skip = (page - 1) * limit;
  const where = ministry ? { ministry } : {};

  const [tenders, total] = await Promise.all([
    prisma.tender.findMany({ where, skip, take: limit, orderBy: { awardDate: "desc" } }),
    prisma.tender.count({ where }),
  ]);

  return { tenders, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getById(id: string) {
  const tender = await prisma.tender.findUnique({ where: { id }, include: { entity: true } });
  if (!tender) throw new AppError(404, "Tender not found");
  return tender;
}

export async function create(data: {
  companyName: string;
  amount: bigint;
  ministry: string;
  awardDate: Date;
  reference: string;
  entityId?: string;
}) {
  const existing = await prisma.tender.findUnique({ where: { reference: data.reference } });
  if (existing) throw new AppError(409, `Reference '${data.reference}' already exists`);
  return prisma.tender.create({ data });
}

export async function update(id: string, data: Partial<{ companyName: string; amount: bigint; ministry: string; awardDate: Date; reference: string; entityId: string }>) {
  await getById(id);
  return prisma.tender.update({ where: { id }, data });
}

export async function remove(id: string) {
  await getById(id);
  return prisma.tender.delete({ where: { id } });
}
