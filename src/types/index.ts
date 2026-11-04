export interface NavItem {
  label: string;
  href: string;
}

export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  gradient: string;
  isNew?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  college: string;
  quote: string;
  avatar: string;
  rating: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ComparisonItem {
  feature: string;
  sakhifi: boolean | string;
  others: boolean | string;
}

export interface FormState {
  status: "idle" | "loading" | "success" | "error";
  message: string;
}

export interface UniqueFeature {
  icon: string;
  title: string;
  description: string;
  tag: string;
}

export interface GamificationLevel {
  badge: string;
  name: string;
  xpRange: string;
  perks: string[];
  active?: boolean;
}

export interface CheckupItem {
  icon: string;
  colorClass: string;
  name: string;
  frequency: string;
  cost: string;
  prevents: string;
  description: string;
}

export interface StockRecommendation {
  logo: string;
  logoBg: string;
  name: string;
  type: string;
  change: string;
  changeDir: "up" | "down";
  tag: string;
}

export interface SIPTableRow {
  monthly: string;
  years: string;
  invested: string;
  returns: string;
  highlight?: boolean;
}

export interface DashboardGoal {
  emoji: string;
  name: string;
  progress: number;
}
