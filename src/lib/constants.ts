import type {
  NavItem,
  Feature,
  FAQItem,
  ComparisonItem,
  UniqueFeature,
} from "@/types";

export const SITE_CONFIG = {
  name: "FERMORA",
  tagline: "Your body. Your patterns. Your wellness.",
  description:
    "FERMORA is a premium, modern, intelligent women's wellness and menstrual health tracking platform. Understand your cycle, balance cravings, reflect mindfully, and plan life in harmony with your natural rhythm.",
  url: "https://fermora.app",
  ogImage: "/images/femora.logo.png",
  logo: "/images/femora.logo.png",
  email: "care@fermora.app",
  social: {
    instagram: "https://instagram.com/fermora.wellness",
    linkedin: "https://linkedin.com/company/fermora",
    twitter: "https://twitter.com/fermora_health",
  },
} as const;

export const NAV_ITEMS: NavItem[] = [
  { label: "Menstrual Tracker", href: "#tracker" },
  { label: "Craving Control", href: "#cravings" },
  { label: "Health Journal", href: "#journal" },
  { label: "Health Reminder", href: "#reminders" },
  { label: "Period Planning", href: "#planning" },
];

export interface ModuleTileInfo {
  id: string;
  title: string;
  shortDesc: string;
  href: string;
  accentColor: string;
  accentName: string;
  iconName: string;
}

export const MODULE_TILES: ModuleTileInfo[] = [
  {
    id: "tracker",
    title: "Menstrual Tracker",
    shortDesc: "Intelligent cycle tracking, phase countdowns, and symptom insights.",
    href: "#tracker",
    accentColor: "#B66ACB",
    accentName: "Orchid",
    iconName: "CalendarHeart",
  },
  {
    id: "cravings",
    title: "Craving Control",
    shortDesc: "Mindful craving logs, root nutrient insights, and balanced wellness swaps.",
    href: "#cravings",
    accentColor: "#D1BDF2",
    accentName: "Lavender",
    iconName: "Utensils",
  },
  {
    id: "journal",
    title: "Health Journal",
    shortDesc: "Daily reflections, mood records, energy levels, and timeline history.",
    href: "#journal",
    accentColor: "#F2DCE7",
    accentName: "Blush",
    iconName: "BookHeart",
  },
  {
    id: "reminders",
    title: "Health Reminder",
    shortDesc: "Centralized period alerts, supplement schedules, and wellness rituals.",
    href: "#reminders",
    accentColor: "#B66ACB",
    accentName: "Orchid",
    iconName: "BellRing",
  },
  {
    id: "planning",
    title: "Period-aware Planning",
    shortDesc: "Harmonize work, movement, and rest with your natural 4-phase rhythm.",
    href: "#planning",
    accentColor: "#E6DDF4",
    accentName: "Soft Lavender",
    iconName: "CalendarCheck",
  },
];

export const TRUST_STATS = [
  { value: 120000, suffix: "+", label: "Active Cycles Tracked" },
  { value: 99, suffix: "%", label: "Private & Encrypted" },
  { value: 4.9, suffix: " / 5", label: "Average App Rating", decimal: true },
  { value: 4, suffix: " Phases", label: "Holistic Cycle Care" },
] as const;

