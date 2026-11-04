"use client";

import Link from "next/link";
import {
  CalendarHeartIcon,
  BookHeartIcon,
  BellRingIcon,
  CalendarCheckIcon,
  UtensilsIcon,
  ArrowRightIcon,
  ClockIcon,
  BatteryChargingIcon,
  CheckCircleIcon,
  HeartIcon,
  ChevronRightIcon,
  TrendingUpIcon,
} from "@/components/ui/icons";
import { LogoWatermark } from "@/components/shared/LogoWatermark";
import { useFermoraStore } from "@/hooks/useFermoraStore";
import { MODULE_TILES } from "@/lib/constants";

interface Props {
  userEmail?: string;
  userName?: string;
}

export function FermoraDashboardClient({ userEmail, userName }: Props) {
  const {
    profile,
    cycleMetrics,
    cravings,
    journal,
    reminders,
    planning,
    toggleReminder,
  } = useFermoraStore();

  const displayName =
    userName || (userEmail ? userEmail.split("@")[0] : "Wellness Seeker");

  const recentJournal = journal.slice(0, 2);
  const activeReminders = reminders.filter((r) => r.enabled).slice(0, 3);
  const recentCraving = cravings[0];

  return (
    <div className="space-y-10">
      {/* 1. Personalized Header */}
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#B66ACB]/15 text-[#7A3E8E] text-xs font-semibold uppercase tracking-wider border border-[#E8DFD5]">
          <HeartIcon size={13} className="text-[#B66ACB]" />
          Personal Health Space
        </div>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-[#101F3B]">
          Welcome, {displayName}
        </h1>
        <p className="text-sm sm:text-base text-[#26334A]/75 font-light max-w-xl">
          Today is Cycle Day {cycleMetrics.currentDay} · You are in your{" "}
          <span className="font-medium text-[#B66ACB]">{cycleMetrics.phaseName}</span>.
        </p>
      </header>

      {/* 2. Top Overview Row: Cycle Ring Card & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Cycle Ring Card (7 cols) */}
        <div className="md:col-span-7 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <LogoWatermark variant="card" size={140} opacity={0.035} />

          <div className="flex items-center justify-between pb-4 border-b border-[#E8DFD5] relative z-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#B66ACB]">
              Cycle Overview
            </span>
            <span className="text-xs text-[#26334A]/60">
              Avg {cycleMetrics.cycleLength} Days
            </span>
          </div>

          <div className="py-6 flex flex-col sm:flex-row items-center gap-6 relative z-10">
            {/* Mini Dial */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#E8DFD5"
                  strokeWidth="6"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#B66ACB"
                  strokeWidth="6"
                  strokeDasharray={`${
                    (cycleMetrics.currentDay / cycleMetrics.cycleLength) * 251
                  } 251`}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-[#26334A]/60 uppercase">Day</span>
                <span className="font-display text-2xl font-bold text-[#101F3B]">
                  {cycleMetrics.currentDay}
                </span>
                <span className="text-[10px] text-[#26334A]/60 font-mono">of {cycleMetrics.cycleLength}</span>
              </div>
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <h2 className="text-xl font-semibold text-[#101F3B]">
                {cycleMetrics.phaseName}
              </h2>
              <p className="text-xs text-[#26334A]/75 font-light leading-relaxed">
                {cycleMetrics.phaseDescription}
              </p>
              <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-[#F2DCE7] text-[#101F3B] border border-[#E8DFD5]">
                  Next period: {cycleMetrics.nextPeriodIso}
                </span>
                <span className="text-xs text-[#26334A]/60">
                  (Approx. {cycleMetrics.daysUntilNextPeriod} days away)
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E8DFD5] flex items-center justify-between relative z-10">
            <span className="text-xs text-[#26334A]/60">
              Last period logged: {profile.lastPeriodDate}
            </span>
            <Link
              href="/#tracker"
              className="text-xs font-medium text-[#B66ACB] hover:text-[#9C4EB3] flex items-center gap-1 transition-colors"
            >
              <span>Log period dates</span>
              <ChevronRightIcon size={14} />
            </Link>
          </div>
        </div>

        {/* Quick Vitals & Mood Card (5 cols) */}
        <div className="md:col-span-5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] p-6 sm:p-8 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8DFD5]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#101F3B]">
              Today&apos;s Wellness Pulse
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-[#E6DDF4] text-[#101F3B] border border-[#E8DFD5]">
              Synced
            </span>
          </div>

          <div className="space-y-3 py-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#F8F3E9] border border-[#E8DFD5] transition-all duration-150 ease-out hover:bg-[#FAF4EB] hover:border-[#B66ACB]/50 hover:-translate-y-0.5">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#B66ACB]" />
                <div>
                  <span className="block text-xs font-semibold text-[#101F3B]">
                    Predominant Mood
                  </span>
                  <span className="text-[11px] text-[#26334A]/65">Calm and Centered</span>
                </div>
              </div>
              <span className="text-xs font-medium text-[#B66ACB]">Optimal</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#F8F3E9] border border-[#E8DFD5] transition-all duration-150 ease-out hover:bg-[#FAF4EB] hover:border-[#B66ACB]/50 hover:-translate-y-0.5">
              <div className="flex items-center gap-2.5">
                <BatteryChargingIcon size={16} className="text-[#B66ACB]" />
                <div>
                  <span className="block text-xs font-semibold text-[#101F3B]">
                    Energy Status
                  </span>
                  <span className="text-[11px] text-[#26334A]/65">Level 4/5 · High Energy</span>
                </div>
              </div>
              <span className="text-xs font-medium text-[#7A3E8E]">Rising</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#F8F3E9] border border-[#E8DFD5] transition-all duration-150 ease-out hover:bg-[#FAF4EB] hover:border-[#B66ACB]/50 hover:-translate-y-0.5">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#D1BDF2]" />
                <div>
                  <span className="block text-xs font-semibold text-[#101F3B]">
                    Hydration Goal
                  </span>
                  <span className="text-[11px] text-[#26334A]/65">8 Glasses Target</span>
                </div>
              </div>
              <span className="text-xs font-medium text-[#B66ACB]">Logged</span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E8DFD5] text-right">
            <Link
              href="/#journal"
              className="text-xs font-medium text-[#B66ACB] hover:text-[#9C4EB3] transition-colors"
            >
              + Log new sensation
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Five Quick-Access Module Shortcuts */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-semibold text-[#101F3B]">
            Direct Access to Wellness Modules
          </h2>
          <span className="text-xs text-[#26334A]/60">5 Modules Active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {MODULE_TILES.map((tile) => (
            <Link
              key={tile.id}
              href={`/${tile.href}`}
              className="p-5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] transition-all duration-200 ease-out hover:-translate-y-1 hover:border-[#B66ACB]/70 hover:bg-[#FAF4EB] active:translate-y-0 active:scale-[0.99] group flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B66ACB]"
            >
              <div className="space-y-2">
                <div
                  className="w-9 h-9 rounded-md flex items-center justify-center border border-[#E8DFD5] transition-transform duration-200 ease-out group-hover:scale-110"
                  style={{ backgroundColor: `${tile.accentColor}25` }}
                >
                  <span
                    className="font-bold text-xs"
                    style={{ color: tile.accentColor === "#E6DDF4" ? "#7A3E8E" : tile.accentColor }}
                  >
                    ●
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-[#101F3B] group-hover:text-[#B66ACB] transition-colors">
                  {tile.title}
                </h3>
                <p className="text-xs text-[#26334A]/70 font-light line-clamp-2">
                  {tile.shortDesc}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#E8DFD5] flex items-center justify-between text-[11px] text-[#101F3B] group-hover:text-[#B66ACB] font-medium transition-colors">
                <span>Open</span>
                <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">
                  <ArrowRightIcon size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Modular Cards: 2-Column Editorial Structure (Strictly avoids 3 cards in one row, Rule 6) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Reflections */}
        <div className="rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD5]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#101F3B] flex items-center gap-1.5">
                <BookHeartIcon size={14} className="text-[#B66ACB]" />
                Recent Reflections
              </span>
              <Link href="/#journal" className="text-xs text-[#B66ACB] hover:text-[#9C4EB3] transition-colors">
                View all
              </Link>
            </div>

            {recentJournal.map((j) => (
              <div
                key={j.id}
                className="p-3 rounded-lg bg-[#F8F3E9] border border-[#E8DFD5] space-y-1 transition-all duration-150 ease-out hover:bg-[#FAF4EB] hover:border-[#B66ACB]/50 hover:-translate-y-0.5 cursor-default"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#101F3B] truncate">{j.title}</span>
                  <span className="text-[10px] text-[#26334A]/50 font-mono shrink-0">{j.date}</span>
                </div>
                <p className="text-xs text-[#26334A]/70 line-clamp-2 font-light">
                  {j.content}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/#journal"
            className="mt-4 w-full py-2.5 rounded-md border border-dashed border-[#B66ACB] text-xs font-semibold text-[#B66ACB] text-center hover:bg-[#B66ACB]/10 active:scale-[0.99] transition-all duration-150 block"
          >
            + New Journal Entry
          </Link>
        </div>

        {/* Active Reminders */}
        <div className="rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD5]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#101F3B] flex items-center gap-1.5">
                <BellRingIcon size={14} className="text-[#B66ACB]" />
                Active Care Reminders
              </span>
              <Link href="/#reminders" className="text-xs text-[#B66ACB] hover:text-[#9C4EB3] transition-colors">
                Manage
              </Link>
            </div>

            {activeReminders.map((r) => (
              <div
                key={r.id}
                className="p-3 rounded-lg bg-[#F8F3E9] border border-[#E8DFD5] flex items-center justify-between gap-2 transition-all duration-150 ease-out hover:bg-[#FAF4EB] hover:border-[#B66ACB]/50 hover:-translate-y-0.5"
              >
                <div className="min-w-0">
                  <span className="block text-xs font-semibold text-[#101F3B] truncate">
                    {r.title}
                  </span>
                  <span className="block text-[11px] text-[#26334A]/60 font-mono">
                    {r.time} · {r.frequency}
                  </span>
                </div>
                <button
                  onClick={() => toggleReminder(r.id)}
                  className="w-8 h-5 flex items-center rounded-full p-0.5 bg-[#B66ACB] hover:bg-[#9C4EB3] active:scale-95 transition-all cursor-pointer border border-[#9C4EB3]"
                  aria-label="Toggle reminder"
                >
                  <div className="bg-white w-3.5 h-3.5 rounded-full transform translate-x-3 transition-transform" />
                </button>
              </div>
            ))}
          </div>

          <Link
            href="/#reminders"
            className="mt-4 w-full py-2.5 rounded-md border border-dashed border-[#B66ACB] text-xs font-semibold text-[#B66ACB] text-center hover:bg-[#B66ACB]/10 active:scale-[0.99] transition-all duration-150 block"
          >
            + Add Reminder
          </Link>
        </div>

        {/* Craving & Nutrition Insight (Spans full width in 2-column grid) */}
        <div className="md:col-span-2 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#101F3B] flex items-center gap-1.5">
                <UtensilsIcon size={14} className="text-[#B66ACB]" />
                Craving Wisdom Insight
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#E6DDF4] text-[#7A3E8E] font-medium border border-[#E8DFD5]">
                Root Nutrients
              </span>
            </div>

            {recentCraving && (
              <p className="text-xs text-[#26334A]/80 font-light leading-relaxed">
                Recent craving: <span className="font-semibold text-[#101F3B] capitalize">{recentCraving.craving}</span> ({recentCraving.intensity}). {recentCraving.wellnessTip || "Pair rich cravings with magnesium and plenty of hydration."}
              </p>
            )}

            <div className="text-xs text-[#26334A]/70 font-light">
              <span className="font-semibold text-[#101F3B]">Nutrition Note: </span>
              In this phase, maintain sustained energy with complex grains, roasted seeds, and warm herbal infusions.
            </div>
          </div>

          <Link
            href="/#cravings"
            className="px-5 py-2.5 rounded-md bg-[#B66ACB] text-white hover:bg-[#9C4EB3] border border-[#9C4EB3] text-xs font-medium transition-colors shrink-0"
          >
            Explore Craving Swaps
          </Link>
        </div>
      </div>
    </div>
  );
}
