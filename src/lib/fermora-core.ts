import type {
  CyclePhase,
  CycleEntry,
  CravingLog,
  JournalEntry,
  HealthReminder,
  PlanningEvent,
  FermoraUserProfile,
  CravingCategory,
} from "@/types/fermora";

export const FERMORA_PALETTE = {
  bg: "#F8F3E9", // Warm Ivory
  text: "#101F3B", // Deep Navy
  mutedNavy: "#26334A", // Muted Navy
  orchid: "#B66ACB", // Primary accent
  softLavender: "#E6DDF4", // Secondary accent
  lavender: "#D1BDF2",
  blush: "#F2DCE7",
  mutedRose: "#EBD9CC",
  border: "#E8DFD5", // Warm Beige
} as const;

export const DEFAULT_PROFILE: FermoraUserProfile = {
  cycleLength: 28,
  periodLength: 5,
  lastPeriodDate: new Date(Date.now() - 12 * 86400000).toISOString().slice(0, 10), // 12 days ago
  regularity: "regular",
  primaryGoals: [
    "Understand cycle patterns",
    "Mindful craving management",
    "Energy-aligned planning",
  ],
  notificationsEnabled: true,
};

/** Calculate cycle metrics */
export function getCycleMetrics(
  lastPeriodDateStr: string = DEFAULT_PROFILE.lastPeriodDate,
  cycleLength: number = 28,
  periodLength: number = 5
) {
  const lastPeriod = new Date(lastPeriodDateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - lastPeriod.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Current day in cycle (1-based, wrapped around cycleLength)
  const currentDay = ((diffDays % cycleLength) + cycleLength) % cycleLength + 1;

  // Next period estimate
  const nextPeriodDate = new Date(lastPeriod);
  const cyclesElapsed = Math.floor(diffDays / cycleLength) + (diffDays >= 0 ? 1 : 0);
  nextPeriodDate.setDate(lastPeriod.getDate() + cyclesElapsed * cycleLength);
  const nextPeriodIso = nextPeriodDate.toISOString().slice(0, 10);
  const daysUntilNextPeriod = Math.max(0, cycleLength - currentDay + 1);

  // Ovulation estimate (typically 14 days before next period)
  const ovulationDay = Math.max(10, cycleLength - 14);
  const ovulationDate = new Date(nextPeriodDate);
  ovulationDate.setDate(nextPeriodDate.getDate() - 14);

  // Determine current phase
  let phase: CyclePhase = "follicular";
  let phaseName = "Follicular Phase";
  let phaseDescription = "Estrogen rising, energy building. Ideal time for creativity and starting new goals.";
  let phaseColor = "#B66ACB"; // Orchid

  if (currentDay <= periodLength) {
    phase = "menstrual";
    phaseName = "Menstrual Phase";
    phaseDescription = "Restorative inner winter. Listen to your body with gentle rest, warmth, and intuitive nourishment.";
    phaseColor = "#F2DCE7"; // Blush
  } else if (currentDay < ovulationDay - 1) {
    phase = "follicular";
    phaseName = "Follicular Phase";
    phaseDescription = "Rising energy, mental clarity, and renewal. Great time for social connections and new projects.";
    phaseColor = "#D1BDF2"; // Lavender
  } else if (currentDay <= ovulationDay + 1) {
    phase = "ovulatory";
    phaseName = "Ovulatory Phase";
    phaseDescription = "Peak confidence, communication, and vibrant vitality. Your magnetic phase.";
    phaseColor = "#B66ACB"; // Orchid
  } else {
    phase = "luteal";
    phaseName = "Luteal Phase";
    phaseDescription = "Turning inward, grounded focus, nesting, and craving comfort. Honor your boundaries.";
    phaseColor = "#EBD9CC"; // Muted Rose
  }

  return {
    currentDay,
    cycleLength,
    periodLength,
    phase,
    phaseName,
    phaseDescription,
    phaseColor,
    nextPeriodIso,
    daysUntilNextPeriod,
    ovulationDay,
    fertileWindow: {
      startDay: Math.max(1, ovulationDay - 4),
      endDay: Math.min(cycleLength, ovulationDay + 1),
    },
  };
}

/** Balanced, non-restrictive wellness suggestions for cravings */
export const CRAVING_SUGGESTIONS: Record<
  CravingCategory,
  { name: string; why: string; suggestion: string; nutrients: string }
> = {
  chocolate: {
    name: "Dark Chocolate & Almonds",
    why: "Body seeking magnesium to ease muscle tension & boost mood",
    suggestion: "Enjoy 2–3 squares of 70%+ dark chocolate with a handful of raw or roasted almonds.",
    nutrients: "Rich in Magnesium, Iron & Flavonoids",
  },
  sweet: {
    name: "Berry Chia Parfait or Dates",
    why: "Rapid blood sugar drops during hormonal shifts",
    suggestion: "Greek yogurt with fresh berries and chia seeds, or Medjool dates with tahini/peanut butter.",
    nutrients: "Natural fiber, gut-friendly probiotics, sustained glucose",
  },
  salty: {
    name: "Roasted Makhana / Sea Salt Edamame",
    why: "Electrolyte balance shifts and adrenal support needs",
    suggestion: "Lightly toasted makhana (foxnuts) in ghee and pink salt, or warm sea-salted edamame.",
    nutrients: "Potassium, zinc, clean protein without water retention",
  },
  carbs: {
    name: "Sweet Potato Bowl or Sourdough Avocado Toast",
    why: "Serotonin dips naturally prior to menstruation",
    suggestion: "Roasted sweet potato cubes with olive oil and pumpkin seeds, or whole-grain sourdough toast.",
    nutrients: "Complex carbs, B-vitamins, tryptophan for mood balance",
  },
  comfort_food: {
    name: "Warm Lentil Khichdi or Bone/Miso Broth",
    why: "Digestive fire slows down; seeking soothing emotional warmth",
    suggestion: "Gentle moong dal khichdi with cumin and ghee, or steaming broth with herbs.",
    nutrients: "Easily digestible protein, gut soothing, deeply grounding",
  },
  caffeine: {
    name: "Matcha Latte or Peppermint Tea",
    why: "Low cellular energy and progesterone-driven fatigue",
    suggestion: "Swap high-acid espresso for antioxidant-packed matcha or invigorating peppermint tea.",
    nutrients: "L-Theanine for calm focus, zero jittery crash",
  },
  spicy: {
    name: "Warm Chai with Ginger & Cardamom",
    why: "Sluggish circulation seeking thermogenic stimulation",
    suggestion: "Freshly crushed ginger chai or golden turmeric milk with black pepper.",
    nutrients: "Anti-inflammatory curcumin, circulatory stimulation",
  },
  savory: {
    name: "Herb Hummus with Crisp Veggie Sticks",
    why: "Need for healthy fats and stabilizing minerals",
    suggestion: "Creamy garlic or beet hummus with cucumber, bell pepper, and seed crackers.",
    nutrients: "Plant protein, folates, healthy monounsaturated fats",
  },
};

/** Phase planning guide recommendations */
export const PHASE_PLANNING_GUIDE = {
  menstrual: {
    title: "Menstrual Phase",
    days: "Days 1–5",
    theme: "Rest, Reset & Deep Intuition",
    energy: "Gentle & Reflective",
    activities: [
      "Light stretching, gentle walks, restorative yin yoga",
      "Journaling, self-reflection, planning for the coming month",
      "Warm baths with Epsom salt, cozy evenings, early bedtime",
      "Low-pressure creative tasks, decluttering your mind",
    ],
    nutritionFocus: "Iron-rich foods, bone broth, warming stews, hydration with electrolytes",
    tagColor: "bg-[#F2DCE7] text-[#101F3B]",
  },
  follicular: {
    title: "Follicular Phase",
    days: "Days 6–12",
    theme: "Curiosity, Energy & Initiation",
    energy: "Rising & Vibrant",
    activities: [
      "Kickstarting new projects, learning new skills, brainstorming",
      "Cardio, strength training, dancing, higher-intensity movement",
      "Social outings, networking, scheduling challenging meetings",
      "Planning adventures, travel, or creative experiments",
    ],
    nutritionFocus: "Fresh crisp salads, fermented foods, lean proteins, sprout bowls",
    tagColor: "bg-[#D1BDF2] text-[#101F3B]",
  },
  ovulatory: {
    title: "Ovulatory Phase",
    days: "Days 13–16",
    theme: "Magnetism, Connection & Confidence",
    energy: "Peak Radiance",
    activities: [
      "Public speaking, client pitches, leadership presentations",
      "Social gatherings, dating, hosting dinners with friends",
      "Peak workout performance (HIIT, heavy lifts, competitive sports)",
      "High-stakes negotiations and bold creative choices",
    ],
    nutritionFocus: "Cruciferous vegetables (broccoli, cabbage), fiber for estrogen balance, berries",
    tagColor: "bg-[#B66ACB]/20 text-[#101F3B]",
  },
  luteal: {
    title: "Luteal Phase",
    days: "Days 17–28",
    theme: "Focus, Organization & Compassionate Boundaries",
    energy: "Grounded & Inward",
    activities: [
      "Wrapping up unfinished projects, organizing files, deep cleaning",
      "Pilates, moderate resistance training, scenic nature walks",
      "Setting personal boundaries, creating cozy sanctuaries at home",
      "Comfort cooking, reading, practicing calm bedtime routines",
    ],
    nutritionFocus: "Magnesium-dense snacks, root vegetables, dark chocolate, chamomile tea",
    tagColor: "bg-[#EBD9CC] text-[#101F3B]",
  },
};

/** Default Sample Data for Initial Exploration */
export const SAMPLE_CYCLE_LOGS: CycleEntry[] = [
  {
    id: "cyc-1",
    startDate: new Date(Date.now() - 12 * 86400000).toISOString().slice(0, 10),
    endDate: new Date(Date.now() - 8 * 86400000).toISOString().slice(0, 10),
    flow: "medium",
    symptoms: ["cramps", "fatigue"],
    mood: "calm",
    notes: "Felt restorative; stayed well-hydrated with ginger tea.",
    waterGlasses: 8,
  },
  {
    id: "cyc-2",
    startDate: new Date(Date.now() - 40 * 86400000).toISOString().slice(0, 10),
    endDate: new Date(Date.now() - 35 * 86400000).toISOString().slice(0, 10),
    flow: "heavy",
    symptoms: ["cramps", "bloating", "tender_breasts"],
    mood: "sensitive",
    notes: "Used warm compress on Day 2. Magnesium helped with cramps.",
    waterGlasses: 7,
  },
];

export const SAMPLE_CRAVINGS: CravingLog[] = [
  {
    id: "crav-1",
    date: new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10),
    craving: "chocolate",
    intensity: "moderate",
    mood: "calm",
    associatedPhase: "follicular",
    wellnessTip: "Enjoyed 2 squares 75% dark chocolate with walnuts.",
    satisfiedWith: "Dark chocolate & roasted walnuts",
  },
  {
    id: "crav-2",
    date: new Date(Date.now() - 5 * 86400000).toISOString().slice(0, 10),
    craving: "salty",
    intensity: "mild",
    mood: "happy",
    associatedPhase: "follicular",
    wellnessTip: "Had roasted salted makhana  -  felt light and satisfied.",
    satisfiedWith: "Ghee roasted makhana",
  },
  {
    id: "crav-3",
    date: new Date(Date.now() - 11 * 86400000).toISOString().slice(0, 10),
    craving: "comfort_food",
    intensity: "intense",
    mood: "tired",
    associatedPhase: "menstrual",
    wellnessTip: "Warm moong dal khichdi with extra ghee gave deep comfort.",
    satisfiedWith: "Warm khichdi",
  },
];

