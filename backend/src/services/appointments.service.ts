import { prisma } from "../db/prisma";
import { AppError } from "../middleware/errorHandler";

export async function list(params: { page: number; limit: number; ministry?: string }) {
  const { page, limit, ministry } = params;
  const skip = (page - 1) * limit;
  const where = ministry ? { ministry } : {};

  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({ where, skip, take: limit, orderBy: { date: "desc" } }),
    prisma.appointment.count({ where }),
  ]);

  return { appointments, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getById(id: string) {
  const appt = await prisma.appointment.findUnique({ where: { id } });
  if (!appt) throw new AppError(404, "Appointment not found");
  return appt;
}

export async function create(data: {
  name: string;
  role: string;
  gazetteRef: string;
  date: Date;
  ministry: string;
}) {
  return prisma.appointment.create({ data });
}

export async function remove(id: string) {
  await getById(id);
  return prisma.appointment.delete({ where: { id } });
}
