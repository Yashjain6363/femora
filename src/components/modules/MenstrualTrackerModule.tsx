"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarHeartIcon,
  PlusIcon,
  DropletIcon,
  ShieldCheckIcon,
  CloseIcon,
  CheckIcon,
} from "@/components/ui/icons";
import { LogoWatermark } from "@/components/shared/LogoWatermark";
import { useFermoraStore } from "@/hooks/useFermoraStore";
import type { FlowIntensity, MoodType, SymptomType } from "@/types/fermora";

const FLOWS: { id: FlowIntensity; label: string; dropletCount: number }[] = [
  { id: "spotting", label: "Spotting", dropletCount: 1 },
  { id: "light", label: "Light", dropletCount: 2 },
  { id: "medium", label: "Medium", dropletCount: 3 },
  { id: "heavy", label: "Heavy", dropletCount: 4 },
];

const SYMPTOMS: { id: SymptomType; label: string }[] = [
  { id: "cramps", label: "Cramps" },
  { id: "bloating", label: "Bloating" },
  { id: "headache", label: "Headache" },
  { id: "tender_breasts", label: "Tender Breasts" },
  { id: "fatigue", label: "Fatigue" },
  { id: "acne", label: "Skin Breakout" },
  { id: "backache", label: "Lower Back Pain" },
];

const MOODS: { id: MoodType; label: string; dotColor: string }[] = [
  { id: "calm", label: "Calm", dotColor: "#7A3E8E" },
  { id: "energized", label: "Energized", dotColor: "#B66ACB" },
  { id: "happy", label: "Content", dotColor: "#D1BDF2" },
  { id: "sensitive", label: "Sensitive", dotColor: "#F2DCE7" },
  { id: "irritable", label: "Irritable", dotColor: "#26334A" },
  { id: "anxious", label: "Anxious", dotColor: "#101F3B" },
  { id: "tired", label: "Low Energy", dotColor: "#EBD9CC" },
];

