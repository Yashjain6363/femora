export type CyclePhase = "menstrual" | "follicular" | "ovulatory" | "luteal";

export type FlowIntensity = "spotting" | "light" | "medium" | "heavy";

export type MoodType =
  | "calm"
  | "energized"
  | "happy"
  | "sensitive"
  | "irritable"
  | "anxious"
  | "tired"
  | "low";

export type SymptomType =
  | "cramps"
  | "bloating"
  | "headache"
  | "tender_breasts"
  | "fatigue"
  | "acne"
  | "backache"
  | "nausea"
  | "cravings";

export type CravingCategory =
  | "sweet"
  | "chocolate"
  | "salty"
  | "carbs"
  | "comfort_food"
  | "caffeine"
  | "spicy"
  | "savory";

export type CravingIntensity = "mild" | "moderate" | "intense";

export interface CycleEntry {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  flow?: FlowIntensity;
  symptoms: SymptomType[];
  mood: MoodType;
  notes?: string;
  waterGlasses?: number;
}

export interface CravingLog {
  id: string;
  date: string; // YYYY-MM-DD
  craving: CravingCategory;
  intensity: CravingIntensity;
  mood: MoodType;
  associatedPhase?: CyclePhase;
  notes?: string;
  wellnessTip?: string;
  satisfiedWith?: string;
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  content: string;
  mood: MoodType;
  energyLevel: 1 | 2 | 3 | 4 | 5;
  symptoms: SymptomType[];
  tags: string[];
}

export interface HealthReminder {
  id: string;
  title: string;
  time: string; // "09:00"
  category: "period" | "medication" | "appointment" | "wellness" | "custom";
  frequency: "daily" | "weekly" | "cycle_phase" | "monthly" | "once";
  phaseTarget?: CyclePhase;
  enabled: boolean;
  notes?: string;
}

export interface PlanningEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  phase: CyclePhase;
  energyFit: "restorative" | "creative" | "peak" | "grounded";
  notes?: string;
  completed: boolean;
}

export interface FermoraUserProfile {
  cycleLength: number; // default 28
  periodLength: number; // default 5
  lastPeriodDate: string; // YYYY-MM-DD
  regularity: "regular" | "somewhat_irregular" | "irregular" | "first_time";
  primaryGoals: string[];
  notificationsEnabled: boolean;
}
