import { prisma } from "../db/prisma";
import { AppError } from "../middleware/errorHandler";

export async function list(params: {
  page: number;
  limit: number;
  minRisk?: number;
  ministry?: string;
}) {
  const { page, limit, minRisk, ministry } = params;
  const skip = (page - 1) * limit;
  const where = {
    ...(minRisk !== undefined && { riskScore: { gte: minRisk } }),
    ...(ministry && { ministry }),
  };

  const [redFlags, total] = await Promise.all([
    prisma.redFlag.findMany({
      where,
      skip,
      take: limit,
      orderBy: { riskScore: "desc" },
      include: { entityA: true, entityB: true },
    }),
    prisma.redFlag.count({ where }),
  ]);

  return { redFlags, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getById(id: string) {
  const flag = await prisma.redFlag.findUnique({
    where: { id },
    include: { entityA: true, entityB: true },
  });
  if (!flag) throw new AppError(404, "Red flag not found");
  return flag;
}

export async function stats() {
  const [total, highRisk, totalDonations, totalContracts] = await Promise.all([
    prisma.redFlag.count(),
    prisma.redFlag.count({ where: { riskScore: { gte: 70 } } }),
    prisma.donor.aggregate({ _sum: { amount: true } }),
    prisma.tender.aggregate({ _sum: { amount: true } }),
  ]);

  const highRiskEntities = await prisma.entity.count({ where: { riskScore: { gte: 70 } } });

  const flags = await prisma.redFlag.findMany({
    select: { tenderAmount: true, donationAmount: true },
  });
  const avgROI =
    flags.length > 0
      ? flags.reduce<number>(
          (sum: number, f: { tenderAmount: bigint; donationAmount: bigint }) =>
            sum + Number(f.tenderAmount) / Number(f.donationAmount),
          0
        ) / flags.length
      : 0;

  return {
    totalRedFlags: total,
    highRiskRedFlags: highRisk,
    highRiskEntities,
    totalDonations: totalDonations._sum.amount ?? BigInt(0),
    totalContracts: totalContracts._sum.amount ?? BigInt(0),
    averageROI: Math.round(avgROI * 100) / 100,
  };
}
