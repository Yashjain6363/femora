import { prisma } from '../config/prisma';
import { createError } from '../middleware/errorHandler';
import type {
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from '../validations/resources.validation';

export const appointmentService = {
  async getAll(userId: string) {
    const now = new Date();

    const [upcoming, completed, cancelled] = await Promise.all([
      prisma.appointment.findMany({
        where: { userId, status: 'UPCOMING', date: { gte: now } },
        orderBy: { date: 'asc' },
      }),
      prisma.appointment.findMany({
        where: { userId, status: 'COMPLETED' },
        orderBy: { date: 'desc' },
        take: 20,
      }),
      prisma.appointment.findMany({
        where: { userId, status: 'CANCELLED' },
        orderBy: { date: 'desc' },
        take: 20,
      }),
    ]);

    return { upcoming, completed, cancelled };
  },

  async create(userId: string, input: CreateAppointmentInput) {
    return prisma.appointment.create({
      data: {
        userId,
        title: input.title,
        date: new Date(input.date),
        provider: input.provider,
        location: input.location,
        notes: input.notes,
        status: 'UPCOMING',
      },
    });
  },

  async update(userId: string, id: string, input: UpdateAppointmentInput) {
    const existing = await prisma.appointment.findFirst({ where: { id, userId } });
    if (!existing) throw createError('Appointment not found', 404);

    return prisma.appointment.update({
      where: { id },
      data: {
        ...(input.title && { title: input.title }),
        ...(input.date && { date: new Date(input.date) }),
        ...(input.provider !== undefined && { provider: input.provider }),
        ...(input.location !== undefined && { location: input.location }),
        ...(input.notes !== undefined && { notes: input.notes }),
        ...(input.status && { status: input.status }),
      },
    });
  },

  async delete(userId: string, id: string) {
    const existing = await prisma.appointment.findFirst({ where: { id, userId } });
    if (!existing) throw createError('Appointment not found', 404);
    await prisma.appointment.delete({ where: { id } });
    return { message: 'Appointment deleted' };
  },
};
