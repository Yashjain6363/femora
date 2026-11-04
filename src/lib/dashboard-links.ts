/** Dashboard and navigation feature shortcuts for FERMORA */

export type SiteFeatureLink = {
  label: string;
  href: string;
  description: string;
  icon: string;
};

export const SITE_FEATURE_LINKS: SiteFeatureLink[] = [
  {
    label: "Menstrual Tracker",
    href: "#tracker",
    description: "Log periods, view cycle dial & upcoming estimates",
    icon: "",
  },
  {
    label: "Craving Control",
    href: "#cravings",
    description: "Log cravings & discover balanced wellness snacks",
    icon: "",
  },
  {
    label: "Health Journal",
    href: "#journal",
    description: "Daily reflections, mood & energy level tracker",
    icon: "",
  },
  {
    label: "Health Reminder",
    href: "#reminders",
    description: "Period alerts, supplements & routine rituals",
    icon: "",
  },
  {
    label: "Period-aware Planning",
    href: "#planning",
    description: "Align activities with 4 natural cycle phases",
    icon: "",
  },
];
