"use client";

import { motion } from "framer-motion";
import {
  CalendarHeartIcon,
  BookHeartIcon,
  BellRingIcon,
  CalendarCheckIcon,
  UtensilsIcon,
  ArrowRightIcon,
} from "@/components/ui/icons";
import { LogoWatermark } from "@/components/shared/LogoWatermark";

interface TileData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  accentHex: string;
  accentBg: string;
  icon: typeof CalendarHeartIcon;
  features: string[];
}

const MODULE_ITEMS: TileData[] = [
  {
    id: "tracker",
    title: "Menstrual Tracker",
    subtitle: "Cycle & Phase Intelligence",
    description:
      "Log your cycle dates, track flow and symptoms, and view biological phases with clear distinction between records and forecasts.",
    href: "#tracker",
    accentHex: "#B66ACB", // Tile 1: Orchid
    accentBg: "rgba(182, 106, 203, 0.12)",
    icon: CalendarHeartIcon,
    features: ["4-Phase Cycle Dial", "Symptom & Mood Log", "Next Period Countdown"],
  },
  {
    id: "cravings",
    title: "Craving Control",
    subtitle: "Nutrient & Craving Wisdom",
    description:
      "Monitor food cravings, uncover underlying nutritional cues (magnesium, hydration, electrolytes), and enjoy guilt-free balanced swaps.",
    href: "#cravings",
    accentHex: "#D1BDF2", // Tile 2: Lavender
    accentBg: "rgba(209, 189, 242, 0.22)",
    icon: UtensilsIcon,
    features: ["Craving Frequency Patterns", "Root Nutrient Mapping", "Mindful Food Swaps"],
  },
  {
    id: "journal",
    title: "Health Journal",
    subtitle: "Reflections & Energy Levels",
    description:
      "A peaceful wellness sanctuary. Record daily reflections, track physical sensations, and search your personal health journey across time.",
    href: "#journal",
    accentHex: "#F2DCE7", // Tile 3: Blush
    accentBg: "rgba(242, 220, 231, 0.4)",
    icon: BookHeartIcon,
    features: ["Energy 1-5 Scale", "Symptom Tagging", "Searchable Timeline History"],
  },
  {
    id: "reminders",
    title: "Health Reminder",
    subtitle: "Centralized Care Schedule",
    description:
      "Timely reminders for period preparation, vitamins, hydration, and doctor appointments, customized around your specific routine.",
    href: "#reminders",
    accentHex: "#B66ACB", // Tile 4: Orchid
    accentBg: "rgba(182, 106, 203, 0.12)",
    icon: BellRingIcon,
    features: ["Cycle Phase Alerts", "Medication & Supplements", "Custom Wellness Rituals"],
  },
  {
    id: "planning",
    title: "Period-aware Planning",
    subtitle: "Life Synchronized with Energy",
    description:
      "Organize demanding projects, movement, and restorative downtime in harmony with the natural hormonal rhythm of your body.",
    href: "#planning",
    accentHex: "#E6DDF4", // Tile 5: Soft Lavender
    accentBg: "rgba(230, 221, 244, 0.4)",
    icon: CalendarCheckIcon,
    features: ["4-Phase Activity Guide", "Event Energy-Fit Tagging", "Flexible Daily Planner"],
  },
];

export function ModuleTiles() {
  return (
    <section
      id="modules"
      aria-label="Core FERMORA modules"
      className="relative py-24 px-4 bg-[#F8F3E9] border-t border-[#E8DFD5]"
    >
      <LogoWatermark variant="corner-top-right" size={220} opacity={0.03} />

      <div className="container-max section-padding relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#B66ACB]">
            Interactive Wellness Architecture
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-[#101F3B] tracking-tight">
            Designed for every phase of you
          </h2>
          <p className="text-base sm:text-lg text-[#26334A]/75 font-light">
            Five unified modules providing clarity, comfort, and personalized
            insights throughout your cycle.
          </p>
        </div>

        {/* 2-Column Editorial Grid (Never 3 cards in a row, strictly complying with Rule 6) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {MODULE_ITEMS.map((item, index) => {
            const IconComponent = item.icon;
            const isFeaturedLast = index === 4;

            return (
              <motion.a
                key={item.id}
                href={item.href}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
                className={`group relative flex flex-col justify-between rounded-xl bg-[#FAF7F2] p-6 sm:p-7 border border-[#E8DFD5] transition-all duration-200 ease-out hover:-translate-y-1.5 hover:border-[#B66ACB]/60 hover:bg-[#FAF4EB] active:translate-y-0 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B66ACB] focus-visible:ring-offset-2 overflow-hidden ${
                  isFeaturedLast ? "md:col-span-2" : ""
                }`}
              >
                {/* Subtle logo pattern in card corner with gentle hover opacity cue */}
                <LogoWatermark variant="card" size={130} opacity={0.035} className="transition-opacity duration-300 group-hover:opacity-[0.06]" />

                <div className="space-y-4 relative z-10">
                  {/* Icon & Index */}
                  <div className="flex items-center justify-between">
                    <div
                      className="w-11 h-11 rounded-lg flex items-center justify-center border border-[#E8DFD5]/80 transition-transform duration-200 ease-out group-hover:scale-105"
                      style={{ backgroundColor: item.accentBg }}
                    >
                      <IconComponent
                        size={20}
                        style={{ color: item.accentHex === "#E6DDF4" ? "#7A3E8E" : item.accentHex }}
                      />
                    </div>
                    <span className="text-xs font-mono font-medium tracking-wider text-[#26334A]/50 uppercase transition-colors duration-200 group-hover:text-[#B66ACB]">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Title & subtitle */}
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B66ACB]">
                      {item.subtitle}
                    </span>
                    <h3 className="text-xl font-semibold text-[#101F3B] group-hover:text-[#B66ACB] transition-colors duration-150 mt-0.5">
                      {item.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#26334A]/80 leading-relaxed font-light">
                    {item.description}
                  </p>

                  {/* Feature pills with subtle hover border response */}
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {item.features.map((feat) => (
                      <span
                        key={feat}
                        className="text-[10px] font-medium px-2.5 py-0.5 rounded-md bg-[#F8F3E9] text-[#101F3B]/80 border border-[#E8DFD5] transition-colors duration-200 group-hover:border-[#B66ACB]/30"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer link cue with smooth arrow slide */}
                <div className="pt-5 mt-5 border-t border-[#E8DFD5]/80 flex items-center justify-between text-xs font-medium text-[#101F3B] group-hover:text-[#B66ACB] transition-colors relative z-10">
                  <span>Explore {item.title}</span>
                  <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">
                    <ArrowRightIcon size={14} />
                  </span>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
