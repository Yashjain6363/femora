export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface PeriodEntry {
  id: string;
  userId: string;
  startDate: string;
  endDate: string | null;
  flow: 'SPOTTING' | 'LIGHT' | 'MEDIUM' | 'HEAVY' | 'VERY_HEAVY';
  painLevel: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CyclePredictions {
  hasEnoughData: boolean;
  message: string | null;
  averageCycleLength: number | null;
  averagePeriodLength: number | null;
  estimatedNextPeriod: string | null;
}

export interface CravingEntry {
  id: string;
  userId: string;
  food: string;
  category: CravingCategory;
  intensity: number;
  mood: string | null;
  notes: string | null;
  loggedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type CravingCategory =
  | 'SWEET' | 'SALTY' | 'SOUR' | 'SPICY' | 'FATTY'
  | 'CARBS' | 'PROTEIN' | 'DAIRY' | 'FRUITS' | 'OTHER';

export interface SymptomEntry {
  id: string;
  userId: string;
  symptom: SymptomType;
  severity: number;
  notes: string | null;
  loggedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type SymptomType =
  | 'CRAMPS' | 'HEADACHE' | 'FATIGUE' | 'BLOATING' | 'ACNE'
  | 'BACK_PAIN' | 'BREAST_TENDERNESS' | 'NAUSEA' | 'MOOD_SWINGS' | 'INSOMNIA' | 'OTHER';

export interface WellnessEntry {
  id: string;
  userId: string;
  date: string;
  sleepHours: number | null;
  mood: number | null;
  energyLevel: number | null;
  stressLevel: number | null;
  waterIntake: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  userId: string;
  title: string;
  date: string;
  provider: string | null;
  location: string | null;
  notes: string | null;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  cycle: {
    currentCycleDay: number | null;
    lastPeriod: {
      startDate: string;
      endDate: string | null;
      flow: string;
    } | null;
    predictions: CyclePredictions;
  };
  todayWellness: WellnessEntry | null;
  recentSymptoms: SymptomEntry[];
  recentCravings: CravingEntry[];
  upcomingAppointments: Appointment[];
  wellnessTrend: WellnessEntry[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}
