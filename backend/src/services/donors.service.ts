import { prisma } from "../db/prisma";
import { AppError } from "../middleware/errorHandler";

export async function list(params: { page: number; limit: number; party?: string }) {
  const { page, limit, party } = params;
  const skip = (page - 1) * limit;
  const where = party ? { party } : {};

  const [donors, total] = await Promise.all([
    prisma.donor.findMany({ where, skip, take: limit, orderBy: { date: "desc" } }),
    prisma.donor.count({ where }),
  ]);

  return { donors, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getById(id: string) {
  const donor = await prisma.donor.findUnique({ where: { id }, include: { entity: true } });
  if (!donor) throw new AppError(404, "Donor not found");
  return donor;
}

export async function create(data: {
  name: string;
  amount: bigint;
  party: string;
  date: Date;
  linkedCompany?: string;
  entityId?: string;
}) {
  return prisma.donor.create({ data });
}

export async function update(id: string, data: Partial<{ name: string; amount: bigint; party: string; date: Date; linkedCompany: string; entityId: string }>) {
  await getById(id);
  return prisma.donor.update({ where: { id }, data });
}

export async function remove(id: string) {
  await getById(id);
  return prisma.donor.delete({ where: { id } });
}