export const SAMPLE_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: "jrn-1",
    date: new Date().toISOString().slice(0, 10),
    title: "Morning clarity & rising energy",
    content:
      "Woke up feeling refreshed. As estrogen climbs in the follicular phase, my focus is sharp. Completed a creative writing session and enjoyed 30 minutes of pilates.",
    mood: "energized",
    energyLevel: 4,
    symptoms: [],
    tags: ["follicular", "pilates", "focus"],
  },
  {
    id: "jrn-2",
    date: new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10),
    title: "Gentle recovery & herbal tea",
    content:
      "Transitioning past the final days of my period. Taking it easy, listened to an audio book, and had peppermint tea with raw honey.",
    mood: "calm",
    energyLevel: 3,
    symptoms: ["fatigue"],
    tags: ["recovery", "tea", "slow living"],
  },
  {
    id: "jrn-3",
    date: new Date(Date.now() - 10 * 86400000).toISOString().slice(0, 10),
    title: "Resting through Day 2",
    content:
      "Flow was medium to heavy today. Honored my body by canceling unnecessary social plans, keeping a heating pad close, and taking magnesium glycinate before bed.",
    mood: "sensitive",
    energyLevel: 2,
    symptoms: ["cramps", "fatigue"],
    tags: ["menstrual", "rest", "heating pad"],
  },
];

