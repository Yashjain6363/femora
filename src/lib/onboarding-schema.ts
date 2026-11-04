import { z } from "zod";

const moodOption = z.enum([
  "irritable_or_snappy",
  "low_energy",
  "anxious_or_wired",
  "tearful_or_sensitive",
  "mostly_stable",
  "prefer_not_to_say",
]);

const cravingOption = z.enum([
  "sweet",
  "salty",
  "comfort_food",
  "caffeine",
  "varies_no_pattern",
  "prefer_not_to_say",
]);

const cycleOption = z.enum([
  "regular",
  "somewhat_irregular",
  "not_tracking",
  "prefer_not_to_say",
]);

const stressOption = z.enum([
  "academics",
  "money",
  "relationships_social",
  "health_body",
  "future_career",
  "prefer_not_to_say",
]);

const sleepOption = z.enum([
  "great",
  "okay",
  "poor",
  "prefer_not_to_say",
]);

const movementOption = z.enum([
  "very_active",
  "moderate",
  "mostly_sedentary",
  "prefer_not_to_say",
]);

const moneyComfort = z.enum([
  "under_5k",
  "5k_to_15k",
  "15k_to_30k",
  "above_30k",
  "prefer_not_to_say",
]);

const investmentGoal = z.enum(["emergency", "growth", "short_term"]);

/** Client → POST /api/onboarding/save  -  server adds profileComplete + computed */
export const onboardingSaveBodySchema = z.object({
  gender: z.enum(["female", "male", "prefer_not_to_say"]),
  female: z
    .object({
      moodPatterns: z.array(moodOption).max(6).optional(),
      cravings: z.array(cravingOption).max(6).optional(),
      cycleRegularity: cycleOption.optional(),
    })
    .optional(),
  male: z
    .object({
      stressFocus: stressOption.optional(),
      sleepQuality: sleepOption.optional(),
      movementLevel: movementOption.optional(),
    })
    .optional(),
  moneyComfort: moneyComfort.optional(),
  /** yyyy-mm-dd if tracking; omit or empty if skipped */
  lastPeriodDate: z.string().optional(),
  salaryMonthlyInr: z.number().min(0).max(5_000_000),
  sipMonthlyInr: z.number().min(0).max(500_000),
  investmentGoal: investmentGoal,
});

export type OnboardingSaveBody = z.infer<typeof onboardingSaveBodySchema>;