export const FEATURES: Feature[] = [
  {
    id: "tracker",
    icon: "calendar",
    title: "Predictive Cycle Calendar",
    description:
      "Understand your unique cycle rhythm. View estimated phases, ovulation forecasts, and cycle history in an intuitive visual dial.",
    gradient: "from-[#B66ACB]/20 to-[#E6DDF4]/10",
  },
  {
    id: "cravings",
    icon: "cacao",
    title: "Intuitive Craving Wisdom",
    description:
      "Decode what your cravings signify, from magnesium in dark chocolate to hydration cues, with balanced, non-restrictive nourishment.",
    gradient: "from-[#D1BDF2]/25 to-[#F8F3E9]/20",
  },
  {
    id: "journal",
    icon: "journal",
    title: "Serene Wellness Journal",
    description:
      "A peaceful, private space to record daily reflections, mood fluctuations, energy patterns, and body sensations.",
    gradient: "from-[#F2DCE7]/30 to-[#EBD9CC]/15",
  },
  {
    id: "reminders",
    icon: "bell",
    title: "Centralized Health Reminders",
    description:
      "Never miss a cycle preparation window, supplement dose, hydration goal, or doctor's checkup with gentle, configurable alerts.",
    gradient: "from-[#B66ACB]/20 to-[#D1BDF2]/10",
  },
  {
    id: "planning",
    icon: "plan",
    title: "Period-Aware Life Planning",
    description:
      "Sync your calendar with your biological rhythm. Align demanding meetings with high-energy phases and protect time for deep rest.",
    gradient: "from-[#E6DDF4]/30 to-[#B66ACB]/10",
  },
  {
    id: "privacy",
    icon: "shield",
    title: "Zero-Knowledge Data Privacy",
    description:
      "Your reproductive health is deeply personal. FERMORA ensures end-to-end data encryption with zero third-party advertising sharing.",
    gradient: "from-[#EBD9CC]/25 to-[#F8F3E9]/10",
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Log Your Dates and Symptoms",
    description:
      "Easily input your cycle start date, flow intensity, mood, and daily sensations in a serene, uncluttered interface.",
    icon: "calendar",
  },
  {
    step: "02",
    title: "Observe Your Patterns",
    description:
      "FERMORA visualizes your natural transitions across the Menstrual, Follicular, Ovulatory, and Luteal phases.",
    icon: "chart",
  },
  {
    step: "03",
    title: "Nourish Mindfully",
    description:
      "Receive gentle suggestions for cravings, hydration, rest, and supplements tailored to where your body is today.",
    icon: "nourish",
  },
  {
    step: "04",
    title: "Plan in Harmony",
    description:
      "Design your personal and professional schedule to flow with your natural energy waves rather than fighting against them.",
    icon: "harmony",
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What is FERMORA and how does it help me?",
    answer:
      "FERMORA is a premium women's wellness companion designed to give you clarity on your menstrual cycle, daily energy fluctuations, cravings, and reminders. It provides a peaceful, unified space to track your symptoms and plan your life in tune with your body.",
  },
  {
    question: "How does FERMORA protect my personal health data?",
    answer:
      "Your health information is sacred. FERMORA adheres to strict privacy-by-design standards: your data is encrypted, never sold to third-party data brokers or advertisers, and completely under your control.",
  },
  {
    question: "Are the cycle forecasts medical diagnoses?",
    answer:
      "No. FERMORA's forecasts are educational estimates calculated using standard biological rhythms and your historical entries. We clearly distinguish user records from estimates and advise consulting a healthcare professional for clinical concerns.",
  },
  {
    question: "Can I use FERMORA if my cycles are irregular?",
    answer:
      "Yes. FERMORA accommodates irregular and fluctuating cycles. As you log more entries, you can observe symptom patterns and customize your reminders without rigid 28-day assumptions.",
  },
  {
    question: "What makes the Craving Control module unique?",
    answer:
      "Instead of restrictive dieting or guilt, FERMORA decodes what your body actually seeks, such as magnesium, zinc, or emotional warmth, and suggests delicious, nutrient-dense alternatives alongside balanced treats.",
  },
];

export const COMPARISON_ITEMS: ComparisonItem[] = [
  { feature: "Clean, non-pink feminine wellness aesthetic", sakhifi: true, others: false },
  { feature: "Integrated Craving Control and root nutrient suggestions", sakhifi: true, others: false },
  { feature: "Cycle-aware 4-phase personal activity planning", sakhifi: true, others: false },
  { feature: "Health journal with mood and energy correlation", sakhifi: true, others: "Limited" },
  { feature: "Centralized medication, appointment and cycle reminders", sakhifi: true, others: "Limited" },
  { feature: "Zero third-party advertising data sharing", sakhifi: true, others: "Varies" },
  { feature: "Clear distinction between user logs and estimated predictions", sakhifi: true, others: false },
];

export const UNIQUE_FEATURES: UniqueFeature[] = [
  {
    icon: "moon",
    title: "4-Phase Chronobiology",
    description:
      "Deep alignment with Menstrual, Follicular, Ovulatory, and Luteal phases to maximize productivity and self-compassion.",
    tag: "Science-Backed",
  },
  {
    icon: "shield",
    title: "Sovereign Health Privacy",
    description:
      "Designed with zero-knowledge encryption principles. Your reproductive history belongs strictly to you.",
    tag: "Privacy First",
  },
  {
    icon: "nourish",
    title: "Intuitive Nourishment",
    description:
      "Harmonize cravings with real bodily needs through magnesium-rich, anti-inflammatory food pairings.",
    tag: "Holistic Health",
  },
  {
    icon: "calendar",
    title: "Rhythm-Aware Scheduling",
    description:
      "Intelligently align creative brainstorming, movement, and gentle restorative evenings.",
    tag: "Life Sync",
  },
];

export const DASHBOARD_GOALS = [
  { name: "Cycle Awareness", progress: 85 },
  { name: "Hydration Balance", progress: 90 },
  { name: "Restorative Rituals", progress: 75 },
];

export const GAMIFICATION_LEVELS = [
  { badge: "01", name: "Awareness", xpRange: "0 - 500 XP", perks: ["Cycle logging", "Phase tips"] },
  { badge: "02", name: "In Tune", xpRange: "500 - 2K XP", perks: ["Craving insights", "Reminders"] },
  { badge: "03", name: "Synchronized", xpRange: "2K - 5K XP", perks: ["Full planning", "Journal trends"], active: true },
];

export const CHECKUP_ITEMS = [
  { icon: "iron", colorClass: "rose", name: "Complete Iron & CBC Panel", frequency: "Yearly", cost: "Standard", prevents: "Fatigue & Anaemia", description: "Essential baseline test for women's reproductive vitality." },
  { icon: "stethoscope", colorClass: "purple", name: "Gynecological Wellness Visit", frequency: "Yearly", cost: "Consultation", prevents: "Reproductive issues", description: "Routine preventative exam and pelvic ultrasound review." },
  { icon: "panel", colorClass: "green", name: "Thyroid & Vitamin D3/B12", frequency: "Yearly", cost: "Standard", prevents: "Hormonal fatigue", description: "Crucial for hormonal balance and cycle regularity." },
];
