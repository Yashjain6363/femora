import { prisma } from '../config/prisma';
import { createError } from '../middleware/errorHandler';
import type {
  CreateSymptomInput,
  UpdateSymptomInput,
  CreateWellnessInput,
  UpdateWellnessInput,
} from '../validations/resources.validation';

export const symptomService = {
  async getAll(userId: string, limit = 200) {
    const entries = await prisma.symptomEntry.findMany({
      where: { userId },
      orderBy: { loggedAt: 'desc' },
      take: limit,
    });

    // Aggregate symptom frequency
    const symptomCounts: Record<string, { count: number; totalSeverity: number }> = {};
    for (const entry of entries) {
      if (!symptomCounts[entry.symptom]) {
        symptomCounts[entry.symptom] = { count: 0, totalSeverity: 0 };
      }
      symptomCounts[entry.symptom].count++;
      symptomCounts[entry.symptom].totalSeverity += entry.severity;
    }

    const symptomSummary = Object.entries(symptomCounts).map(([symptom, data]) => ({
      symptom,
      count: data.count,
      averageSeverity: Math.round((data.totalSeverity / data.count) * 10) / 10,
    }));

    return { entries, symptomSummary };
  },

  async create(userId: string, input: CreateSymptomInput) {
    return prisma.symptomEntry.create({
      data: {
        userId,
        symptom: input.symptom,
        severity: input.severity,
        notes: input.notes,
        loggedAt: input.loggedAt ? new Date(input.loggedAt) : new Date(),
      },
    });
  },

  async update(userId: string, id: string, input: UpdateSymptomInput) {
    const existing = await prisma.symptomEntry.findFirst({ where: { id, userId } });
    if (!existing) throw createError('Symptom entry not found', 404);

    return prisma.symptomEntry.update({
      where: { id },
      data: {
        ...(input.symptom && { symptom: input.symptom }),
        ...(input.severity !== undefined && { severity: input.severity }),
        ...(input.notes !== undefined && { notes: input.notes }),
        ...(input.loggedAt && { loggedAt: new Date(input.loggedAt) }),
      },
    });
  },

  async delete(userId: string, id: string) {
    const existing = await prisma.symptomEntry.findFirst({ where: { id, userId } });
    if (!existing) throw createError('Symptom entry not found', 404);
    await prisma.symptomEntry.delete({ where: { id } });
    return { message: 'Symptom entry deleted' };
  },
};

// ─── Wellness Service ──────────────────────────────────────────────────────
export const wellnessService = {
  async getAll(userId: string, limit = 90) {
    return prisma.wellnessEntry.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: limit,
    });
  },

  async getToday(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return prisma.wellnessEntry.findFirst({
      where: { userId, date: today },
    });
  },

  async upsert(userId: string, input: CreateWellnessInput) {
    const date = new Date(input.date);
    date.setHours(0, 0, 0, 0);

    return prisma.wellnessEntry.upsert({
      where: { userId_date: { userId, date } },
      create: {
        userId,
        date,
        sleepHours: input.sleepHours,
        mood: input.mood,
        energyLevel: input.energyLevel,
        stressLevel: input.stressLevel,
        waterIntake: input.waterIntake,
        notes: input.notes,
      },
      update: {
        ...(input.sleepHours !== undefined && { sleepHours: input.sleepHours }),
        ...(input.mood !== undefined && { mood: input.mood }),
        ...(input.energyLevel !== undefined && { energyLevel: input.energyLevel }),
        ...(input.stressLevel !== undefined && { stressLevel: input.stressLevel }),
        ...(input.waterIntake !== undefined && { waterIntake: input.waterIntake }),
        ...(input.notes !== undefined && { notes: input.notes }),
      },
    });
  },

  async update(userId: string, id: string, input: UpdateWellnessInput) {
    const existing = await prisma.wellnessEntry.findFirst({ where: { id, userId } });
    if (!existing) throw createError('Wellness entry not found', 404);

    return prisma.wellnessEntry.update({
      where: { id },
      data: {
        ...(input.sleepHours !== undefined && { sleepHours: input.sleepHours }),
        ...(input.mood !== undefined && { mood: input.mood }),
        ...(input.energyLevel !== undefined && { energyLevel: input.energyLevel }),
        ...(input.stressLevel !== undefined && { stressLevel: input.stressLevel }),
        ...(input.waterIntake !== undefined && { waterIntake: input.waterIntake }),
        ...(input.notes !== undefined && { notes: input.notes }),
      },
    });
  },

  async delete(userId: string, id: string) {
    const existing = await prisma.wellnessEntry.findFirst({ where: { id, userId } });
    if (!existing) throw createError('Wellness entry not found', 404);
    await prisma.wellnessEntry.delete({ where: { id } });
    return { message: 'Wellness entry deleted' };
  },
};
