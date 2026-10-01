import { prisma } from '../config/prisma';
import { periodService } from './period.service';
import { wellnessService } from './health.service';

export const dashboardService = {
  async getSummary(userId: string) {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      periodData,
      recentSymptoms,
      recentCravings,
      upcomingAppointments,
      recentWellness,
      todayWellness,
    ] = await Promise.all([
      periodService.getAll(userId),
      prisma.symptomEntry.findMany({
        where: { userId, loggedAt: { gte: sevenDaysAgo } },
        orderBy: { loggedAt: 'desc' },
        take: 5,
      }),
      prisma.cravingEntry.findMany({
        where: { userId, loggedAt: { gte: sevenDaysAgo } },
        orderBy: { loggedAt: 'desc' },
        take: 5,
      }),
      prisma.appointment.findMany({
        where: { userId, status: 'UPCOMING', date: { gte: now } },
        orderBy: { date: 'asc' },
        take: 3,
      }),
      prisma.wellnessEntry.findMany({
        where: { userId, date: { gte: thirtyDaysAgo } },
        orderBy: { date: 'desc' },
        take: 30,
      }),
      wellnessService.getToday(userId),
    ]);

    // Compute current cycle day (days since last period started)
    const lastPeriod = periodData.entries[0] || null;
    let currentCycleDay: number | null = null;
    if (lastPeriod) {
      const diffMs = now.getTime() - lastPeriod.startDate.getTime();
      currentCycleDay = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
    }

    return {
      cycle: {
        currentCycleDay,
        lastPeriod: lastPeriod
          ? {
              startDate: lastPeriod.startDate,
              endDate: lastPeriod.endDate,
              flow: lastPeriod.flow,
            }
          : null,
        predictions: periodData.predictions,
      },
      todayWellness,
      recentSymptoms,
      recentCravings,
      upcomingAppointments,
      wellnessTrend: recentWellness,
    };
  },
};