export function MenstrualTrackerModule() {
  const { profile, cycleMetrics, cycles, addCycleEntry } = useFermoraStore();

  const [showLogModal, setShowLogModal] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState("");
  const [flow, setFlow] = useState<FlowIntensity>("medium");
  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomType[]>(["cramps"]);
  const [selectedMood, setSelectedMood] = useState<MoodType>("sensitive");
  const [notes, setNotes] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleSymptom = (sym: SymptomType) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addCycleEntry({
      startDate,
      endDate: endDate || undefined,
      flow,
      symptoms: selectedSymptoms,
      mood: selectedMood,
      notes: notes.trim() || undefined,
      waterGlasses: 8,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowLogModal(false);
    }, 1000);
  };

  const phasePercentage = Math.min(
    100,
    Math.round((cycleMetrics.currentDay / cycleMetrics.cycleLength) * 100)
  );

  return (
    <section
      id="tracker"
      aria-label="Menstrual tracker module"
      className="relative py-20 px-4 bg-[#F8F3E9] border-t border-[#E8DFD5]"
    >
      <LogoWatermark variant="corner-top-right" size={200} opacity={0.03} />

      <div className="container-max section-padding relative z-10">
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#B66ACB]/15 text-[#7A3E8E] text-xs font-semibold tracking-wide uppercase border border-[#E8DFD5]">
              <CalendarHeartIcon size={14} />
              Module 01 · Menstrual Tracker
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-[#101F3B]">
              Your cycle, visualized in harmony
            </h2>
            <p className="text-sm sm:text-base text-[#26334A]/75 font-light leading-relaxed">
              Track cycle start and end dates, physical sensations, and flow intensity.
              FERMORA models your biological transitions with complete transparency between user-logged
              records and estimated forecasts.
            </p>
          </div>

          <button
            onClick={() => setShowLogModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#B66ACB] text-white hover:bg-[#9C4EB3] border border-[#9C4EB3] transition-all duration-150 ease-out active:scale-[0.98] font-medium text-sm self-start md:self-auto cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B66ACB]"
          >
            <PlusIcon size={16} />
            Log Period or Symptoms
          </button>
        </div>

        {/* Top Cards: Visual Cycle Dial + Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Circular Interactive Dial (Left 5 Cols) */}
          <div className="lg:col-span-5 rounded-xl bg-[#FAF7F2] p-8 border border-[#E8DFD5] flex flex-col items-center justify-between text-center relative overflow-hidden transition-all duration-200 ease-out hover:border-[#B66ACB]/40">
            <div className="w-full flex items-center justify-between text-xs font-medium text-[#26334A]/60 pb-2 border-b border-[#E8DFD5]">
              <span>Current Status</span>
              <span>Average {cycleMetrics.cycleLength}-Day Cycle</span>
            </div>

            {/* Dial Graphic */}
            <div className="relative my-8 w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke="#E8DFD5"
                  strokeWidth="6"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke="#B66ACB"
                  strokeWidth="6"
                  strokeDasharray={`${phasePercentage * 2.64} 264`}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              {/* Inside dial text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <span className="text-[11px] uppercase tracking-widest text-[#B66ACB] font-semibold">
                  Cycle Day
                </span>
                <span className="font-display text-4xl sm:text-5xl font-bold text-[#101F3B] my-1">
                  {cycleMetrics.currentDay}
                </span>
                <span className="text-xs sm:text-sm font-medium text-[#26334A]/80 capitalize">
                  {cycleMetrics.phaseName}
                </span>
                <span className="text-[11px] text-[#26334A]/60 mt-1">
                  Approx. {cycleMetrics.daysUntilNextPeriod} days to next period
                </span>
              </div>
            </div>

            {/* Dial Footer Description */}
            <div className="w-full p-3.5 rounded-lg bg-[#F8F3E9] border border-[#E8DFD5] text-xs text-[#26334A]/80 leading-relaxed">
              <span className="font-semibold text-[#101F3B]">Phase Insight: </span>
              {cycleMetrics.phaseDescription}
            </div>
          </div>

          {/* Cycle Metrics & 4 Phases Breakdown (Right 7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            {/* Quick Stat Grid (4 columns, strictly avoids 3 cards in a row) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] transition-all duration-200 ease-out hover:-translate-y-1 hover:border-[#B66ACB]/50 hover:bg-[#FAF4EB] cursor-default">
                <span className="text-[11px] uppercase tracking-wider text-[#26334A]/60 font-semibold block mb-1">
                  Next Period
                </span>
                <span className="text-base sm:text-lg font-bold text-[#101F3B] block">
                  {cycleMetrics.nextPeriodIso}
                </span>
                <span className="text-[10px] text-[#B66ACB] font-medium">Estimated</span>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] transition-all duration-200 ease-out hover:-translate-y-1 hover:border-[#B66ACB]/50 hover:bg-[#FAF4EB] cursor-default">
                <span className="text-[11px] uppercase tracking-wider text-[#26334A]/60 font-semibold block mb-1">
                  Ovulation Day
                </span>
                <span className="text-base sm:text-lg font-bold text-[#101F3B] block">
                  Day {cycleMetrics.ovulationDay}
                </span>
                <span className="text-[10px] text-[#26334A]/60 font-medium">Cycle Midpoint</span>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] transition-all duration-200 ease-out hover:-translate-y-1 hover:border-[#B66ACB]/50 hover:bg-[#FAF4EB] cursor-default">
                <span className="text-[11px] uppercase tracking-wider text-[#26334A]/60 font-semibold block mb-1">
                  Fertile Window
                </span>
                <span className="text-base sm:text-lg font-bold text-[#101F3B] block">
                  Days {cycleMetrics.fertileWindow.startDay}-{cycleMetrics.fertileWindow.endDay}
                </span>
                <span className="text-[10px] text-[#26334A]/60 font-medium">Approximate</span>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] transition-all duration-200 ease-out hover:-translate-y-1 hover:border-[#B66ACB]/50 hover:bg-[#FAF4EB] cursor-default">
                <span className="text-[11px] uppercase tracking-wider text-[#26334A]/60 font-semibold block mb-1">
                  Cycle Length
                </span>
                <span className="text-base sm:text-lg font-bold text-[#101F3B] block">
                  {cycleMetrics.cycleLength} Days
                </span>
                <span className="text-[10px] text-[#26334A]/60 font-medium capitalize">
                  {profile.regularity}
                </span>
              </div>
            </div>

            {/* 4 Phases Timeline Cards */}
            <div className="rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] p-5 space-y-4">
              <h3 className="text-xs font-semibold text-[#101F3B] uppercase tracking-wider">
                Biological 4-Phase Chronology
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Menstrual Phase */}
                <div
                  className={`p-3.5 rounded-lg border transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[#B66ACB]/60 cursor-default ${
                    cycleMetrics.phase === "menstrual"
                      ? "border-[#B66ACB] bg-[#F2DCE7]/40 font-medium"
                      : "border-[#E8DFD5] bg-[#F8F3E9]/60"
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold mb-1">
                    <span className="text-[#101F3B]">1. Menstrual Phase</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E8DFD5] text-[#26334A]/80">
                      Days 1-5
                    </span>
                  </div>
                  <p className="text-[#26334A]/75 leading-relaxed font-light">
                    Hormones at baseline. Energy turns inward; honor restorative rest and warm comfort.
                  </p>
                </div>

                {/* Follicular Phase */}
                <div
                  className={`p-3.5 rounded-lg border transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[#B66ACB]/60 cursor-default ${
                    cycleMetrics.phase === "follicular"
                      ? "border-[#B66ACB] bg-[#D1BDF2]/30 font-medium"
                      : "border-[#E8DFD5] bg-[#F8F3E9]/60"
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold mb-1">
                    <span className="text-[#101F3B]">2. Follicular Phase</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E8DFD5] text-[#26334A]/80">
                      Days 6-12
                    </span>
                  </div>
                  <p className="text-[#26334A]/75 leading-relaxed font-light">
                    Estrogen rising. Mental clarity, creative curiosity, and physical endurance build.
                  </p>
                </div>

                {/* Ovulatory Phase */}
                <div
                  className={`p-3.5 rounded-lg border transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[#B66ACB]/60 cursor-default ${
                    cycleMetrics.phase === "ovulatory"
                      ? "border-[#B66ACB] bg-[#B66ACB]/15 font-medium"
                      : "border-[#E8DFD5] bg-[#F8F3E9]/60"
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold mb-1">
                    <span className="text-[#101F3B]">3. Ovulatory Phase</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E8DFD5] text-[#26334A]/80">
                      Days 13-16
                    </span>
                  </div>
                  <p className="text-[#26334A]/75 leading-relaxed font-light">
                    Peak LH and estrogen. Confidence, sharp articulation, and peak vitality.
                  </p>
                </div>

                {/* Luteal Phase */}
                <div
                  className={`p-3.5 rounded-lg border transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[#B66ACB]/60 cursor-default ${
                    cycleMetrics.phase === "luteal"
                      ? "border-[#B66ACB] bg-[#EBD9CC]/40 font-medium"
                      : "border-[#E8DFD5] bg-[#F8F3E9]/60"
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold mb-1">
                    <span className="text-[#101F3B]">4. Luteal Phase</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E8DFD5] text-[#26334A]/80">
                      Days 17-28
                    </span>
                  </div>
                  <p className="text-[#26334A]/75 leading-relaxed font-light">
                    Progesterone rises then dips. Grounded focus, craving comfort foods, setting boundaries.
                  </p>
                </div>
              </div>
            </div>

            {/* Transparency Disclaimer */}
            <div className="p-4 rounded-lg bg-[#E6DDF4]/40 border border-[#E8DFD5] flex items-start gap-3 text-xs text-[#26334A]/80">
              <ShieldCheckIcon size={18} className="text-[#B66ACB] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#101F3B]">Medical Notice: </span>
                FERMORA distinguishes between user-entered records and estimated biological forecasts.
                These predictions are educational models and do not represent clinical diagnoses or contraceptive certainty.
              </div>
            </div>
          </div>
        </div>

        {/* Cycle History Logs Table */}
        <div className="rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#101F3B] uppercase tracking-wider">
              Recorded Cycle History ({cycles.length} Entries)
            </h3>
            <span className="text-xs text-[#26334A]/60">Verified User Entries</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#E8DFD5] text-[#26334A]/60">
                  <th className="py-2.5 px-3 font-medium">Start Date</th>
                  <th className="py-2.5 px-3 font-medium">End Date</th>
                  <th className="py-2.5 px-3 font-medium">Flow</th>
                  <th className="py-2.5 px-3 font-medium">Symptoms Recorded</th>
                  <th className="py-2.5 px-3 font-medium">Mood</th>
                  <th className="py-2.5 px-3 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFD5]/60">
                {cycles.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F8F3E9]/60 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-[#101F3B]">{c.startDate}</td>
                    <td className="py-2.5 px-3 text-[#26334A]/75">{c.endDate || "Ongoing"}</td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-[#F2DCE7] text-[#101F3B] capitalize border border-[#E8DFD5]">
                        {c.flow || "Medium"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex flex-wrap gap-1">
                        {c.symptoms.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded-md bg-[#F8F3E9] text-[11px] text-[#26334A]/80 border border-[#E8DFD5]"
                          >
                            {s.replace("_", " ")}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 capitalize text-[#26334A]/85">{c.mood}</td>
                    <td className="py-2.5 px-3 text-[#26334A]/70 max-w-xs truncate">
                      {c.notes || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Log Modal (Clean, no glass, no drop shadow, warm alabaster surface) */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101F3B]/50 animate-fade-in">
          <div className="bg-[#FAF7F2] rounded-xl p-6 sm:p-8 max-w-lg w-full border border-[#E8DFD5] relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-2xl font-semibold text-[#101F3B]">
                Log Menstrual Entry
              </h3>
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="p-1 rounded-md text-[#26334A]/60 hover:text-[#101F3B] hover:bg-[#F8F3E9] transition-colors"
                aria-label="Close modal"
              >
                <CloseIcon size={18} />
              </button>
            </div>
            <p className="text-xs text-[#26334A]/70 mb-6">
              Record period start, symptoms, and daily wellness to update your personal cycle model.
            </p>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#101F3B] mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-[#E8DFD5] bg-[#F8F3E9] text-xs sm:text-sm text-[#101F3B] focus:outline-none focus:ring-2 focus:ring-[#B66ACB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#101F3B] mb-1">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-[#E8DFD5] bg-[#F8F3E9] text-xs sm:text-sm text-[#101F3B] focus:outline-none focus:ring-2 focus:ring-[#B66ACB]"
                  />
                </div>
              </div>

              {/* Flow selection (Minimalist indicators, zero emoji) */}
              <div>
                <label className="block text-xs font-semibold text-[#101F3B] mb-1.5">
                  Flow Intensity
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {FLOWS.map((f) => (
                    <button
                      type="button"
                      key={f.id}
                      onClick={() => setFlow(f.id)}
                      className={`p-2.5 rounded-md border text-center transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-[#B66ACB]/60 active:scale-95 active:translate-y-0 cursor-pointer ${
                        flow === f.id
                          ? "border-[#B66ACB] bg-[#B66ACB]/15 text-[#101F3B] font-semibold"
                          : "border-[#E8DFD5] bg-[#F8F3E9] text-[#26334A]/70 hover:bg-[#FAF7F2]"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-0.5 mb-1">
                        {Array.from({ length: f.dropletCount }).map((_, i) => (
                          <DropletIcon
                            key={i}
                            size={12}
                            className={flow === f.id ? "text-[#B66ACB]" : "text-[#26334A]/40"}
                          />
                        ))}
                      </div>
                      <div className="text-[11px]">{f.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <label className="block text-xs font-semibold text-[#101F3B] mb-1.5">
                  Observed Symptoms
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {SYMPTOMS.map((s) => {
                    const active = selectedSymptoms.includes(s.id);
                    return (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => toggleSymptom(s.id)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-[#B66ACB]/60 active:scale-95 active:translate-y-0 cursor-pointer ${
                          active
                            ? "bg-[#B66ACB] text-white border-[#B66ACB]"
                            : "bg-[#F8F3E9] text-[#26334A]/80 border-[#E8DFD5] hover:bg-[#E6DDF4]/40"
                        }`}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mood (Pill badges with soft status dots, zero emoji) */}
              <div>
                <label className="block text-xs font-semibold text-[#101F3B] mb-1.5">
                  Dominant Mood
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {MOODS.map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setSelectedMood(m.id)}
                      className={`px-2 py-2 rounded-md border text-center text-xs transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-[#B66ACB]/60 active:scale-95 active:translate-y-0 cursor-pointer ${
                        selectedMood === m.id
                          ? "border-[#B66ACB] bg-[#D1BDF2]/40 text-[#101F3B] font-semibold"
                          : "border-[#E8DFD5] bg-[#F8F3E9] text-[#26334A]/70 hover:bg-[#FAF7F2]"
                      }`}
                    >
                      <div
                        className="w-2 h-2 rounded-full mx-auto mb-1"
                        style={{ backgroundColor: m.dotColor }}
                      />
                      <div className="text-[10px] truncate">{m.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#101F3B] mb-1">
                  Personal Reflections / Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Warm ginger tea helped cramps; rested well..."
                  className="w-full px-3 py-2 rounded-md border border-[#E8DFD5] bg-[#F8F3E9] text-xs text-[#101F3B] focus:outline-none focus:ring-2 focus:ring-[#B66ACB]"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8DFD5]">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-md border border-[#E8DFD5] text-xs font-medium text-[#26334A] hover:bg-[#F8F3E9] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savedSuccess}
                  className="px-5 py-2 rounded-md bg-[#B66ACB] text-white hover:bg-[#9C4EB3] border border-[#9C4EB3] text-xs font-medium transition-colors cursor-pointer"
                >
                  {savedSuccess ? "Saved to FERMORA" : "Save Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
