import { prisma } from '../config/prisma';
import { createError } from '../middleware/errorHandler';
import type { CreatePeriodInput, UpdatePeriodInput } from '../validations/resources.validation';
import { differenceInDays } from '../utils/dateUtils';

export const periodService = {
  async getAll(userId: string) {
    const entries = await prisma.periodEntry.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });

    // Calculate cycle predictions only from real data
    const predictions = calculateCyclePredictions(entries);

    return { entries, predictions };
  },

  async create(userId: string, input: CreatePeriodInput) {
    const entry = await prisma.periodEntry.create({
      data: {
        userId,
        startDate: new Date(input.startDate),
        endDate: input.endDate ? new Date(input.endDate) : null,
        flow: input.flow ?? 'MEDIUM',
        painLevel: input.painLevel ?? 0,
        notes: input.notes,
      },
    });
    return entry;
  },

  async update(userId: string, id: string, input: UpdatePeriodInput) {
    // Verify ownership before updating
    const existing = await prisma.periodEntry.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw createError('Period entry not found', 404);
    }

    return prisma.periodEntry.update({
      where: { id },
      data: {
        ...(input.startDate && { startDate: new Date(input.startDate) }),
        ...(input.endDate !== undefined && { endDate: input.endDate ? new Date(input.endDate) : null }),
        ...(input.flow && { flow: input.flow }),
        ...(input.painLevel !== undefined && { painLevel: input.painLevel }),
        ...(input.notes !== undefined && { notes: input.notes }),
      },
    });
  },

  async delete(userId: string, id: string) {
    const existing = await prisma.periodEntry.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw createError('Period entry not found', 404);
    }

    await prisma.periodEntry.delete({ where: { id } });
    return { message: 'Period entry deleted' };
  },
};

// ── Cycle prediction — only from real user data ──────────────────────────
function calculateCyclePredictions(entries: Array<{ startDate: Date; endDate: Date | null }>) {
  if (entries.length < 2) {
    return {
      hasEnoughData: false,
      message: 'Not enough cycle history available. Log at least 2 cycles to see predictions.',
      averageCycleLength: null,
      averagePeriodLength: null,
      estimatedNextPeriod: null,
    };
  }

  // Calculate cycle lengths from consecutive start dates
  const cycleLengths: number[] = [];
  const periodLengths: number[] = [];

  for (let i = 0; i < entries.length - 1; i++) {
    const cycleLength = differenceInDays(entries[i].startDate, entries[i + 1].startDate);
    if (cycleLength > 0 && cycleLength <= 60) {
      cycleLengths.push(cycleLength);
    }
  }

  for (const entry of entries) {
    if (entry.endDate) {
      const periodLength = differenceInDays(entry.endDate, entry.startDate);
      if (periodLength >= 1 && periodLength <= 14) {
        periodLengths.push(periodLength);
      }
    }
  }

  if (cycleLengths.length === 0) {
    return {
      hasEnoughData: false,
      message: 'Not enough cycle history available.',
      averageCycleLength: null,
      averagePeriodLength: null,
      estimatedNextPeriod: null,
    };
  }

  const avgCycle = Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length);
  const avgPeriod =
    periodLengths.length > 0
      ? Math.round(periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length)
      : null;

  const lastPeriodStart = entries[0].startDate;
  const estimatedNext = new Date(lastPeriodStart);
  estimatedNext.setDate(estimatedNext.getDate() + avgCycle);

  return {
    hasEnoughData: true,
    message: null,
    averageCycleLength: avgCycle,
    averagePeriodLength: avgPeriod,
    estimatedNextPeriod: estimatedNext.toISOString(),
  };
}
