import { z } from 'zod';

export const createPeriodSchema = z.object({
  startDate: z.string().datetime({ message: 'Invalid start date' }),
  endDate: z.string().datetime({ message: 'Invalid end date' }).optional(),
  flow: z.enum(['SPOTTING', 'LIGHT', 'MEDIUM', 'HEAVY', 'VERY_HEAVY']).optional(),
  painLevel: z.number().int().min(0).max(10).optional().default(0),
  notes: z.string().max(1000).optional(),
});

export const updatePeriodSchema = createPeriodSchema.partial();

export type CreatePeriodInput = z.infer<typeof createPeriodSchema>;
export type UpdatePeriodInput = z.infer<typeof updatePeriodSchema>;

// ─── Craving ───────────────────────────────────
export const createCravingSchema = z.object({
  food: z.string().min(1).max(200).trim(),
  category: z.enum([
    'SWEET', 'SALTY', 'SOUR', 'SPICY', 'FATTY',
    'CARBS', 'PROTEIN', 'DAIRY', 'FRUITS', 'OTHER',
  ]),
  intensity: z.number().int().min(1).max(5),
  mood: z.string().max(100).optional(),
  notes: z.string().max(1000).optional(),
  loggedAt: z.string().datetime().optional(),
});

export const updateCravingSchema = createCravingSchema.partial();

export type CreateCravingInput = z.infer<typeof createCravingSchema>;
export type UpdateCravingInput = z.infer<typeof updateCravingSchema>;

// ─── Symptom ───────────────────────────────────
export const createSymptomSchema = z.object({
  symptom: z.enum([
    'CRAMPS', 'HEADACHE', 'FATIGUE', 'BLOATING', 'ACNE',
    'BACK_PAIN', 'BREAST_TENDERNESS', 'NAUSEA', 'MOOD_SWINGS', 'INSOMNIA', 'OTHER',
  ]),
  severity: z.number().int().min(1).max(5),
  notes: z.string().max(1000).optional(),
  loggedAt: z.string().datetime().optional(),
});

export const updateSymptomSchema = createSymptomSchema.partial();

export type CreateSymptomInput = z.infer<typeof createSymptomSchema>;
export type UpdateSymptomInput = z.infer<typeof updateSymptomSchema>;

// ─── Wellness ──────────────────────────────────
export const createWellnessSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  sleepHours: z.number().min(0).max(24).optional(),
  mood: z.number().int().min(1).max(5).optional(),
  energyLevel: z.number().int().min(1).max(5).optional(),
  stressLevel: z.number().int().min(1).max(5).optional(),
  waterIntake: z.number().min(0).max(20).optional(),
  notes: z.string().max(1000).optional(),
});

export const updateWellnessSchema = createWellnessSchema.partial();

export type CreateWellnessInput = z.infer<typeof createWellnessSchema>;
export type UpdateWellnessInput = z.infer<typeof updateWellnessSchema>;

// ─── Appointment ───────────────────────────────
export const createAppointmentSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  date: z.string().datetime({ message: 'Invalid appointment date' }),
  provider: z.string().max(200).optional(),
  location: z.string().max(300).optional(),
  notes: z.string().max(1000).optional(),
});

export const updateAppointmentSchema = z.object({
  title: z.string().min(1).max(200).trim().optional(),
  date: z.string().datetime().optional(),
  provider: z.string().max(200).optional(),
  location: z.string().max(300).optional(),
  notes: z.string().max(1000).optional(),
  status: z.enum(['UPCOMING', 'COMPLETED', 'CANCELLED']).optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