export const SAMPLE_REMINDERS: HealthReminder[] = [
  {
    id: "rem-1",
    title: "Morning Hydration & Lemon Water",
    time: "08:00",
    category: "wellness",
    frequency: "daily",
    enabled: true,
    notes: "Supports natural cellular hydration and gentle digestion.",
  },
  {
    id: "rem-2",
    title: "Evening Magnesium Glycinate",
    time: "21:30",
    category: "medication",
    frequency: "daily",
    enabled: true,
    notes: "Eases muscle cramps and supports restorative deep sleep.",
  },
  {
    id: "rem-3",
    title: "Period Prep & Essentials Check",
    time: "10:00",
    category: "period",
    frequency: "cycle_phase",
    phaseTarget: "luteal",
    enabled: true,
    notes: "Stock up on organic cotton pads, tea, and heat patches 3 days prior.",
  },
  {
    id: "rem-4",
    title: "Annual Gynecological Wellness Checkup",
    time: "11:00",
    category: "appointment",
    frequency: "once",
    enabled: true,
    notes: "Routine preventative exam and blood work review.",
  },
];

export const SAMPLE_PLANNING_EVENTS: PlanningEvent[] = [
  {
    id: "plan-1",
    date: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10),
    title: "Team Strategy Workshop & Pitch",
    phase: "ovulatory",
    energyFit: "peak",
    notes: "Scheduled during peak confidence and clear communication window.",
    completed: false,
  },
  {
    id: "plan-2",
    date: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10),
    title: "High-Intensity Barre Workout",
    phase: "ovulatory",
    energyFit: "peak",
    notes: "Strength and endurance peak around ovulation.",
    completed: false,
  },
  {
    id: "plan-3",
    date: new Date(Date.now() + 9 * 86400000).toISOString().slice(0, 10),
    title: "Financial Review & Home Organization",
    phase: "luteal",
    energyFit: "grounded",
    notes: "Channeling natural luteal attention to detail and nesting.",
    completed: false,
  },
  {
    id: "plan-4",
    date: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
    title: "Solo Evening: Bath, Book & Early Sleep",
    phase: "menstrual",
    energyFit: "restorative",
    notes: "Preserving energy on Day 1 of upcoming cycle.",
    completed: false,
  },
];
